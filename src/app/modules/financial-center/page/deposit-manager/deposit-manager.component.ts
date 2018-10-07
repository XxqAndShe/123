import {Component, OnInit, AfterViewInit} from "@angular/core";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {WithdrawAuditResponseVo} from "../../vo/withdraw-audit-response.vo";
import {PaidRequestVo} from "../../vo/paid-request.vo";
import {PaidResponseVo} from "../../vo/paid-response.vo";
import {WithdrawAuditRequestVo} from "../../vo/withdraw-audit-request.vo";
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";

@Component({
    selector: 'deposit-manager',
    templateUrl: './deposit-manager.component.html',
    styleUrls: ['./deposit-manager.component.css'],
    animations: [
        modalAnimation
    ]
})
export class DepositManagerComponent implements OnInit, AfterViewInit {

    constructor(public mask: ShowOrHideMaskService,public api:API) {
    }

    //师傅账号，姓名
    withdrawAuditRequestVo: WithdrawAuditRequestVo;

    //提现审批，任务明细responseVo
    withdrawAuditResponseVo: WithdrawAuditResponseVo[];

    //付款明细
    paidRequestVo: PaidRequestVo;
    paidResponseVo: PaidResponseVo[];
    anotherpaidRes:any;
    isshowModal:boolean[] = [false, false, false];//显示提现审核,任务明细侧边栏，0为提现审核，1为任务明细，2为师傅提现
    isshowModalAni:boolean[] = [false, false, false];//显示提现审核侧边栏动画
    loading:boolean = false;

    selectionRow:any[]=[]; //选中行
    selectionRowData:any; //

    rejectAduitingState:boolean = false;
    // 控制第一次加载不触发查询组件查询按钮加载表格
    isFirstLoad: boolean = true;

    /**
     * 表单组件
     */
    columns:any[]=[];

    data:any;

    selections:any;
    selected: any[]=[];//用于显示选中数据条数
    msgs:any;

    ngOnInit(): void {
        this.withdrawAuditRequestVo = new WithdrawAuditRequestVo();
        this.withdrawAuditResponseVo = [];
        this.initWtihdrawAuditResponse();
        this.initPaidResponse();
        this.paidRequestVo = new PaidRequestVo();
        this.columns.push({
            field:"wdNo",
            header:"提现流水号",
            sortable:false,
            filter:true
        });
        this.paidResponseVo = [];
        this.doQuery();
        this.columns.push({
            field:"companyDepartment",
            header:"所属网点",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"companyDepartmentMobile",
            header:"网点手机",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"realName",
            header:"师傅姓名",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"mobile",
            header:"师傅账号",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"withdrowType",
            header:"结款方式",
            sortable:false,
            filter:true
        });

        this.columns.push({
            field:"withdrawStatus",
            header:"提现状态",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"auditStatus",
            header:"审核状态",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"withdrawalAmount",
            header:"提现金额",
            sortable:false,
            filter:true
        });
        /*this.columns.push({
            field:"referCost",
            header:"参考成本",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"differential",
            header:"差价",
            sortable:false,
            filter:true,
            isWarn: true
        });*/
        this.columns.push({
            field:"paidMoney",
            header:"已付金额",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"noPaidMoney",
            header:"未付金额",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"userAccountType",
            header:"提现方式",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"bankAccount",
            header:"提现帐号",
            sortable:false,
            filter:true,
            width: '150px',
        });
        this.columns.push({
            field:"applyPerson",
            header:"申请人",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"applyTime",
            header:"申请时间",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"auditTime",
            header:"审批时间",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"auditPerson",
            header:"审批人",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"remarks",
            header:"审批备注",
            sortable:false,
            filter:true
        });
    }

    ngAfterViewInit(){
        this.isFirstLoad = false;
    }
    
