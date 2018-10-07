import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {DragBoxService} from "../../../../../../../share/app-service/drag-box.service";
import {API} from "../../../../../../../share/lib/api/api";
@Component({
    selector: 'goods-out',
    templateUrl: 'goods-out.component.html',
    styleUrls: ['goods-out.component.css']
})
export class GoodsOutComponent implements OnInit{
    @Output() closeWin = new EventEmitter();
    @Input() selectRow;
    outCarrier: any;//外发承运商
    returnFee: any;//返货费
    msgs: any;
    constructor(
        public drag: DragBoxService,
        public api: API
    ){}
    ngOnInit(){
        this.outCarrier = this.selectRow.carrier;
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
        if(!this.outCarrier){
            this.showSuccess('warn','提示','外发承运商必填！');
            return;
        }
        this.api.call('AftermarketTaskController.goodsOutsource',{
            taskId: this.selectRow.id,
            returnCysName: this.outCarrier,
            distributionFee: this.returnFee,
            taskFeeType: 'back'
            }
        ).ok(data => {
            this.closeWin.emit(true);
        }).fail(err => {
            this.showSuccess('error','提示','操作失败！');
        });
    }
}
