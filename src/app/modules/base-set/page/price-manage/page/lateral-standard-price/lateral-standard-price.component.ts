import {Component, OnInit} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {ConfirmationService} from "primeng/components/common/api";


@Component({
    templateUrl: './lateral-standard-price.component.html',
    styleUrls: [
        './lateral-standard-price.component.css'
    ]
})

export class LateralStandardPriceComponent implements OnInit{
    constructor(
        public api:API,
        public confirmationService:ConfirmationService,
        public mask: ShowOrHideMaskService
    ){}
    // nav插件引用设置
    navs = ["安装价格","支线采购价","支线标准采购价"];
    navHrefs = [
        'modules/base-set/price-manage/install-price',
        'modules/base-set/price-manage/lateral-buy-price',
        'modules/base-set/price-manage/lateral-standard-price'
    ];
    curIndex = 2;
    area: any;
    showAddEditWin: boolean = false;
    flag: any;
    msgs:any;
    // 初始化列
    columns: any[] = [];
    data:any;
    selection:any;
    selectedRows:any[]=[];
    loading:boolean;
    ngOnInit(){
        this.initColumns();
    }
    initColumns(): void {
        this.columns.push({
            field: "branchStandardPurchasePriceId",
            header: "支线采购标准价id",
            sortable: false,
            filter: true,
            hidden: true
        });
        this.columns.push({
            field: "areaAdress",
            header: "省市区",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "standardPurchasePrice",
            header: "采购标准价(元)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "updateTime",
            header: "更新时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "updateMan",
            header: "更新人",
            sortable: false,
            filter: true
        })
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    load(event){
        this.getData(event);
    }

    rowSelect(event){
        this.selectedRows=event;
        this.selection = event[0];
    }

    /**
     * 隐藏弹窗
     */
    hidePopForm(event) {
        this.showAddEditWin = false;
        this.mask.hide();
        if(event){
            this.showSuccess("success", "提示", "操作成功！");
            this.load({first:0,rows:10});
            this.selectedRows = [];
            this.selection = {};
        }
    }

    /**
     * 获取支线标准采购价列表数据
     * @param data
     */
    getData(data:any){
        this.api.call("BranchStandardPriceController.findBranchStandardPurchasePrice",data,{
            code: this.area
        }).ok(json=>{
            this.loading = false;
            this.data = json.result || {};
        }).fail(data => {
            this.showSuccess("error", "提示", "查询失败！");
            this.loading = false;
        });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('BranchStandardPriceController.findBranchStandardPurchasePrice', {
            first:0,
            rows:99999999
        }, {code: this.area})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    /**
     * 显示弹窗
     */
    showPopForm(type) {
        switch (type){
            case 'add':
                this.flag = "addStan";
                break;
            case 'edit':
                if(this.selectedRows.length===0){
                    this.showSuccess("warn", "提示","请选择需要修改的数据！");
                    return;
                }
                else{
                    this.flag = "editStan";
                }
                break;
        }
        this.showAddEditWin = true;
        this.mask.show();
    }

    /**
     * 删除
     */
    delete(){
        //单选判断
        if(this.selectedRows.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if(this.selectedRows.length===0){
            this.showSuccess("warn","提示","请选择一条数据");
        }else{
            this.confirmationService.confirm({
                message: '确定要删除吗?',
                header: '提示',
                accept: () => {
                    this.api.call("BranchStandardPriceController.branchStandardPurchaseDelete",{
                        id: this.selection.branchStandardPurchasePriceId
                    }).ok(json=>{
                        this.showSuccess("success", "提示","删除成功!");
                        this.getData({first: 0, rows: 10});
                        this.selectedRows = [];
                    }).fail(data => {
                        this.showSuccess("error", "提示", "删除失败！");
                    });
                }
            });
        }
    }
    exportData(){

    }

    /**
     * 查询方法
     */
    doSearch(){
        this.loading = true;
        this.getData({first: 0, rows: 10});
    }

    /**
     * 当新增或修改已存在的地区时，确定操作后的逻辑
     * 因在子页面进行如下操作不能刷新父页面，因此这部分操作放在父页面执行
     * 解决确定后无法刷新表格与无法显示成功提示的问题
     * @param data
     */
    finishUpdate(data: any[]){
        switch (data[2]){
            case 'addStan':
                this.confirmationService.confirm({
                    message: '该地区已经有采购标准价，是否修改?',
                    header: '提示',
                    accept: () => {
                        this.api.call("BranchStandardPriceController.branchStandardPurchaseAddOrUpdate",{
                            areaCode: data[0],
                            standardPurchasePrice: data[1]
                        }).ok(json=>{
                            this.showSuccess("success", "提示", "操作成功！");
                            this.load({first:0,rows:10});
                            this.selectedRows = [];
                            this.selection = {};
                        }).fail(data => {
                            this.showSuccess("error", "提示", "操作失败！");
                        });
                    }
                });
                break;
            case 'editStan':
                this.confirmationService.confirm({
                    message: '该地区已经有采购标准价，是否修改?',
                    header: '提示',
                    accept: () => {
                        this.api.call("BranchStandardPriceController.branchStandardPurchaseAddOrUpdate",{
                            id: this.selection.branchStandardPurchasePriceId,
                            areaCode: data[0],
                            standardPurchasePrice: data[1]
                        }).ok(json=>{
                            this.showSuccess("success", "提示", "操作成功！");
                            this.load({first:0,rows:10});
                            this.selectedRows = [];
                            this.selection = {};
                        }).fail(data => {
                            this.showSuccess("error", "提示", "操作失败！");
                        });
                    }
                });
                break;
        }
    }
}
