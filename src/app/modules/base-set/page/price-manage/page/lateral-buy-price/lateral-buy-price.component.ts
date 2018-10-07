import {Component, OnInit} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {ConfirmationService} from "primeng/components/common/api";


@Component({
    templateUrl: './lateral-buy-price.component.html',
    styleUrls: [
        './lateral-buy-price.component.css'
    ]
})

export class LateralBuyPriceComponent implements OnInit{
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
    name='name';
    curIndex = 1;
    nameOrMobile;
    showAddEditWin: boolean = false;
    flag: any;
    msgs:any;
    // 初始化列
    columns: any[] = [];
    masterColumns: any[]=[];//左侧师傅列表
    data:any;
    masterData: any;//左侧师傅列表数据
    selection:any;
    selectedRows:any[]=[];
    selectedWorker:any={
        id:1111
    };
    branchArea: any;
    masterId;
    loading:boolean;
    ngOnInit(){
        this.initColumns();
        /**
         * 默认加载第一个师傅的数据
         */
        setTimeout(()=>this.api.call("goodsBranchPriceController.listBranchPrice",{first:0,rows:10},{
            userWorker:{
                id: this.masterData.content[0].id
            },
            area:{
                code: this.branchArea
            }
        }).ok(json => {
            this.data = json.result;
        }).fail(json=>{

        }),500);

    }
    initColumns(): void {
        this.columns.push({
            field: "area.mergeName",
            header: "省市区",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "agreementPrice",
            header: "协议价（元）",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "standardAgreementPrice",
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
            field: "user.realName",
            header: "更新人",
            sortable: false,
            filter: true
        });

        this.masterColumns.push({
            field: 'realName',
            header: '师傅姓名'
        });
        this.masterColumns.push({
            field: 'mobile',
            header: '电话'
        });
    }
    load(event){
        if(!event){
            event={first:0,rows:10};
        }
        this.api.call("goodsBranchPriceController.listBranchPrice",event,{userWorker:{
            id:this.selectedWorker.id
        },
            area:{
                code:this.branchArea
            }}).ok(json=>{
            this.data = json.result;
            this.loading = false;
        }).fail(json=>{
            this.showSuccess("error","查询失败！");
            this.loading = false;
        });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV2($event){
        this.api.call('goodsBranchPriceController.listBranchPrice', {
            first:0,
            rows:99999999
        }, {userWorker:{
            id:this.selectedWorker.id
        },
            area:{
                code:this.branchArea
            }})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }
    /**
     * 师傅列表数据加载方法
     * @param event
     */
    masterLoad(event){
        this.api.call("goodsBranchPriceController.listWorkerByNameOrMobile",event,{realName:this.nameOrMobile,mobile:this.nameOrMobile}).ok(json=>{
            this.masterData = json.result;
        }).fail(json=>{
            this.showSuccess("error","查询失败！");
        });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('goodsBranchPriceController.listWorkerByNameOrMobile', {
            first:0,
            rows:99999999
        }, {realName:this.nameOrMobile,mobile:this.nameOrMobile})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    rowSelect(event){
        this.selectedRows=event;
        this.selection = event[0];
    }

    /**
     * 师傅列表数据选择方法
     * @param event
     */
    masterRowSelect($event){
        let event={first:0,rows:10};
        this.selectedWorker=$event[0];
        this.masterId = this.selectedWorker.id;
        this.load(event);
    }

    /**
     * 隐藏弹窗
     */
    hidePopForm(event) {
        this.showAddEditWin = false;
        this.mask.hide();
        if(event){
            this.showSuccess("success", "操作成功！");
            this.load({first:0,rows:10});
            this.selectedRows = [];
            this.selection = {};
        }
    }

    /**
     * 显示弹窗
     */
    showPopForm(type) {
        switch (type){
            case 'add':
                if(!this.selectedWorker.realName){
                    this.showSuccess("warn","请选择一个师傅！");
                    return;
                }
                else {
                    this.flag = "addPrice";
                }
                break;
            case 'edit':
                if(this.selectedRows.length===0){
                    this.showSuccess("warn","请选择需要修改的数据！");
                    return;
                }
                else{
                    this.flag = "editPrice";
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
            this.showSuccess("warn","只能选择一条任务信息");
            return;
        }
        if(this.selectedRows.length===0){
            this.showSuccess("warn","请选择一条数据");
        }else{
            this.confirmationService.confirm({
                message: '确定要删除吗?',
                header: '提示',
                accept: () => {
                    this.api.call("goodsBranchPriceController.disableBranchPrice",{id:this.selection.id}).ok(json=>{
                        this.load({first:0,rows:10});
                        this.showSuccess("success","删除成功！");
                        this.selectedRows = [];
                    }).fail(json=>{
                        this.showSuccess("error","删除失败！");
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
    doSearch(event){
        event.first=0;
        event.rows=10;
        this.loading = true;
        this.load(event);
    }

    /**
     * 查询师傅
     */
    searchMaster(){
        this.masterLoad({first:0,rows:10});
    }
    /*公用提示组件*/
    showSuccess(severity:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:"提示", detail:detail});
    }

    /**
     * 当新增或修改已存在的地区时，确定操作后的逻辑
     * 因在子页面进行如下操作不能刷新父页面，因此这部分操作放在父页面执行
     * 解决确定后无法刷新表格与无法显示成功提示的问题
     * @param data
     */
    finishUpdate(data: any[]){
        switch (data[2]){
            case 'add':
                this.confirmationService.confirm({
                    message: '该师傅该地区已经有协议价，是否修改?',
                    header: '提示',
                    accept: () => {
                        this.api.call("goodsBranchPriceController.addBranchPrice",{
                            userWorker:{id:this.masterId},
                            area:{code:data[0]},
                            agreementPrice:data[1]
                        }).ok(json=>{
                            this.showSuccess("success", "操作成功！");
                            this.load({first:0,rows:10});
                            this.selectedRows = [];
                            this.selection = {};
                        }).fail(json=>{
                            this.showSuccess("error", "操作失败！");
                        });
                    }
                });
                break;
            case 'edit':
                this.confirmationService.confirm({
                    message: '该师傅该地区已经有协议价，是否修改?',
                    header: '提示',
                    accept: () => {
                        this.api.call("goodsBranchPriceController.updateBranchPrice",{
                            id:this.selection.id,
                            userWorker:{id:this.masterId},
                            area:{code:data[0]},
                            agreementPrice:data[1]
                        }).ok(json=>{
                            this.showSuccess("success", "操作成功！");
                            this.load({first:0,rows:10});
                            this.selectedRows = [];
                            this.selection = {};
                        }).fail(json=>{
                            this.showSuccess("error", "操作失败！");
                        });
                    }
                });
                break;
        }
    }
}
