import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "../../../lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";

@Component({
    selector:'ro-handle-way-supply',
    templateUrl: './ro-handle-way-supply.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class RoHandleWaySupplyComponent implements OnInit{
    constructor(public api:API,
                public drag: DragBoxService,){}

    @Output() closeWin = new EventEmitter();
    @Input() selectionRow: any;
    abnormal: any = {};
    @Input() subAbnormalSaleFlag : any;
    // goodArr=[0];
    supplyResult: any={
        id:'',
        taskPartType: '',
        goodArr: [],
        assumeFee: '',
        abnormalDuty: '',
        responsiber:'',
        remark: ''
    }

    ngOnInit(): void {
        let dialogArea = document.getElementById('move');
        let dialogBox = document.getElementById('box');
        this.drag.dragEle(dialogArea, dialogBox);
        if(this.subAbnormalSaleFlag === 'abnormalSale'){
            this.api.call("TaskPartController.findTaskPartData",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.subAbnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
                this.supplyResult.taskPartType = result.taskPartTypeName;
                this.supplyResult.goodArr = result.taskPartDetails;
                this.supplyResult.assumeFee = result.assumeFee;
                this.supplyResult.abnormalDuty = result.responsiber;
                this.supplyResult.remark = result.remark;
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("TaskPartController.findTaskPartData",{
                id : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
                this.supplyResult.taskPartType = result.taskPartTypeName;
                this.supplyResult.goodArr = result.taskPartDetails;
                this.supplyResult.assumeFee = result.assumeFee;
                this.supplyResult.abnormalDuty = result.responsiber;
                this.supplyResult.remark = result.remark;
            }).fail(err=>{
                //console.log(err);
            });
        }

    }

    i = 0;
    close(){
        this.closeWin.emit();
    }
    // addGood(){
    //     this.goodArr.push(this.i++);
    // }
    // removeGood(i){
    //     if(this.goodArr.length > 1){
    //         this.goodArr.splice(i,1);
    //     }
    // }
}
