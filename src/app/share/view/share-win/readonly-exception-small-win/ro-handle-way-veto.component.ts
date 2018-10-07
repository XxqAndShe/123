import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";

@Component({
    selector: 'ro-handle-way-veto',
    templateUrl: './ro-handle-way-veto.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class RoHandleWayVetoComponent implements OnInit{
    constructor(public api:API,
                public drag: DragBoxService,){}
    rejectReason : any;
    @Output() closeWin = new EventEmitter();
    @Input() selectionRow: any;
    abnormal: any = {};
    @Input() subAbnormalSaleFlag : any;

    ngOnInit(): void {
        if(this.subAbnormalSaleFlag === 'abnormalSale'){
            this.api.call("AbnormalRejectController.findAbnormalReject",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.subAbnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
                this.rejectReason = result.message;
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("AbnormalRejectController.findAbnormalReject",{
                id : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
                this.rejectReason = result.message;
            }).fail(err=>{
                //console.log(err);
            });
        }
        let dialogArea = document.getElementById('move');
        let dialogBox = document.getElementById('box');
        this.drag.dragEle(dialogArea, dialogBox);
    }

    close(){
        this.closeWin.emit();
    }

}
