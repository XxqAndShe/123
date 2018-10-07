import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {WithdrawAuditResponseVo} from "../../vo/withdraw-audit-response.vo";
import {WithdrawAuditRequestVo} from "../../vo/withdraw-audit-request.vo";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";

@Component({
    selector: 'deposit-assess',
    templateUrl: './deposit-assess.component.html',
    styleUrls: ['./deposit-assess.component.css'],
    animations: [
        modalAnimation
    ]
})
export class DepositAssessComponent implements OnInit {
    showWin: boolean = false;
    msgs:any;
    data: any;
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    selections: any;
    @Input() rowData;

    //提示弹框
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    columns: any[]=[];
    initColumns():void{
        this.columns.push({
            field: 'id',
            header: 'ID',
            filter: true,
            sortable: true,
            hidden: true
        });
        this.columns.push({
            field: 'waybillId',
            header: '运单号/任务单号',
            filter: true,
            sortable: true,
            link: true
        });
        this.columns.push({
            field: 'taskType',
            header: '任务类型',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'productNames',
            header: '品名',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'consignee',
            header: '收货人',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'consigneeAddr',
            header: '收货地址',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'taskAmount',
            header: '金额',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'feeDetail',
            header: '费用明细',
            filter: true,
            sortable: true
        });
        /*this.columns.push({
            field: 'referCost',
            header: '参考成本',
            filter: true,
            sortable: true
        });
        this.columns.push({
            field: 'differential',
            header: '差价',
            filter: true,
            sortable: true,
            isWarn: true
        });*/
    }
    loading:boolean;
    ngOnInit(): void {
        this.initColumns();
        this.withdrawalAuditRequestVo = new WithdrawAuditRequestVo();
        this.requestTokenService.createToken();
        /*this.withdrawAuditResponseVo = [
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
                wdNo: "",
                auditState: "",
                withdrowType:"",
                taskType:""
            }
        ];*/
    }

    constructor(public mask: ShowOrHideMaskService, public api: API,public requestTokenService: RequestTokenService) {

    }

    withdrawalAuditRequestVo: WithdrawAuditRequestVo;

    @Output() closeModal = new EventEmitter<boolean>();

    @Input() withdrawAuditResponseVo: WithdrawAuditResponseVo[];
    @Input() withdrawAuditRequestVo:WithdrawAuditResponseVo;

    hideModal() {
        this.closeModal.emit(false);
    }

    //审核通过
    auditPass(): any {
        this.loading = true;
        this.withdrawalAuditRequestVo.mobile = this.withdrawAuditResponseVo[0].mobile;
        this.withdrawalAuditRequestVo.wdNo = this.withdrawAuditResponseVo[0].wdNo;//提现流水号
        this.withdrawalAuditRequestVo.pass = true;//是否审核通过
        this.audit();
    }

    //审核接口
    audit(): any {
        /**
         * 提现审核接口
         */
        this.api.call("FinancialCenterController.withdrawAudit",this.withdrawalAuditRequestVo).ok(json => {
            this.showSuccess("success","提示","审核成功");
            this.mask.hide();
            this.closeModal.emit(false);
            this.loading = false;
        }).fail((err) => {
            this.showSuccess("error","提示",err.error);
            this.loading = false;
        });
    }

    //审核不通过
    depositOppose() {
        this.showWin = true;
        this.mask.show();
    }

    closeWin(data) {
        this.withdrawalAuditRequestVo.wdNo = this.withdrawAuditResponseVo[0].wdNo;//提现流水号
        this.withdrawalAuditRequestVo.pass = false;
        this.withdrawalAuditRequestVo.noPassReson = data;
        // this.audit();
        this.showWin = false;
        this.mask.hide();
    }
    doAudit(data) {
        this.withdrawalAuditRequestVo.wdNo = this.withdrawAuditResponseVo[0].wdNo;//提现流水号
        this.withdrawalAuditRequestVo.pass = false;
        this.withdrawalAuditRequestVo.noPassReson = data;
        this.audit();
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
    public load($event): void {
        this.api.call("FinancialCenterController.withdrawalAuditQuery", $event, this.withdrawAuditRequestVo).ok(json => {
            if(json.result.content==null || json.result.content.length==0){
                this.initWtihdrawAuditResponse();
                this.withdrawAuditResponseVo;
            }else{
                this.withdrawAuditResponseVo = json.result.content;
            }
            this.data=json.result;
        }).fail((err)=>{ });
    }

    /**
     * 导出
     * @param $event
     */
    exportCSV($event){

        this.api.call('FinancialCenterController.withdrawalAuditQuery', {
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

    cellClick(cell){
        if (cell.field === 'waybillId'){
            this.selections = cell.row;
            if(cell.row.taskType === '维修任务'){
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if(cell.row.taskType === '返货任务'){
                let that = this;
                this.isModuleDisplayArr[1] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[1] = true;
                }, 0);
                this.curModalIndex = 1;
            }
            else if(cell.row.taskType === '调度任务'){
                let that = this;
                this.isModuleDisplayArr[2] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[2] = true;
                }, 0);
                this.curModalIndex = 2;
            }else {
                this.showSuccess("warn","提示","该记录无法判断任务类型！");
            }
        }
    }
    closeDetailModal(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
    }
}
