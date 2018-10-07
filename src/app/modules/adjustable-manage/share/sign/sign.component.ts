/**
 * Created by wq on 2017/3/29.
 */

import {Component,Input, Output,EventEmitter,OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector:'adjustable-manage-sign',
    templateUrl:'./sign.component.html',
    styleUrls:['./sign.component.css'],
})

export class signComponent implements OnInit{
    Signatory:string;//签收人
    whatSign:string;//正常/异常签收
    signText:string;//签收描述
    @Output() SignOrder= new EventEmitter();
    @Output() onSignOrder = new EventEmitter();
    @Input() wayBill: any;
    @Input() taskId: any;
    @Input() selectLineInfo;//所有的数据
    files:any;//上传签收图片
    loading:boolean;
    constructor(public api: API,
                 public RequestTokenService:RequestTokenService){}
    /*签收人判断*/
    itemSignatory:string = '请输入签收人(0/20)';
    SignatoryIf:boolean = false;
    FnSignatory(value:string){
        if(value.length>0&&value.length<20){
            this.SignatoryIf = true;
        }else {
            this.showSuccess("warn","提示","签收人不能为空");
        }
    }
    itemSignText:string = '签收描述';

    /**
     * 签收确定
     */
    addSign(){
        if(this.Signatory != undefined&&this.Signatory != ""){
            this.loading = true;
            this.api.call('taskInstallController.sign',{
                taskId:this.taskId,//任务id
                signer:this.Signatory,//签收人
                signStatus:this.whatSign,//签收状态
                describe:this.signText,//签收描述
                files:this.files //图片id集合

            }).ok(data=>{
                this.onSignOrder.emit();
                this.loading = false;
            }).fail(data=>{
                this.showSuccess("error","提示",data.error);
                this.loading = false;
            })
        }else {
            this.showSuccess("warn","提示","签收人不能为空");
        }
    }
    /*删除*/
    DeleteSymbol(){
        this.SignOrder.emit();
        this.Signatory = null;
        this.whatSign = null;
    }
    /*取消*/
    cancelSign(){
        //图片id
        this.SignOrder.emit();
        this.Signatory = null;
        this.whatSign = null;
    }
    //公共提示
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    ngOnInit(){
        this.whatSign = "normal";//默认正常签收
        this.RequestTokenService.createToken();
    }
}
