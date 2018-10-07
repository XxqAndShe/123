/**
 * Created by 1 on 2017/8/21.
 */
import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {DragBoxService} from "../../../../../../share/app-service/drag-box.service";
@Component({
    selector: 'complait-add',
    templateUrl: './complait-add.component.html',
    styleUrls: [
        './complait-add.component.css'
    ]
})

export class ComplaitAddComponent implements OnInit {
    @Input() complaintDuty: any;
    complaintName:string;
    @Input() penaltyBigCatelogName: any;
    @Input() penaltySmallCatelogName: any;
    @Input() who: any;
    @Input() bigName: any;
    complaintSmall:string;//投诉小类
    msgs:any[];
    @Output() close = new EventEmitter();
    complaintBig:string;//投诉大类
    constructor(
        public api: API,
        public drag: DragBoxService) {
    }

    ngOnInit() {
        let box = document.getElementById("deposit_add");
        let moveArea = document.getElementById("deposit_add_title");
        this.drag.dragEle(moveArea, box);
        if(this.complaintDuty === "yiziton"){
            this.complaintName = "一智通";
        } else if(this.complaintDuty === "serviceProvider"){
            this.complaintName = "服务商";
        }else {
            this.complaintName = "承运商";
        }
    }

    /**
     * 取消
     */
    hideWindow(){
        this.close.emit();
    }

    /**
     * 保存
     */
    affirm(){
        if(this.who === 'add'){
            for(let i = 0;i<this.penaltyBigCatelogName.length;i++){
                if(this.complaintBig === this.penaltyBigCatelogName[i].catalogName){
                    this.showSuccess("warn","提示","该大类已存在");
                    return;
                }
            }
            this.api.call("ComplaintController.addCatalog",{
                "ComplaintDuty":this.complaintDuty,
                "catalogName":this.complaintBig

            }).ok(data=>{
                this.close.emit(true);
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            });
        }else {
            for(let i = 0;i<this.penaltySmallCatelogName.length;i++){
                if(this.complaintSmall === this.penaltySmallCatelogName[i].catalogName){
                    this.showSuccess("warn","提示","该小类已存在");
                    return;
                }
            }
            this.api.call("ComplaintController.addCatalog",{
                "ComplaintDuty":this.complaintDuty,
                "catalogParentId":this.bigName.catalogId,
                "catalogName":this.complaintSmall,
            }).ok(data=>{
                this.close.emit("small");
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            });
        }

    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
}
