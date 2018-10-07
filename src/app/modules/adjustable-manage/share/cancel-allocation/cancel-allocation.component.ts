/**
 * Created by Administrator on 2017/3/29.
 */
import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'manage-cancelAllocation',
    templateUrl: './cancel-allocation.component.html',
    styleUrls: [
        './cancel-allocation.component.css'
    ]
})
export class cancelAllocationComponent implements OnInit{
    CancelSignText:string;
    @Input() selectLineInfo;//所有的数据
    @Output() onCancelAllocation = new EventEmitter();
    @Output() onAllocation = new EventEmitter();
    @Input() taskId: any;
    msgs:any;//提示
    msgCancelSign:string = '请填写取消分配原因';
    /*判断输入*/
    CancelSignOutIf:boolean = false;
    loading:boolean;
    constructor(public api: API,
                public RequestTokenService:RequestTokenService
    ){}
    ngOnInit(){
        this.RequestTokenService.createToken();
    }
    CancelSignOut(value:string){
        if(value.length>0&&value.length<=200){
            this.CancelSignOutIf = true;
        }else {
            // this.CancelSignText = null;
            this.showSuccess("warn","提示","取消原因不能为空");
        }
    }
    //聚焦提示
    cancelFn(){
        this.showSuccess("info","提示","请将字符控制在200及以内，且不能为空")
    }
    //确认
    confirmCancelSign(){
        if(this.CancelSignText == undefined || this.CancelSignText == ""){
              this.showSuccess("warn","提示","输入不能为空")
        }else {
            this.loading = true;
            switch (this.selectLineInfo[0].taskType) {
                case "调度任务":
                    this.api.call('taskInstallController.cancelDis',{
                        taskId:this.taskId,
                        cancelReason:this.CancelSignText//取消原因
                    }).ok(data=>{
                        this.onCancelAllocation.emit();
                        this.loading = false;
                    }).fail(data=>{
                        this.showSuccess("error","提示",data.error);
                        this.loading = false;
                    });
                    break;
                case "返货任务":
                    this.api.call("AftermarketTaskController.delTaskMaster", {
                        taskId: this.selectLineInfo[0].id,
                        reason: this.CancelSignText
                    }).ok(json => {
                        this.onCancelAllocation.emit();
                        this.loading = false;
                    }).fail((data) => {
                        this.showSuccess("error","提示",data.error);
                        this.loading = false;
                    });
                    break;
                case "维修任务":
                    this.api.call("AftermarketTaskController.delTaskMaster", {
                        taskId: this.selectLineInfo[0].id,
                        reason: this.CancelSignText
                    }).ok(json => {
                        this.onCancelAllocation.emit();
                        this.loading = false;
                    }).fail((data) => {
                        this.showSuccess("error","提示",data.error);
                        this.loading = false;
                    });
                    break;
            }

        }
    }
    //取消
    cancelCancelSign(){
        this.onAllocation.emit();
        this.CancelSignText = null;
    }

    DeleteSymbol(){
        this.onAllocation.emit();
        this.CancelSignText = null;
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
