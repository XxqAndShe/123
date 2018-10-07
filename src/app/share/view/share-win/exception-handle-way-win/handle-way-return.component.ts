import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WaybillAbnormalRequestVo } from "../../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import { API } from "../../../lib/api/api";
import { TaskReturnDetail } from "./vo/taskReturnDetail.vo";
import { DragBoxService } from "../../../app-service/drag-box.service";

@Component({
    selector: 'handle-way-return',
    templateUrl: './handle-way-return.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class HandleWayReturnComponent {
    @Input() selectRow;
    consignee: any;
    consigneeMoblie: any;
    consigneeAdr; any;
    assumeFee: any;
    abnormalDuty: any;
    remark: any;
    pickUpMan: any;
    pickUpManMobile: any;
    pickUpAdr: any;
    transportCompany: any;
    transportCompanyMobile: any;
    userWorker: any;
    //师傅推荐数组
    userWorkers: any[];
    picFee: any;
    remake: any;
    taskReturnType: any = "CARRIERS";
    pickUpPoint: any = "customerhome";
    receivePoint: any = "merchants";
    //师傅建议列表
    workerSuggs: any[] = [];
    searchWorker(event) {
        let value = event.query;
        let str = [];
        this.api.call("customerWorkerController.queryWorker", {
            workerName: value
        }).ok(json => {
            // for(let i=0;i<json.result.length;i++){
            //     str.push(json.result[i].realName);
            // }
            // this.suggestionWorkerResult=str;
            this.workerSuggs = json.result
        }).fail(json => {

        });
    }
    save() {
        // let rrequestVO={
        //     abnormal:{id:this.abnormal.id,
        //     handlePerson:this.abnormal.handlePerson},
        //     consignee:this.returnResult.carrier.consignee,
        //     consigneeMoblie:this.returnResult.carrier.consigneeMoblie,
        //     consigneeAdr:this.returnResult.carrier.consigneeAdr,
        //     assumeFee:this.returnResult.carrier.assumeFee,
        //     abnormalDuty:this.returnResult.carrier.abnormalDuty,
        //
        //     receivePoint:this.returnResult.servicer.consigneeAdr,
        //     remark:this.returnResult.carrier.remark,
        //     pickUpMan:this.returnResult.servicer.pickUpMan,
        //     pickUpManMobile:this.returnResult.servicer.pickUpManMobile,
        //     pickUpAdr:this.returnResult.servicer.pickUpAdr,
        //     transportCompany:this.returnResult.servicer.transportCompany,
        //     transportCompanyMobile:this.returnResult.servicer.transportCompanyMobile,
        //     userWorker:this.returnResult.servicer.userWorker,
        //     picFee:this.returnResult.servicer.picFee,
        //     remake:this.returnResult.servicer.remark,
        //     taskReturnType:this.returnResult.servicer.taskReturnType,
        //     pickUpPoint:this.returnResult.servicer.pickUpPoint,
        //     taskReturnDetails:this.returnResult.carrier.returnArr1
        // };
        // //console.log(rrequestVO);
        // // alert(JSON.stringify(rrequestVO));
        // this.api.call("TaskReturnController.abnormalReturn",rrequestVO).ok(json=>{
        //     alert("succeed!")
        // }).fail(json=>{
        //     alert(json.error);
        // });
        //
        // if(window.sessionStorage){
        //     sessionStorage.setItem("returnData",JSON.stringify(this.returnResult));
        // }
        let reg1=/[\-.]/;
        let reg2=/[\-]/;
        let reg3=/\D/;
        this.returnResult.abnormal.id = this.selectedAbnormal.abnormal.id;

        if (this.taskReturnType == 'SERVICE') {
            for (let i = 0; i < this.returnResult.servicer.returnArr2.length; ++i) {
                let goods = this.returnResult.servicer.returnArr2;
                if (!goods[i].productName) {
                    this.showSuccess("warn", "提示", "请填写返货品名！");
                    return;
                }
                if (!goods[i].pieces) {
                    this.showSuccess("warn", "提示", "请填写返货数量！");
                    return;
                }
                if (reg1.test(goods[i].pieces)) {
                    this.showSuccess("warn", "提示", "返货件数必须是正整数！");
                    return;
                }
                if (!goods[i].volume) {
                    this.showSuccess("warn", "提示", "请填写货物体积！");
                    return;
                }
                if (reg2.test(goods[i].volume)) {
                    this.showSuccess("warn", "提示", "货物体积不能为负！");
                    return;
                }
                if (goods[i].pieces > 10000 || goods[i].volume > 10000) {
                    this.showSuccess("warn", "提示", "返货数量或体积不能大于10000！");
                    return;
                }
            }
            if (!this.returnResult.servicer.consignee) {
                this.showSuccess("warn", "提示", "请填写收货人姓名！");
                return;
            }
            if (!this.returnResult.servicer.consigneeMobile) {
                this.showSuccess("warn", "提示", "请填写收货电话！");
                return;
            }
            if (!this.returnResult.servicer.consigneeAdr) {
                this.showSuccess("warn", "提示", "请填写收货地址");
                return;
            }
            if (!this.returnResult.servicer.abnormalDuty) {
                this.showSuccess("warn", "提示", "请选择责任方");
                return;
            }
            if(reg3.test(this.returnResult.servicer.transportCompanyMobile)){
                this.showSuccess("warn", "提示", "物流电话只能输入数字！");
                return;
            }
            this.returnResult.consignee = this.returnResult.servicer.consignee;
            this.returnResult.consigneeMoblie = this.returnResult.servicer.consigneeMobile;
            this.returnResult.consigneeAdr = this.returnResult.servicer.consigneeAdr;
            this.returnResult.abnormalDuty = this.returnResult.servicer.abnormalDuty;
            this.returnResult.abnormalDutyId = this.returnResult.servicer.abnormalDuty.split(',')[0];

            this.returnResult.receivePoint = this.receivePoint;
            this.returnResult.pickUpMan = this.returnResult.servicer.pickUpMan;
            this.returnResult.pickUpManMobile = this.returnResult.servicer.pickUpManMobile;
            this.returnResult.pickUpAdr = this.returnResult.servicer.pickUpAdr;
            this.returnResult.designLogisticsId = this.returnResult.servicer.transportCompany;
            this.returnResult.logisticsPhone = this.returnResult.servicer.transportCompanyMobile;
            this.returnResult.userWorker = this.returnResult.servicer.userWorker;
            this.returnResult.picFee = this.returnResult.servicer.picFee || 0;
            this.returnResult.remark = this.returnResult.servicer.remark;
            this.returnResult.pickUpPoint = this.pickUpPoint;
            this.returnResult.taskReturnDetails = this.returnResult.servicer.returnArr2;
        } else {
            for (let i = 0; i < this.returnResult.carrier.returnArr1.length; ++i) {
                let goods = this.returnResult.carrier.returnArr1;
                if (!goods[i].productName) {
                    this.showSuccess("warn", "提示", "请填写返货品名！");
                    return;
                }
                if (!goods[i].pieces) {
                    this.showSuccess("warn", "提示", "请填写返货数量！");
                    return;
                }
                if (reg1.test(goods[i].pieces)) {
                    this.showSuccess("warn", "提示", "返货件数必须是正整数！");
                    return;
                }
                if (!goods[i].volume) {
                    this.showSuccess("warn", "提示", "请填写货物体积！");
                    return;
                }
                if (reg2.test(goods[i].volume)) {
                    this.showSuccess("warn", "提示", "货物体积不能为负！");
                    return;
                }
                if (goods[i].pieces > 10000 || goods[i].volume > 10000) {
                    this.showSuccess("warn", "提示", "返货件数或体积不能大于10000！");
                    return;
                }
            }
            if (!this.returnResult.carrier.abnormalDuty) {
                this.showSuccess("warn", "提示", "请选择责任方");
                return;
            }
            if (!this.returnResult.carrier.consignee) {
                this.showSuccess("warn", "提示", "请填写收货人姓名！");
                return;
            }
            if (!this.returnResult.carrier.consigneeMobile) {
                this.showSuccess("warn", "提示", "请填写收货人电话！");
                return;
            }
            if (!this.returnResult.carrier.consigneeAdr) {
                this.showSuccess("warn", "提示", "请填写收货地址");
                return;
            }
            this.returnResult.consignee = this.returnResult.carrier.consignee;
            this.returnResult.consigneeMoblie = this.returnResult.carrier.consigneeMobile;
            this.returnResult.consigneeAdr = this.returnResult.carrier.consigneeAdr;
            this.returnResult.abnormalDuty = this.returnResult.carrier.abnormalDuty;
            this.returnResult.abnormalDutyId = this.returnResult.carrier.abnormalDuty.split(',')[0];
            this.returnResult.remark = this.returnResult.carrier.remark;
            this.returnResult.taskReturnDetails = this.returnResult.carrier.returnArr1;
            this.returnResult.picFee = 0;
        }
        let carrierFeeData = this.returnResult.carrier.assumeFee ? this.returnResult.carrier.assumeFee : 0;
        let servicerFeeData = this.returnResult.servicer.assumeFee ? this.returnResult.servicer.assumeFee : 0;
        this.returnResult.assumeFee = Number(carrierFeeData) + Number(servicerFeeData);
        this.returnResult.taskReturnType = this.taskReturnType;

        console.info(this.returnResult);
        let beforeFee: number = this.selectedAbnormal.returnData.assumeFee || 0;
        Object.assign(this.selectedAbnormal.returnData, this.returnResult);

        // if (this.selectedAbnormal.abnormal.handleWay) {
        //     this.selectedAbnormal.abnormal.handleWay = this.selectedAbnormal.abnormal.handleWay.replace("返货,", "");
        // }
        // this.selectedAbnormal.abnormal.handleWay = (this.selectedAbnormal.abnormal.handleWay || "") + "返货,";
        let handleWays: string[] = [];
        if (this.selectedAbnormal.abnormal.handleWay) {
            handleWays = this.selectedAbnormal.abnormal.handleWay.split(',');
        }
        if (_.indexOf(handleWays, "返货") == -1) {
            handleWays.push("返货");
            this.selectedAbnormal.abnormal.handleWay = handleWays.join(',');
        }

        if (this.dutyLabel) {
            this.selectedAbnormal.returnData.dutyLabel=this.dutyLabel;
            this.selectedAbnormal.abnormal.abnormalDutyName = (this.selectedAbnormal.abnormal.abnormalDutyName || "") + this.dutyLabel + ",";
        }

        this.selectedAbnormal.abnormal.assumeFee = Number(this.selectedAbnormal.abnormal.assumeFee || 0) + Number(this.returnResult.assumeFee || 0) - Number(beforeFee);
        //console.log(this.returnResult);
        this.saveDialog.emit();//用于处理过后按钮变色，勿删勿改
    }

    @Output() closeWin = new EventEmitter();
    @Output() saveDialog = new EventEmitter();
    showCarrier: boolean = true;
    showServicer: boolean = false;
    btnState: string = 'customerhome';//单选按钮切换状态
    @Input() selectedAbnormal: any;
    abnormal: WaybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
    constructor(public api: API, public drag: DragBoxService) {
    }
    ngOnInit(): void {
        console.info(this.selectedAbnormal, 'this.selectedAbnormal');
        // Object.assign(this.abnormal, this.selectedAbnormal);
        if (_.keys(this.selectedAbnormal.returnData).length > 0) {
            // //console.log('get');
            Object.assign(this.returnResult.carrier, this.selectedAbnormal.returnData.carrier);
            Object.assign(this.returnResult.servicer, this.selectedAbnormal.returnData.servicer);
        } else {
            // //console.log('set')
            this.returnResult.carrier.consignee = this.selectedAbnormal.abnormal.shipper;
            this.returnResult.carrier.consigneeMobile = this.selectedAbnormal.abnormal.shipperMobile;
            this.returnResult.carrier.consigneeAdr = this.selectedAbnormal.abnormal.shipperAddress;
            this.returnResult.servicer.pickUpMan = this.selectedAbnormal.abnormal.consignee;
            this.returnResult.servicer.pickUpManMobile = this.selectedAbnormal.abnormal.consigneeMobile;
            this.returnResult.servicer.pickUpAdr = this.selectedAbnormal.abnormal.consigneeAddress;
            this.returnResult.servicer.consignee = this.selectedAbnormal.abnormal.shipper;
            this.returnResult.servicer.consigneeMobile = this.selectedAbnormal.abnormal.shipperMobile;
            this.returnResult.servicer.consigneeAdr = this.selectedAbnormal.abnormal.shipperAddress;
            // //测试要求去掉师傅同步
            // if (this.selectedAbnormal.abnormal.worker !== "") {
            //     this.returnResult.servicer.userWorker.mobile = this.selectedAbnormal.abnormal.worker.substring(this.selectedAbnormal.abnormal.worker.indexOf("(") + 1, this.selectedAbnormal.abnormal.worker.length - 1);
            //     this.returnResult.servicer.userWorker.realName = this.selectedAbnormal.abnormal.worker.substring(0, this.selectedAbnormal.abnormal.worker.indexOf("("));
            //     //console.log(this.returnResult.servicer.userWorker);
            // }
            // if(this.selectedAbnormal.abnormal.worker){
            //     this.returnResult.servicer.userWorker = this.selectedAbnormal.abnormal.worker.substr(0,this.selectedAbnormal.abnormal.worker.indexOf("("));
            // }
        }
        this.returnResult.servicer.userWorker = JSON.stringify(this.returnResult.servicer.userWorker) === "{}" ? '' : this.returnResult.servicer.userWorker;

        if (this.returnResult.servicer.returnArr2.length < 1) {
            let taskReturnDetail = new TaskReturnDetail();
            this.returnResult.servicer.returnArr2.push(taskReturnDetail);
        }
        if (this.returnResult.carrier.returnArr1.length < 1) {
            let taskReturnDetail1 = new TaskReturnDetail();
            this.returnResult.carrier.returnArr1.push(taskReturnDetail1);
        }
        let box = document.getElementById("repair_tank");
        let moveArea = document.getElementById("repair_top");
        this.drag.dragEle(moveArea, box);
    }
    close() {
        this.closeWin.emit();
    }
    toggle(args) {
        this.taskReturnType = args;
        this.showCarrier = !this.showCarrier;
        this.showServicer = !this.showServicer;
    }
    //returnArr1:TaskReturnDetail[]=[];//承运商
    //returnArr2=[0];//服务商
    i = 0;
    addReturn(who) {
        let taskReturnDetail = new TaskReturnDetail();
        switch (who) {
            case 'carrier':
                this.returnResult.carrier.returnArr1.push(taskReturnDetail);
                break;
            case 'servicer':
                this.returnResult.servicer.returnArr2.push(taskReturnDetail);
                break;
        }
    }
    toggleBtnR(e) {
        this.receivePoint = e.target.value;
    }
    removeReturn(who, i) {
        switch (who) {
            case 'carrier':
                if (this.returnResult.carrier.returnArr1.length > 1) {
                    this.returnResult.carrier.returnArr1.splice(i, 1);
                }
                break;
            case 'servicer':
                if (this.returnResult.servicer.returnArr2.length > 1) {
                    this.returnResult.servicer.returnArr2.splice(i, 1);
                }
                break;
        }
    }
    //单选按钮切换
    toggleBtn(event) {
        this.btnState = event.target.value;
        this.pickUpPoint = event.target.value;
    }

    //用于存到sessionStorage的对象
    returnResult: any = {
        carrier: {
            consignee: '',
            consigneeMobile: '',
            consigneeAdr: '',
            returnArr1: [],
            assumeFee: 0,
            abnormalDuty: '',
            remark: ''
        },
        servicer: {
            pickUpMan: '',
            pickUpManMobile: '',
            pickUpAdr: '',
            consignee: '',
            consigneeMobile: '',
            consigneeAdr: '',
            returnArr2: [],
            transportCompany: '',
            transportCompanyMobile: '',
            userWorker: {},
            picFee: '',
            assumeFee: 0,
            abnormalDuty: '',
            remark: ''
        },
        abnormal: {
            id: ''
        },
        LStorageHandleWay: "return"
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
    dutyLabel: string = "";
    onDutyChange(event: any,type) {
        let selected = event['selected'][0];
        if(this.selectRow.taskType === '自提' && selected['label'] === '服务商'){
            this.showSuccess("warn", "提示", "自提任务不能选择服务商！");
            if(type === 'carrier'){
                this.returnResult.carrier.abnormalDuty = '';
            }else{
                this.returnResult.servicer.abnormalDuty = '';
            }
            return;
        }
        this.dutyLabel = _.map(event.selected, 'label').toString();
        // console.info(this.dutyLabel);
    }

    /*公共弹窗提示*/
    msgs: any;
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }

    /**
     * 限制正数并小于10000
     * @param val
     * @param tar
     */
    onlyPositive(val,tar){
        if(val){
            if(tar === 'carAsu'){
                this.returnResult.carrier.assumeFee = val.toString().replace(/[^\d.]/g,'');
                if(val > 10000){
                    this.returnResult.carrier.assumeFee = 10000;
                }
            }
            if(tar === 'serPic'){
                this.returnResult.servicer.picFee = val.toString().replace(/[^\d.]/g,'');
                if(val > 10000){
                    this.returnResult.servicer.picFee = 10000;
                }
            }
            if(tar === 'serAsu'){
                this.returnResult.servicer.assumeFee = val.toString().replace(/[^\d.]/g,'');
                if(val > 10000){
                    this.returnResult.servicer.assumeFee = 10000;
                }
            }
        }
    }
}
