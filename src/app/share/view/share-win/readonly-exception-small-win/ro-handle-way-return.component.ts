import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "../../../lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";

@Component({
    selector: 'ro-handle-way-return',
    templateUrl: './ro-handle-way-return.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class RoHandleWayReturnComponent implements OnInit{
    constructor(public api:API,
                public drag: DragBoxService,){}
    @Input() selectionRow: any;
    abnormal: any = {};
    @Input() subAbnormalSaleFlag : any;
    @Output() closeWin = new EventEmitter();
    taskReturnType : any;
    showCarrier: boolean = false;
    showServicer: boolean = false;
    btnState: string = 'client';//单选按钮切换状态
    receiveBtnState : string = 'merchants';//收货单选按钮切换状态
    returnResult: any={
        carrier:{
            consignee: '',
            consigneeMobile: '',
            consigneeAdr: '',
            returnArr1: [],
            assumeFee: '',
            abnormalDuty: '',
            remark: ''
        },
        servicer:{
            pickUpMan: '',
            pickUpManMobile: '',
            pickUpAdr: '',
            consignee: '',
            pickUpPoint : '',
            receivePoint : '',
            consigneeMobile: '',
            consigneeAdr: '',
            returnArr2: [],
            designLogistics : '',
            transportCompany: '',
            transportCompanyMobile: '',
            userWorker: '',
            picFee: '',
            assumeFee: '',
            abnormalDuty: '',
            remark: ''
        },
        abnormal:{
            id:''}
        // consignee:'',
        // consigneeMobile:'',
        // consigneeAdr:'',
        // assumeFee:'',
        // abnormalDutyId:'',
        //
        // receivePoint:'',
        // pickUpMan:'',
        // pickUpManMobile:'',
        // pickUpAdr:'',
        // designLogisticsId:'',//transportCompany:'',
        // logisticsPhone:'',//transportCompanyMobile:'',
        // userWorker:'',
        // picFee:'',
        // remark:'',
        // taskReturnType:'',
        // pickUpPoint:'',
        // taskReturnDetails:[]
    }

    ngOnInit(): void {
        if(this.subAbnormalSaleFlag === 'abnormalSale'){
            this.api.call("TaskReturnController.findTaskReturnData",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.subAbnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
                //console.log(json.result);
                this.taskReturnType = result.taskReturnType;
                if(this.taskReturnType == 'CARRIERS'){
                    this.showCarrier = true;
                    this.returnResult.carrier.consignee = result.vTaskReturnCarriers.consignee;
                    this.returnResult.carrier.consigneeMobile = result.vTaskReturnCarriers.consigneeMoblie;
                    this.returnResult.carrier.consigneeAdr = result.vTaskReturnCarriers.consigneeAdr;
                    this.returnResult.carrier.returnArr1 = result.vTaskReturnCarriers.taskReturnDetailInfos;
                    this.returnResult.carrier.assumeFee = result.vTaskReturnCarriers.assumeFee;
                    this.returnResult.carrier.abnormalDuty = result.vTaskReturnCarriers.abnormalDuty;
                    this.returnResult.carrier.remark = result.vTaskReturnCarriers.remark;
                }

                if(this.taskReturnType == 'SERVICE'){
                    this.showServicer = true;
                    this.btnState = result.vTaskReturnService.pickUpPoint;
                    this.returnResult.servicer.pickUpPoint = result.vTaskReturnService.pickUpPoint;
                    this.receiveBtnState = result.vTaskReturnService.receivePoint;
                    this.returnResult.servicer.receivePoint = result.vTaskReturnService.receivePoint;
                    this.returnResult.servicer.pickUpMan = result.vTaskReturnService.pickUpMan;
                    this.returnResult.servicer.pickUpManMobile = result.vTaskReturnService.pickUpManMobile;
                    this.returnResult.servicer.pickUpAdr = result.vTaskReturnService.pickUpAdr;
                    this.returnResult.servicer.consignee = result.vTaskReturnService.consignee;
                    this.returnResult.servicer.consigneeMobile = result.vTaskReturnService.consigneeMoblie;
                    this.returnResult.servicer.consigneeAdr = result.vTaskReturnService.consigneeAdr;
                    this.returnResult.servicer.returnArr2 = result.vTaskReturnService.taskReturnDetailInfos;
                    this.returnResult.servicer.designLogistics = result.vTaskReturnService.designLogistics;
                    this.returnResult.servicer.transportCompanyMobile =  result.vTaskReturnService.logisticsPhone;
                    this.returnResult.servicer.userWorker = result.vTaskReturnService.userWorker;
                    this.returnResult.servicer.picFee = result.vTaskReturnService.picFee;
                    this.returnResult.servicer.assumeFee = result.vTaskReturnService.assumeFee;
                    this.returnResult.servicer.abnormalDuty = result.vTaskReturnService.abnormalDuty;
                    this.returnResult.servicer.remark = result.vTaskReturnService.remark;
                }
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("TaskReturnController.findTaskReturnData",{
                abnormalId : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
                //console.log(json.result);
                this.taskReturnType = result.taskReturnType;
                if(this.taskReturnType == 'CARRIERS'){
                    this.showCarrier = true;
                    this.returnResult.carrier.consignee = result.vTaskReturnCarriers.consignee;
                    this.returnResult.carrier.consigneeMobile = result.vTaskReturnCarriers.consigneeMoblie;
                    this.returnResult.carrier.consigneeAdr = result.vTaskReturnCarriers.consigneeAdr;
                    this.returnResult.carrier.returnArr1 = result.vTaskReturnCarriers.taskReturnDetailInfos;
                    this.returnResult.carrier.assumeFee = result.vTaskReturnCarriers.assumeFee;
                    this.returnResult.carrier.abnormalDuty = result.vTaskReturnCarriers.abnormalDuty;
                    this.returnResult.carrier.remark = result.vTaskReturnCarriers.remark;
                }

                if(this.taskReturnType == 'SERVICE'){
                    this.showServicer = true;
                    this.btnState = result.vTaskReturnService.pickUpPoint;
                    this.returnResult.servicer.pickUpMan = result.vTaskReturnService.pickUpMan;
                    this.returnResult.servicer.pickUpManMobile = result.vTaskReturnService.pickUpManMobile;
                    this.receiveBtnState = result.vTaskReturnService.receivePoint;
                    this.returnResult.servicer.receivePoint = result.vTaskReturnService.receivePoint;
                    this.returnResult.servicer.pickUpAdr = result.vTaskReturnService.pickUpAdr;
                    this.returnResult.servicer.consignee = result.vTaskReturnService.consignee;
                    this.returnResult.servicer.consigneeMobile = result.vTaskReturnService.consigneeMoblie;
                    this.returnResult.servicer.consigneeAdr = result.vTaskReturnService.consigneeAdr;
                    this.returnResult.servicer.returnArr2 = result.vTaskReturnService.taskReturnDetailInfos;
                    this.returnResult.servicer.designLogistics = result.vTaskReturnService.designLogistics;
                    this.returnResult.servicer.transportCompanyMobile =  result.vTaskReturnService.logisticsPhone;
                    this.returnResult.servicer.userWorker = result.vTaskReturnService.userWorker;
                    this.returnResult.servicer.picFee = result.vTaskReturnService.picFee;
                    this.returnResult.servicer.assumeFee = result.vTaskReturnService.assumeFee;
                    this.returnResult.servicer.abnormalDuty = result.vTaskReturnService.abnormalDuty;
                    this.returnResult.servicer.remark = result.vTaskReturnService.remark;
                }
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
    toggle(){
        this.showCarrier = !this.showCarrier;
        this.showServicer = !this.showServicer;
    }
    returnArr1=[0];//承运商
    returnArr2=[0];//服务商
    i=0;
    addReturn(who){
        switch (who){
            case 'carrier':
                this.returnArr1.push(this.i++);
                break;
            case 'servicer':
                this.returnArr2.push(this.i++);
                break;
        }
    }
    removeReturn(who,i){
        switch (who){
            case 'carrier':
                if(this.returnArr1.length > 1){
                    this.returnArr1.splice(i,1);
                }
                break;
            case 'servicer':
                if(this.returnArr2.length > 1){
                    this.returnArr2.splice(i,1);
                }
                break;
        }
    }
    //单选按钮切换
    toggleBtn(who){
        this.btnState = who;
    }
}
