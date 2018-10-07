/**
 * Created by 1 on 2017/8/19.
 */
import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {API} from "../../../../../share/lib/api/api";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
import {ShowOrHideMaskService} from "../../../../../share/app-service/show-or-hide-mask.service";
@Component({
    selector: 'complait-del',
    templateUrl: './complait-del.component.html',
    styleUrls: [
        './complait-del.component.css'
    ]
})

export class ComplaitDelComponent implements OnInit {
    @Input() selections: any;
    @Output() close = new EventEmitter();
    msgs:any;
    constructor(
        public api: API,
        public drag: DragBoxService,
        public mask:ShowOrHideMaskService) {
    }

    ngOnInit() {
        this.mask.show();
        let box = document.getElementById("deposit_del");
        let moveArea = document.getElementById("deposit_del_title");
        this.drag.dragEle(moveArea, box);
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
        console.log(this.selections);
        this.api.call("ComplaintController.deleteMaterial",{
            "id":this.selections[0].id
        }).ok(data=>{
            this.close.emit(true);
        }).fail(err=>{
            this.showSuccess("error","提示",err.error);
        })

    }
    ngOnDestroy() {
        this.mask.hide();
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
}
