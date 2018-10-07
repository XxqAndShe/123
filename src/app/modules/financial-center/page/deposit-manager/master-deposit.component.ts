import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {WithdrawAuditResponseVo} from "../../vo/withdraw-audit-response.vo";
import {WithdrawAuditRequestVo} from "../../vo/withdraw-audit-request.vo";
import {API} from "app/share/lib/api/api";
import {ConfirmationService} from "primeng/components/common/api";

@Component({
    selector: 'master-deposit-model',
    templateUrl: './master-deposit.component.html',
    styleUrls: ['./master-deposit.component.css']
})
export class MasterDepositComponent implements OnInit {
    //显示右键勾选编辑按钮
    isshowTitle:boolean = false;
    constructor(public api: API,public confirmationService:ConfirmationService) {
    }
    columns:any[]=[];
    data:any;
    selections:any[] = [];
    selectRows: any[] = [];
    selectionMode:string = "multiple";
    withdrawalAuditRequestVo: WithdrawAuditRequestVo;

    /*公共弹窗提示*/
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    @Output() closeModal = new EventEmitter<boolean>();

    public enable: boolean;
    ngOnInit(): void {
        this.withdrawalAuditRequestVo = new WithdrawAuditRequestVo();
        this.initColumn();
        this.doSearch();
        this.enable = false;
    }

    @Input() withdrawAuditResponseVo: WithdrawAuditResponseVo[];

    hideModal() {
        this.closeModal.emit(false);
    }

    initColumn() {
        this.columns.push({
            field: "masterName",
            header: "师傅姓名",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "masterAccount",
            header: "师傅账号",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "paymentType",
            header: "结款方式",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "totalMoney.totalMoney",
            header: "账户余额",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "totalMoney.canWithdraw",
            header: "可提现金额",
            sortable: true,
            filter: true,
            isWarn: true
        });
        this.columns.push({
            field: "totalMoney.cannotWithdraw",
            header: "未出账单金额",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "totalMoney.inWithdraw",
            header: "提现中金额",
            sortable: true,
            filter: true
        })
    }

    /**
     * 表格加载方法
     * @param $event
     */
    load($event): any {
        //TODO
        this.api.call("FinancialCenterController.masterWithdrawListQuery", $event, this.withdrawalAuditRequestVo).ok(json => {
            this.data = json.result;
            //console.log(json.result);
        }).fail((err)=>{
            ////console.log(err);
        });
    }


    /**
     * 记录选择
     * @param $event
     */
    rowSelect($event){
        let data=$event.filter(item=>{
            return item.totalMoney.canWithdraw!="0";
        });
        this.selectRows=data;
        this.selections=data;
    }

    /**
     * 查询
     */
    doSearch() {
        ////console.log(this.withdrawAuditResponseVo);
        //查询师傅列表
        //this.withdrawalAuditRequestVo
        this.load(
            {
                first: 0,
                rows: 10
            }
        );
    }

    clear() {
        //清除师傅列表
        this.withdrawalAuditRequestVo = new WithdrawAuditRequestVo();
    }
    cancelSelect($event) {
        //取消选中记录
        this.selectRows=[];
        this.selections=[];
    }

    alert(msg:string) {
        this.confirmationService.confirm({
            message: msg,
            header: '提示',
            accept: () => {
            }
        });
    }
    //提现申请
    depositConfirm(total:number,masterId:string) {
        this.confirmationService.confirm({
            message: '提现总金额'+total+'元，确定申请提现？',
            header: '提示',
            accept: () => {
                this.api.call("FinancialCenterController.withdrawApply",{masterId:masterId}).ok(json => {
                    this.alert("提现申请成功");
                    this.doSearch();
                }).fail((err)=>{
                    ////console.log(err);
                    this.alert(err.error);
                });
            }
        });
    }
    //确认按钮
    missAcountAlert() {
        this.confirmationService.confirm({
            message: '师傅尚未设置提现账号，请先设置',
            header: '提示',
            accept: () => {

            }
        });
    }
    /**
     * 提现处理
     */
    depositHandler(): void {
        //获取选中的记录，进行提现处理this.selectRows
        //TODO
        ////console.log(this.selections.length);
        if(this.selectRows.length==0){
            this.showSuccess("info","提示","请选择数据！");
        }else{
            //计算出体现总金额。
            //测试
            let totalAmount;
            this.api.call("FinancialCenterController.validateUserPaymentType",this.selections["0"].masterAccount).ok(json => {
                if(json.result.result=="true" || json.result.result==true){
                    for (let entry of this.selections) {
                        totalAmount=entry.totalMoney.canWithdraw;
                        masterId=entry.masterId;
                    }
                    if(totalAmount > 0){
                        this.depositConfirm(totalAmount,masterId);
                    }else{
                        this.alert("当前师傅提现金额为0，无法操作提现");
                        return;
                    }
                    return;
                }
            }).fail((err)=>{
                ////console.log(err);
            });
            let masterId;
            for (let entry of this.selections) {
                totalAmount=entry.totalMoney.totalMoney;
                masterId=entry.masterId;
            }
            if(totalAmount > 0){
                this.depositConfirm(totalAmount,masterId);
            }else{
                this.alert("当前师傅提现金额为0，无法操作提现");
                return;
            }
        }

        /*
         this.withdrawalAuditRequestVo.mobile = this.withdrawAuditResponseVo[0].mobile;
         this.withdrawalAuditRequestVo.withdrawIdList = this.withdrawAuditResponseVo[0].withdrawIdList;
         ////console.log("withdrawAuditRequestVo");
         ////console.log(this.withdrawalAuditRequestVo);
         ////console.log(this.withdrawAuditResponseVo);
         this.withdrawalAuditRequestVo.isPass = true;
         this.stateSearchService.auditPass('WithdrawApiController.isAuditPass', this.withdrawalAuditRequestVo);*/
    }
}
