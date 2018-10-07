/**
 * Created by Administrator on 2017/3/29.
 */
import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";

@Component({
    selector: 'sale-cancelAllocation',
    templateUrl: './cancel-allocation.component.html',
    styleUrls: [
        './cancel-allocation.component.css'
    ]
})
export class cancelAllocationComponent implements OnInit{
    constructor(public api: API,public requestTokenService: RequestTokenService) {
    }

    CancelSignText: string;
    @Input() selectedRowData;//输入的选中行数据
    @Input() selectLineInfo;
    @Output() onCancelAllocation = new EventEmitter();
    @Output() cancelSave = new EventEmitter();//保存
    msgCancelSign: string = '请填写取消分配原因';
    /*判断输入*/
    CancelSignOutIf: boolean = false;
    ngOnInit(){
        this.requestTokenService.createToken();
    }
    msgs:any;
    showError(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    CancelSignOut(value: string) {
        if (value.length > 0 && value.length <= 200) {
            this.CancelSignOutIf = true;
        } else {
            this.CancelSignText = null;
            this.msgCancelSign = '取消分配原因字符在200以内且不能为空';
        }
    }

    //确认
    @Input() fromWhere: string;

    save(fromWhere) {
        if (fromWhere === "REPAIR") {  //来自售后维修
            if (!this.CancelSignText) {
                this.showError("warn","提示","请填写输入原因!");
                return;
            }
            this.api.call("AftermarketTaskController.delTaskMaster", {
                taskId: this.selectedRowData.id,
                reason: this.CancelSignText
            }).ok(json => {
                this.cancelSave.emit();
            }).fail((err) => {
                this.showError("error","提示",err.error);
            });
        } else {
            if (this.CancelSignOutIf) {
                this.api.call('taskInstallController.cancelDis', {
                    taskId: this.selectLineInfo[0].id,
                    cancelReason: this.CancelSignText//取消原因
                });
            }
        }
    }


    //取消
    CancelCancelSign() {
        this.onCancelAllocation.emit();
        this.CancelSignText = null;
    }

    DeleteSymbol() {
        this.onCancelAllocation.emit();
        this.CancelSignText = null;
    }
}
