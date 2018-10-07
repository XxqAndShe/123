import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {Message} from "primeng/primeng";
import {dataToTree} from "app/share/utils/dataToTree";
import {Router} from "@angular/router";
import {modalAnimation} from "app/share/animation/modalAnimation.animation";
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {ServiceInformationVo} from "./vo/service-information.vo";

@Component({
    templateUrl: './service-information.component.html',
    styleUrls: ['./service-information.component.css'],
    animations: [
        modalAnimation
    ]
})
export class ServiceInformationComponent implements OnInit {
    serviceInformationVo: ServiceInformationVo = new ServiceInformationVo();
    // 左边菜单
    menuData = [
        {
            "name": "所有文件",
        }, {
            "name": "加星文件",
        }];

    curArr = [];  // 记录哪个标签有current类样式
    curClick = [true, false];
    curIndex: number;
    //header
    header = [
        "文件名称-name-link",
        "文件内容-textFormat",
        "所属目录-categoryName",
        "文件类型-pdf",
        "修改时间-timeDate",
        "最近修改人-user",
    ];

    categories: any[] = [];
    //设置表格
    columns: any[] = [];
    //表格数据
    data: any;
    //选择数据
    selectionRow: any[] = [];
    loading: boolean = false;

    //文件名
    selectNodes: any[];

    btnTypeName: string = "";
    winName: string = "";
    addOrChange: boolean = false;
    fileType: string = "";
    // 选中的目录
    selectedCateId: string;
    selectedCategory: any;
    // 选中文件数据
    selectedData: any;

    msgs: Message[] = [];

    star: boolean = true;
    all: boolean = false;
    flag: boolean = true;
    articleUrl;
    isShow: boolean = false;
    menuIconShow: boolean[] = [false, false];

    constructor(public api: API,
                public router: Router,
                public mask: ShowOrHideMaskService) {
    }

    ngOnInit(): void {
        //搜索默认
        this.serviceInformationVo.pdf = "name";
        for (let i = 0; i < this.header.length; i++) {
            let arr = this.header[i].split('-');
            this.columns[i] = {};
            this.columns[i].field = arr[1];
            this.columns[i].header = arr[0];
            this.columns[i].sortable = false;
            this.columns[i].filter = true;
            if (arr[2]) {
                this.columns[i].link = true;
            }
        }
        this.curIndex = 0;
        for (let i = this.menuData.length - 1; i >= 0; --i) {
            if (i === this.curIndex) {
                this.curArr[i] = true;
            } else {
                this.curArr[i] = false;
            }
        }
        this.findCategories();

        // 设置高度
        let contentHeight = window.innerHeight - 300 + 'px';
        $("#navigation").css({"max-height": contentHeight});
    }

    changeNav(index) {
        this.curIndex = index;
        this.selectedCateId = "";
        this.serviceInformationVo.name = "";
        for (let i = this.menuData.length - 1; i >= 0; --i) {
            this.curArr[i] = false;
            if (i === index) {
                this.curArr[i] = true;
            }
        }
        if (index === 0) {
            //查询全部
            this.serviceInformationVo.categories = 'all';
            this.star = true;
            this.all = false;
        } else {
            this.serviceInformationVo.categories = 'star';
            this.star = false;
            this.all = false;
        }
        this.load({first: 0, rows: 10});

    }

    /**
     * 左侧目录数据
     */
    findCategories() {
        this.api.call('categoryController.findCategories', {}).ok(json => {
            this.categories = dataToTree(json.result);
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        })
    }

    /**
     * 左侧目录点击事件
     * @param $event
     * @param node 當前節點
     * @param t
     */
    cateClick($event, node, one) {
        //清空搜索框内容
        this.serviceInformationVo.name = "";
        one.isShow = !one.isShow;
        this.deExpandIcon(node);
        node['expanded'] = !node['expanded'];
        this.curArr = [false, false];
        this.selectedCateId = node.id;
        this.selectedData = node;
        this.star = true;
        this.all = true;
        //切换表格数据
        this.serviceInformationVo.categories = node.id;
        this.load({first: 0, rows: 10});

        //展开文件夹
        // this.showPanel($event);
    }

    /**
     * 收起子目錄
     * @param node
     */
    deExpandIcon(node) {
        if (node && node.children.length) {
            for (let n of node.children) {
                n.expanded = false;
                if (n.children && n.children.length) {
                    for (let n2 of n.children) {
                        n2.expanded = false;
                    }
                }
            }
        }
        if (node.parentId == -1) {
            for (let c of this.categories) {
                if (c.id !== node.id) {
                    if (c.expanded) {
                        c.expanded = false;
                    }
                }
            }
        }
    }

    showPanel(e) {
        e.stopPropagation();
        let tar = e.target;
        let tarUl = $(tar).siblings('ul');
        let liParent = $(tar).parent().siblings('li');
        for (let li of liParent) {
            $(li).find('ul').addClass('no')
        }

        if (tarUl.hasClass('no')) {
            tarUl.removeClass('no');
            tarUl.find('ul').addClass('no');
        } else {
            tarUl.addClass('no')
        }
    }

    load(event) {
        this.loading = true;
        this.selectionRow.length = 0;
        this.api.call("documentController.findDocument", event, {
            "categories": this.serviceInformationVo.categories,
            "name": this.serviceInformationVo.name,
            "pdf": this.serviceInformationVo.pdf,
        }).ok(json => {
            let result = json.result;
            // 去掉html标签
            result.content.forEach(item => {
                item.textFormat = item.text.replace(/<(?:.|\s)*?>/g, "");
            });
            this.data = result;
            this.loading = false;
        }).fail(err => {
            this.loading = false;
            this.showSuccess("error", "提示", err.error);
        });
    }