    //提示弹框
    showSuccess(severity:string,summary:string,detail:string) {
      this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    load(page): any {
        /**
         * 提现列表查询
         */
        this.api.call("FinancialCenterController.withdrawListQuery", page, this.withdrawAuditRequestVo).ok(json => {
            this.data=json.result;
            this.loading = false;
        }).fail((err)=>{
            this.loading = false;
        });

    }
    /**
     * 导出
     */
    exportCSV($event){
        this.api.call('FinancialCenterController.withdrawListQuery', {
            first:0,
            rows:99999999
        }, this.withdrawAuditRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    //显示右键勾选编辑按钮
    isshowTitle = false;

    showTitle() {
        //this.isshowTitle = !this.isshowTitle;
        this.selectionRow=[];
    }

    //显示提现申请
    isshowDepositApply = false;
    //显示付款明细弹窗
    isshowPayDetail = false;
    //由子组件传值过来
    isshow(show: boolean) {
        this.isshowDepositApply = show;
        this.isshowPayDetail = show;
    }

    showDepositApply() {
        this.isshowDepositApply = true;
        this.mask.show();
    }

    displayWin() {
        //console.log(this.selected);
        // if(this.selectionRow.length !== 0){
        //     this.paidDetails();
        //     this.isshowPayDetail = true;
        // }else {
        //   this.showSuccess("warn","提示","请选择一条数据");
        // }
        //console.log(this.selectionRow);
        if(this.selectionRow.length === 0){
            this.showSuccess("warn","提示","请选择一条数据");
            return
        }
        if(this.selectionRow.length !== 0 && this.selected[0].paidMoney !==0) {
            this.paidDetails();
        }else {
            this.showSuccess("warn","提示","无付款记录");
        }
    }


    isshowTaskDetail(show: boolean){
        var that = this;
        this.isshowModal[1] = show;
        setTimeout(function () {
            that.isshowModalAni[1] = show;
        }, 0);
    }

    displayModal(index) {
        //this.doQuery();
        if(index==0 || index=="0"){
            //提现审批列表查询
            this.withdrawApply();
        }
        switch (index){
            case 0:
            case 1:
                if(this.selectionRow.length !== 0){
                    var that = this;
                    this.isshowModal[index] = true;
                    setTimeout(function () {
                        that.isshowModalAni[index] = true;
                    }, 0);
                }else{
                  this.showSuccess("warn","提示","请选择一条数据");
                    return;
                }
                break;
            default:
                var that = this;
                this.isshowModal[index] = true;
                setTimeout(function () {
                    that.isshowModalAni[index] = true;
                }, 0);
                /*
                * 师傅提现通过数据限制
                * */
              /*if(this.selectionRow.length !== 0){
                var that = this;
                this.isshowModal[index] = true;
                setTimeout(function () {
                    that.isshowModalAni[index] = true;
                }, 0);
              }else{
                this.showSuccess("warn","提示","请选择一条数据");
                return;
              }*/
                break;
        }

    }

    closeModal(show: boolean, index) {
        var that = this;
        this.isshowModalAni[index] = show;
        setTimeout(function () {
            that.isshowModal[index] = show;
            //操作之后自动刷新提现列表
            that.load({
                first: 0,
                rows: 10
            });
            that.selectionRow =[];
        }, 200);
    }

    doQuery(): any {
        if(!this.isFirstLoad) {
            this.load({
                first: 0,
                rows: 10
            });
        }
        this.withdrawAuditResponseVo = [
            {
                realName: "",
                mobile: "",
                withdrawAmount: "",
                applyTime: "",
                userAccount: "",
                bankAccount: "",
                accountName: "",
                bankName: "",
                subBranchName: "",
                waybillId: "",
                serviceType: "",
                productNames: "",
                consignee: "",
                consigneeAddr: "",
                taskAmount: "",
                standardCost: "",
                signTime: "",
                wdNo:"",
                auditState:"",
                withdrowType:"",
                taskType:""
            }
        ];

        this.paidResponseVo = [
            {
                totalPaidAmount:"",
                totalNoPaidAmount:"",
                withdrawStatus:"",
                withdrawalAmount:"",
                actPayNo:"",
                applyTime:"",
                auditState:"",
                bePayNo:"",
                noPaidAmount:"",
                paidAmount:"",
                userAccount:"",
                applyPerson:"",
                paidTime:"",
                paidPerson:""

            }
        ];
    }

    //付款明细
    paidDetails(): any {

        this.api.call("FinancialCenterController.paymentDetails", {first:0,rows:10}, this.paidRequestVo).ok(json => {
            if(json.result.content==null || json.result.content.length==0){
                this.initPaidResponse();
                this.paidResponseVo;
            }else{
                this.paidResponseVo = json.result.content;
                this.anotherpaidRes = json.result;
                this.isshowPayDetail = true;
            }
        }).fail((err)=>{
            ////console.log(err);
        });
        /* this.stateSearchService.doQeury(data => {
         this.paidResponseVo = data.result.content;
         ////console.log("paidResponseVo");
         ////console.log(this.paidResponseVo);
         }, 'PaidController.paymentDetails', this.paidRequestVo);*/

        // this.paidResponseVo = [
        //     {
        //         applyPerson: 'pcLee1',
        //         applyTime: '2017-2-28',
        //         withdrawStatus: '提现中',
        //         userAccount: '支付宝',
        //         paidWaybill: '1111',
        //         withdrawalAmount: '10',
        //         paidAmount: '5',
        //         noPaidAmount: '5'
        //     },
        //     {
        //         applyPerson: 'pcLee2',
        //         applyTime: '2017-2-28',
        //         withdrawStatus: '提现中',
        //         userAccount: '支付宝',
        //         paidWaybill: '2222',
        //         withdrawalAmount: '100',
        //         paidAmount: '50',
        //         noPaidAmount: '50'
        //     },
        //     {
        //         applyPerson: 'pcLee3',
        //         applyTime: '2017-2-28',
        //         withdrawStatus: '提现中',
        //         userAccount: '支付宝',
        //         paidWaybill: '3333',
        //         withdrawalAmount: '1000',
        //         paidAmount: '500',
        //         noPaidAmount: '500'
        //     },
        //     {
        //         applyPerson: 'pcLee4',
        //         applyTime: '2017-2-28',
        //         withdrawStatus: '提现中',
        //         userAccount: '支付宝',
        //         paidWaybill: '4444',
        //         withdrawalAmount: '10000',
        //         paidAmount: '5000',
        //         noPaidAmount: '5000'
        //     },
        // ];

    }

    //提现审批列表
    withdrawApply(){
        this.api.call("FinancialCenterController.withdrawalAuditQuery", {first:0,rows:10}, this.withdrawAuditRequestVo).ok(json => {
            if(json.result.content==null || json.result.content.length==0){
                this.initWtihdrawAuditResponse();
                this.withdrawAuditResponseVo;
            }else{
                this.withdrawAuditResponseVo = json.result.content;
                if(this.withdrawAuditResponseVo[0].auditState != "未审核"){
                    var that = this;
                    this.isshowModal[0] = false;
                    setTimeout(function () {
                        that.isshowModalAni[0] = false;
                    }, 0);
                    this.showSuccess("warn","提示","已审核,不能重复申请审核");
                }
            }
        }).fail((err)=>{
            ////console.log(err);
        });
    }


    doSearch():any{
    }


    searchAllWithdraw(event):any{
        this.loading = true;
        this.withdrawAuditRequestVo=event;
        this.doQuery();
    }

    rowSelect($event):any{
        let rows = $event[0]?$event[0]:$event;
        this.withdrawAuditRequestVo.mobile=rows.mobile;
        this.withdrawAuditRequestVo.wdNo=rows.wdNo;
        this.withdrawAuditRequestVo.realName=rows.realName;
        this.paidRequestVo.wdNo=rows.wdNo;
        this.selected = $event;
        this.selectionRow.length = this.selected.length;

    }
    initWtihdrawAuditResponse():any {
        this.withdrawAuditResponseVo = [
            {
                realName: "",
                mobile: "",
                withdrawAmount: "",
                applyTime: "",
                userAccount: "",
                bankAccount: "",
                accountName: "",
                bankName: "",
                subBranchName: "",
                waybillId: "",
                serviceType: "",
                productNames: "",
                consignee: "",
                consigneeAddr: "",
                taskAmount: "",
                standardCost: "",
                signTime: "",
                wdNo:"",
                auditState:"",
                withdrowType:"",
                taskType:""
            }
        ];
    }
    initPaidResponse():any {
        this.paidResponseVo = [
            {
                totalPaidAmount:"",
                totalNoPaidAmount:"",
                withdrawStatus:"",
                withdrawalAmount:"",
                actPayNo:"",
                applyTime:"",
                auditState:"",
                bePayNo:"",
                noPaidAmount:"",
                paidAmount:"",
                userAccount:"",
                applyPerson:"",
                paidTime:"",
                paidPerson:""

            }
        ];
    }

    // 否决审核
    rejectAuditing(){
        this.mask.hide();
        this.rejectAduitingState = false;
        if(this.selectionRow.length === 0){
            this.showSuccess("warn","提示","请选择一条数据");
            return
        }else {
            this.api.call("FinancialCenterController.canclePayment",{"wdNo":this.withdrawAuditRequestVo.wdNo}).ok((data) => {
                this.selectionRow = [];
                this.load({ first: 0,rows: 10});
                this.showSuccess("success","提示","操作成功");
            }).fail((err) => {
                this.showSuccess("error","提示",err.error);
            });
        }
    }

    cancelRejectAuditing(){
        this.mask.hide();
        this.rejectAduitingState = false;
    }

    showReject(){
         //判断单选
        if(this.selectionRow.length>1){
            this.showSuccess("warn","提示","只能选择一条数据");
            return;
        }
        if (this.selectionRow.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.rejectAduitingState = true;
            this.mask.show()
        }
    }

    deleteSymbol() {
        this.mask.hide();
        this.rejectAduitingState = false;
    }

}
