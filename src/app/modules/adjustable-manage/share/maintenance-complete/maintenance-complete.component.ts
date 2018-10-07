import { Component, EventEmitter, Output, Input,OnInit } from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";

@Component({
    selector: 'maintenance-complete',
    templateUrl: './maintenance-complete.component.html',
    styleUrls: [
        './maintenance-complete.component.css'
    ]
})
export class MaintenanceCompleteComponent implements OnInit{

    @Input() idField;
    @Input() wayBill;
    @Input() selectLineInfo;//所有的数据
    @Output() onMaintenanceComplete = new EventEmitter();
    @Output() onMaintenanceCompleteCancel = new EventEmitter();
    msgMaintenanceComplete:string = '最多输入200字';

    maintenanceCompleteText:string;
    files:any= [];

    msgs:any;//公共提示
    loading:boolean;
    constructor(public api: API,
                public RequestTokenService:RequestTokenService) {
    }
    ngOnInit(){
        this.RequestTokenService.createToken();
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    imgPaths: string;
    //保存
    saveMaintenance() {
        this.loading = true;
        if (this.files == 0) {
            this.showSuccess("warn","提示",'照片至少上传一张');
        } else if (this.files.length > 6) {
            this.showSuccess("warn","提示",'照片最多上传6张');
        } else if (!this.maintenanceCompleteText) {
            this.showSuccess("warn","提示",'请填写维修完成描述！');
        } else if (this.maintenanceCompleteText.length>200) {
            this.showSuccess("warn","提示",'最多输入200字');
        } else{
            this.imgPaths = "";
            for (let f of this.files) {
                this.imgPaths = this.imgPaths + f + ",";
            }
            this.api.call("AftermarketTaskController.repairEnd", {
                "taskId": this.selectLineInfo[0].id,
                "repairedDescription": this.maintenanceCompleteText,
                "repairedImges": this.imgPaths,
                "normalSign": true
            }).ok(json => {
                this.onMaintenanceComplete.emit();
                this.loading = false;
            }).fail((err) => {
                this.showSuccess("error","提示",'操作失败');
                this.loading = false;
            });
        }
    }

    //取消
    cancelMaintenance() {
        this.maintenanceCompleteText = null;
        this.onMaintenanceCompleteCancel.emit();
    }
}
