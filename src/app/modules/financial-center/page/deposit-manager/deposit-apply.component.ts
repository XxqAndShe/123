import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service';
import {DragBoxService} from '../../../../share/app-service/drag-box.service';
import {UserRequestVo} from "../../vo/user-request.vo";
import {DepositApplyResponseVo} from "../../vo/deposit-apply-response.vo";
import {WithdrawRequestVo} from "../../vo/withdraw-request.vo";
@Component({
    selector: 'deposit-apply',
    templateUrl: './deposit-apply.component.html',
    styleUrls: ['./deposit-apply.component.css']
})
export class DepositApplyComponent implements OnInit {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {
    }

    ngOnInit() {
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);

        this.userRequestVo = new UserRequestVo();
        this.depositApplyResponseVo = [];
        this.withdrawRequestVo = new WithdrawRequestVo();
        this.withdrawRequestVo.user = this.userRequestVo;
        this.withdrawRequestVo.userWorkerIds = ['2', '3'];
    }

    // 提现申请请求参数
    userRequestVo: UserRequestVo;

    withdrawRequestVo: WithdrawRequestVo;

    //提现操作响应参数
    depositApplyResponseVo: DepositApplyResponseVo[];


    @Output() isshow = new EventEmitter<boolean>();
    loading:boolean;
    // 隐藏提现申请弹框
    hideDepositApply(deposit) {
        deposit.style.display = "none";
        this.mask.hide();
        this.isshow.emit(false);//暴露值给父组件
    }

    //显示提现申请
    showDepositWin(depositwin) {
        depositwin.style.display = "block";
    }

    hideDepositWin(deposit) {
        deposit.style.display = "none";
    }

    doQuery(): any {
        if (this.userRequestVo.mobile.length != 11) {
            this.userRequestVo.realName = this.userRequestVo.mobile;
            this.userRequestVo.mobile = null;
        }
        this.withdrawRequestVo.user = this.userRequestVo;
        ////console.log("requestVo");
        ////console.log(this.withdrawRequestVo);
        /* this.stateSearchService.doQeury(vo => {
         let content = vo.result.content;
         this.depositApplyResponseVo = [];
         Object.assign(this.depositApplyResponseVo,content);
         ////console.log("responseVo");
         ////console.log(this.depositApplyResponseVo);
         },'withdrawApiController.findUserJzt',this.withdrawRequestVo);*/
    }

    //提现操作
    withdrawal(): any {
        /*// ////console.log("click")
         this.withdrawRequestVo.userWorkerIds = ['0'];
         ////console.log(this.withdrawRequestVo)
         this.stateSearchService.doQeury(vo => {
         ////console.log("withdraw Success");
         },'withdrawApiController.withdrawOperation',this.withdrawRequestVo);*/
    }
}
