import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";

@Component({
    selector: 'repair-complete',
    templateUrl: './maintenance-complete.component.html',
    styleUrls: [
        './maintenance-complete.component.css'
    ]
})
export class MaintenanceCompleteComponent implements OnInit{

    constructor(public api: API,public requestTokenService: RequestTokenService) {
    }

    @Input() selectedRowData;//选中行的数据
    @Output() confirm = new EventEmitter<any>();
    @Output() cancelDialog = new EventEmitter();
    msgMaintenanceComplete: string = '最多输入200字';

    maintenanceCompleteText: string;    //维修完成描述
    files:any;
    imgPaths: string;   //图片路径，多个用英文都好隔开。TODO 先写死
    /*公共弹窗提示*/
    msgs:any;
    ngOnInit(){
        this.requestTokenService.createToken();
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    judgeText(value: string) {
        if (value.length > 200) {
            this.maintenanceCompleteText = null;
            this.msgMaintenanceComplete = "输入字数不能超过200个"
        }
    }

    //保存
    save() {
        // this.confirm.emit();
        if (!this.maintenanceCompleteText) {
            this.showSuccess("warn","提示","请填写维修完成描述！");
            return;
        }
        if (this.files) {
            debugger;
            ////console.log(this.files);
            this.imgPaths = "";
            for (let f of this.files) {
                ////console.log(f);
                this.imgPaths = this.imgPaths + f + ",";
            }
            ////console.log("----imgPaths:" + this.imgPaths);
        }
        if (!this.imgPaths) {
            this.showSuccess("warn","提示","请上传图片！");
            return;
        }
        this.api.call("AftermarketTaskController.repairEnd", {
            taskId: this.selectedRowData.id,
            repairedDescription: this.maintenanceCompleteText,
            repairedImges: this.imgPaths
        }).ok(json => {
            this.confirm.emit();//保存刷新
        }).fail((err) => {
            this.showSuccess("error","提示",err.error);
        });
    }

    //取消
    cancel() {
        this.maintenanceCompleteText = null;
        this.imgPaths = null;
        this.cancelDialog.emit();
    }

    DeleteSymbol() {
        this.maintenanceCompleteText = null;
        this.imgPaths = null;
        this.cancelDialog.emit();
    }
}
