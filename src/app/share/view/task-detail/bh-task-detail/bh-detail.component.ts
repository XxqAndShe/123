import {Component, EventEmitter, Output, Input, OnInit, AfterViewInit} from "@angular/core";
import {MenuItem, Message} from "primeng/primeng";
import {API} from "../../../lib/api/api";
import {modalAnimation} from "../../../animation/modalAnimation.animation";
import {stringify} from "querystring";
import {ShowOrHideMaskService} from "../../../app-service/show-or-hide-mask.service";
import {NodeVo} from "../../../../modules/sale-center/page/abnormal-sale/vo/nodeVo";

@Component({
    selector: 'bh-detail',
    templateUrl: './bh-detail.component.html',
    styleUrls: [
        './bh-detail.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class BhDetailComponent implements OnInit,AfterViewInit {
    //选中行数据
    @Input() selectLineInfo;
    @Output() closeModal = new EventEmitter<any>();
    @Output() saveModal = new EventEmitter<any>();//终止订单保存
    isoperationEnd: boolean = false;//终止订单
    rowData: any;
    detailsVo: any;
    nodeVo: NodeVo;
    curModalIndex = -1;
    taskLogList: any;
    msgs: Message[] = [];
    columns: any = [];//轨迹信息表格
    imgUrls = [];
    //用于右侧弹出窗口的变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    isCanStop: boolean = true;//是否可以点击终止节点
    public infoTypeActive: string;   // 切换标签
    public items: MenuItem[];   // 进度
    totalActiveIndex: number = -1;  //节点进度
    timeArr: any[];  //任务状态下面的时间数组
    constructor(public api: API,
                public mask: ShowOrHideMaskService) {
    }

    ngOnInit() {
        this.rowData = this.selectLineInfo;
        //this.detailsVo = this.selectLineInfo;
        this.infoTypeActive = 'rwxx';
        this.items = [
            {
                label: '订单生成',
            },
            {
                label: 'TMS系统开单',
            }
        ];
        this.initColumns();
        //生成数据
        this.getDetailsInfo();
        this.findPartDetail();
    }

    close() {
        this.closeModal.emit();
    }

    load(event) {
        this.findPartGoods(event);
    }

    /**
     * 顶部节点数据
     */
    getDetailsInfo() {
        let selectRow = this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        let taskId = selectRow['id'];
        if (!taskId) {
            throw new Error('taskId 不能为空');
        }
        let qryParams = {
            "taskID": taskId
        }
        this.api.call("TaskDetailContorller.findPartTaskNode", qryParams).ok(json => {
            let result = json.result || {};
            console.info(result)
            if (result) {
                this.nodeVo = result;
                let taskStatus = this.nodeVo.taskStatus;
                if (taskStatus === "invalid") {
                    this.isCanStop = false;
                }
                //console.log('11111111111111111111111111111111111111111');
                //console.log(result);
                //节点进度
                //this.totalActiveIndex = result.nodeSort;
                //节点时间
                //this.timeArr = json.result.dataNode;
            }
        });
    }

    /**
     * 补件详情信息
     */
    findPartDetail() {
        let selectRow = this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        let taskId = selectRow['id'] || selectRow['taskID'];
        let waybillId = selectRow['waybillId'];
        if (!taskId) {
            throw new Error('taskId 不能为空');
        }
        let qryParams = {
            "taskID": taskId,
            "waybillId": waybillId
        }
        this.api.call("TaskDetailContorller.findPartDetail", qryParams).ok(json => {
            let result = json.result || {};
            console.info(result)
            if (result) {
                this.detailsVo = result;
                //异常图片
                this.imgUrls = result.partImg || {};
            }
        });
    }

    /**
     * 取补件对应货物明细
     */
    findPartGoods(event) {
        let selectRow = this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        let taskId = selectRow['id'] || selectRow['taskID'];
        let waybillId = selectRow['waybillId'];
        if (!taskId) {
            throw new Error('taskId 不能为空');
        }
        let qryParams = {
            "taskID": taskId,
            "waybillId": waybillId
        }
        this.api.call("TaskDetailContorller.findPartGoods",
            event, qryParams).ok(json => {
            this.taskLogList = json.result;
        });
    }

    // 标签切换
    selectInfoPanel(type): void {
        this.infoTypeActive = type;
        switch (type) {
            case 'xqxx':

                break;
            case 'gjxx':    //轨迹信息
                break;
            case 'ycxx':
                //alert("ycxx");
                break;
            case 'shxx':
                //alert("shxx");
                break;
            case 'gzxx':    //跟踪信息
                break;
        }
    }

    initColumns(): void {
        this.columns.push({
            field: "partsName",
            header: '品名',
            sortable: true
        });
        this.columns.push({
            field: "pieces",
            header: '件数',
            sortable: true
        });
        this.columns.push({
            field: "volume",
            header: '体积',
            sortable: true
        });
    }

    ngAfterViewInit(): void {
        this.initFancybox();
    }

    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }

    daSearch(e) {
        this.isModuleDisplayArr[1] = true;
        let that = this;
        setTimeout(function () {
            that.isModuleDisplayArr1[1] = true;
        }, 0);
        this.curModalIndex = 1;
    }

    closeModal2(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
    }

    showPanel() {
        this.isoperationEnd = true;
    }

    hideWin(event) {
        if (event) {
            this.showSuccess("warn", "提示", event);
            return;
        }
        this.isoperationEnd = false;//终止订单
        this.mask.hide();
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /**
     * 执行查询操作
     */
    public doSearch(): any {
        // debugger;
        ////console.log("doSearch");
        this.load({
            first: 0,
            rows: 10
        });
    }

    /**
     * 终止订单确认刷新*/
    doHideSave() {
        this.isoperationEnd = false;
        this.mask.hide();
        this.selectLineInfo.length = 0;
        this.doSearch();//刷新
        this.saveModal.emit();

    }

}