    /**
     * 查询
     */
    doSearch() {
        this.selectionRow = [];
        this.serviceInformationVo.categories = 'all';
        this.load({first: 0, rows: 10});
    }

    /**
     * 显示新增弹框
     */
    showWin(type: string, e?, item?) {
        e && e.stopPropagation();
        this.btnTypeName = '';
        switch (type) {
            case 'service-add':
                this.winName = type;
                this.addOrChange = false;
                this.fileType = 'HTML5';
                break;
            case 'edit':
                if (this.selectionRow.length < 1) {
                    this.showSuccess("warn", "提示", "请至少选择一条数据!");
                    return;
                }
                if (this.selectionRow.length > 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                this.fileType = 'HTML5';
                this.winName = 'service-add';
                this.addOrChange = true;
                break;
            case 'service-del':
                this.winName = type;
                break;
            case 'addFolder':
                this.winName = type;
                this.selectedCategory = item;
                break;
            case 'shareService':
                if (this.selectionRow.length < 1) {
                    this.showSuccess("warn", "提示", "请至少选择一条数据!");
                    return;
                }
                if (this.selectionRow.length > 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                this.winName = type;
                break;
            case 'service-import':
                this.winName = type;
                break;
            default:
                if (this.selectionRow.length < 1) {
                    this.showSuccess("warn", "提示", "请至少选择一条数据!");
                    return;
                }
                if (this.selectionRow.length > 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                this.winName = type;
                break;
        }
    }

    /**
     * 关闭弹窗
     * @param $event 是否刷新列表
     * @param type
     */
    closeWin() {
        this.winName = "";
        this.selectionRow.length = 0;
    }

    /**
     * 新增成功
     */
    success() {
        this.winName = "";
        this.load({first: 0, rows: 10});
        this.showSuccess("success", "提示", "操作成功！");
        this.findCategories();
    }
    /**
     * 新增成功
     */
    successImport() {
        this.winName = "";
        this.load({first: 0, rows: 10});
        this.findCategories();
    }

    /**
     * 文件夹删除成功
     */
    removeFile() {
        this.api.call("categoryController.deleteCategories", {'id': this.selectedData.id}).ok(json => {
            this.winName = "";
            this.findCategories();
            this.showSuccess("success", "提示", "操作成功！");

        }).fail(err => {
            this.winName = "";
            this.showSuccess("error", "提示", err.error);
        });
    }

    /**
     * 文档删除成功
     */
    removeDocument() {
        this.api.call("documentController.deleteDocument", {'id': this.selectionRow[0].id}).ok(json => {
            this.winName = "";
            this.selectionRow.length = 0;
            this.load({first: 0, rows: 10});
            this.showSuccess("success", "提示", "操作成功！");
        }).fail(err => {
            this.winName = "";
            this.showSuccess("error", "提示", err.error);
        });
    }


    /**
     * 勾选数据
     */
    rowSelect($event) {
        this.selectionRow = $event;
    }

    /**
     *  加星
     */
    addStar() {
        this.btnClick("");
        if (this.selectionRow.length === 0) {
            return this.showSuccess("warn", "提示", "请至少选择一条数据!");
        }
        if (this.selectionRow.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条数据!");
            return;
        }
        this.api.call("documentController.addDocumentStart",
            {
                id: this.selectionRow[0].id
            }
        ).ok(json => {
            this.showSuccess("success", "提示", "加星，操作成功！");
            this.load({first: 0, rows: 10});
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        });

    }

    /**
     * 移除加星
     */
    moveStar() {
        this.btnClick("");
        if (this.selectionRow.length === 0) {
            return this.showSuccess("warn", "提示", "请至少选择一条数据!");
        }
        if (this.selectionRow.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条数据!");
            return;
        }
        this.api.call("documentController.delDocumentStart",
            {id: this.selectionRow[0].id}
        ).ok(json => {
            this.showSuccess("success", "提示", "操作成功！");
            this.load({first: 0, rows: 10});
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        });
    }

    btnClick(name: string) {
        this.btnTypeName = name;
    }

    /**
     *  复制
     */
    copy() {
        this.btnClick("");
        if (this.selectionRow.length === 0) {
            return this.showSuccess("warn", "提示", "请至少选择一条数据!");
        }
        if (this.selectionRow.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条数据!");
            return;
        }
        this.api.call("documentController.copyDocument", {
            id: this.selectionRow[0].id
        }).ok(json => {
            this.load({first: 0, rows: 10});
            this.showSuccess("success", "提示", "复制，操作成功！");
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        });
    }

    /**
     * 重命名
     */
    edit() {
        this.btnClick("");
        let $highlightRow = $('tr.ui-state-highlight');
        if ($highlightRow.length === 0) {
            return this.showSuccess("warn", "提示", "请至少选择一条数据!");
        } else {
            let editableCln = $highlightRow.find('td.ui-editable-column');
            editableCln.find('div.ui-cell-editor').show();
        }
    }

    /**
     *  文件名称点击
     */
    cellClick($event) {
        console.log($event);
        let articleId = $event.row['id'];
        let articleUrl = location.protocol + '//' + location.host + '/article/' + articleId;
        window.open(articleUrl);
        // this.router.navigate(['/article', articleId]);
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}
