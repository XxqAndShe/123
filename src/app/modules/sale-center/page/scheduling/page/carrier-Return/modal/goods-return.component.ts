import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {DragBoxService} from "../../../../../../../share/app-service/drag-box.service";
import {API} from "../../../../../../../share/lib/api/api";
@Component({
    selector: 'goods-return',
    templateUrl: 'goods-return.component.html',
    styleUrls: ['goods-return.component.css']
})
export class GoodsReturnComponent implements OnInit{
    @Output() closeWin = new EventEmitter();
    @Input() selectRow;
    msgs: any;
    constructor(
        public drag: DragBoxService,
        public api: API
    ){}
    ngOnInit(){
        let box = document.getElementById('container');
        let header = document.getElementById('header');
        this.drag.dragEle(header, box);
    }
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
    close(){
        this.closeWin.emit(false);
    }
    save(){
        this.api.call('AftermarketTaskController.goodsReturn',{
            taskId: this.selectRow.id,
            returnStatus: true
            }
        ).ok(data => {
            this.closeWin.emit(true);
        }).fail(err => {
            this.showSuccess('error','提示','操作失败！');
        });
    }
}
