/**
 * Created by Administrator on 2017/3/29.
 */
import { Component, EventEmitter, Output, Input,OnInit } from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'termination-order',
    templateUrl: './termination-order.component.html',
    styleUrls: [
        './termination-order.component.css'
    ]
})
export class AdjustableManageTerminationOrder implements OnInit{
    // 终止原因
    TerminationOrderText:string;
    // 是否生成异常新单
    createAbnormal:boolean = false;

    @Input() idField;
    @Input() wayBill;
    @Input() selectLineInfo;//所有的数据
    @Output() onTerminationOrder = new EventEmitter();
    @Output() cancelOrder = new EventEmitter();
    msgTerminationOrder:string = '请填写终止订单原因(最多200字)';
    loading:boolean;
    constructor(public api: API,
                 public RequestTokenService:RequestTokenService){
    }
    ngOnInit(){
        this.RequestTokenService.createToken();
    }
    TerminationOrderOut(value:string){
        if(value.length > 0){

        }else {
            this.showSuccess("error","提示","输入不能为空！");
        }
    }
    //确认
    ConfirmTerminationOrder(){
        if(this.TerminationOrderText != undefined && this.TerminationOrderText != ""){
            this.loading = true;
            this.api.call("AftermarketTaskController.cancelWaybill", {
                taskId: this.selectLineInfo[0].id,
                waybillId: this.selectLineInfo[0].waybillId,
                reason: this.TerminationOrderText,
                isNewAbornWaybill: this.createAbnormal ? "1" : "0"
            }).ok(json => {
                this.onTerminationOrder.emit();
                this.loading = false;
            }).fail((err) => {
                this.showSuccess("error","提示",err.error);
                this.loading = false;
            });

        }else {
            this.showSuccess("warn","提示","输入不能为空！");
        }
    }
    //取消
    CancelTerminationOrder(){
        this.cancelOrder.emit();
        this.TerminationOrderText = null;
    }

    DeleteSymbol(){
        this.cancelOrder.emit();
        this.TerminationOrderText = null;
    }
    /*提示框*/
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    /**
     * 生成异常
     */
    abnormalChange(){
        //Todo 生成新异常单触发函数
        ////console.log(this.createAbnormal);
    }
}
