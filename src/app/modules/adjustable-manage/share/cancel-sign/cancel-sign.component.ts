/**
 * Created by Administrator on 2017/3/29.
 */
import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'manage-cancelSign',
    templateUrl: './cancel-sign.component.html',
    styleUrls: [
        './cancel-sign.component.css'
    ]
})
export class cancelSignComponent implements OnInit{
    CancelSignText:string;
    @Output() onCancelSign = new EventEmitter();
    @Output() onCancelSignOk = new EventEmitter();
    @Input() wayBill;//运单号接口
    @Input() selectLineInfo;//所有的数据
    @Input() taskId: any;
    loading:boolean;
    msgCancelSign:string = '请填写取消签收原因(0/200)';
    msgs:any;//公共提示

    constructor(public api: API,
                public RequestTokenService:RequestTokenService
    ){}
    ngOnInit(){
        this.RequestTokenService.createToken();
    }
    CancelSignOut(value:string){
        if(value.length>0&&value.length<=200){
        }else {
            this.CancelSignText = null;
            this.msgCancelSign= '取消签收原因不能为空';
        }
    }
    //确认
    confirmCancelSign(){
          if(this.CancelSignText != undefined && this.CancelSignText !=""){
              this.loading = true;
              this.api.call('taskInstallController.cancelSign',{
                  taskId:this.taskId,
                  cancelReason:this.CancelSignText//取消原因
              }).ok(data=>{
                     this.onCancelSignOk.emit();
                  this.loading = false;
              }).fail(data=>{
                  this.showSuccess("error","提示",data.error);
                  this.loading = false;
              });
          }else {
              this.showSuccess("warn","提示","输入不能为空");
          }
    }
    //取消
    cancelCancelSign(){
        this.onCancelSign.emit();
        this.CancelSignText = null;
    }

    DeleteSymbol(){
        this.onCancelSign.emit();
        this.CancelSignText = null;
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
