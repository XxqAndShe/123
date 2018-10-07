import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { WaybillAbnormalRequestVo } from "../../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import { API } from "../../../lib/api/api";
import { ConfirmationService } from "primeng/primeng";
import { DragBoxService } from "../../../app-service/drag-box.service";

@Component({
    selector: 'handle-way-repair',
    templateUrl: './handle-way-repair.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class HandleWayRepairComponent implements OnInit {
    constructor(public api: API, public confirmationService: ConfirmationService, public drag: DragBoxService, ) {
    }

    waybillId: string;
    //@Output() closeWin = new EventEmitter();
    @Output() closeWin = new EventEmitter<any>();
    @Output() saveDialog = new EventEmitter<any>();
    @Input() selectedAbnormal: any;
    @Input() selectRow;
    @Input() subAbnormalSaleFlag : any;
    abnormal: WaybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
    installMasterName: string;
    installMasterMoblie: string;
    goodsData: any[];//维修商品数据
    selectGoods: any[];//选中商品的数组
    ngOnInit(): void {
        this.installMasterName = "";
        this.installMasterMoblie = "";
        // //console.log("start");
        // //console.log(sessionStorage.getItem('repairData'));
        // //console.log("end");
        // if(sessionStorage.getItem('repairData') != null){
        //     this.repairResult.taskPartType = JSON.parse(sessionStorage.getItem("repairData")).taskRepairType;
        //     this.repairResult.insMaster = JSON.parse(sessionStorage.getItem("repairData")).insMaster;
        //     this.repairResult.taskRepairGoods = JSON.parse(sessionStorage.getItem("repairData")).taskRepairGoods;
        //     this.repairResult.repairFee = JSON.parse(sessionStorage.getItem("repairData")).repairFee;
        //     this.repairResult.shipperFee = JSON.parse(sessionStorage.getItem("repairData")).shipperFee;
        //     this.repairResult.pics = JSON.parse(sessionStorage.getItem("repairData")).pics;
        //     this.repairResult.responsiber = JSON.parse(sessionStorage.getItem("repairData")).responsiber;
        //     this.repairResult.remark = JSON.parse(sessionStorage.getItem("repairData")).remark;
        // }
        // //console.log("selectedAbnormal is ");
        // //console.log(this.selectedAbnormal);
        if (this.selectedAbnormal.repairData) {
            // //console.log('get');
            //console.log("selectedAbnormal.repairData1");
            console.log("---------------------selectedAbnormal.repairData----------------------");
            console.log(this.selectedAbnormal);
            console.log("---------------------selectedAbnormal.repairData----------------------");
            Object.assign(this.repairResult, this.selectedAbnormal.repairData);
            // //测试要求去掉师傅同步
            // if (this.selectedAbnormal.abnormal.worker !== "") {
            //     this.installMasterMoblie = this.selectedAbnormal.abnormal.worker.substring(this.selectedAbnormal.abnormal.worker.indexOf("(") + 1, this.selectedAbnormal.abnormal.worker.length - 1);
            //     this.installMasterName = this.selectedAbnormal.abnormal.worker.substring(0, this.selectedAbnormal.abnormal.worker.indexOf("("));
            //     //console.log(this.installMasterName);
            //     //console.log(this.installMasterMoblie);
            //     this.repairResult.insMaster = this.installMasterName;
            // }
            //console.log("selectedAbnormal.repairData2");
        }
        this.waybillId = this.selectedAbnormal.abnormal.waybillId;
        // //console.log('waybillId=',this.waybillId);
        /*
         * 带出异常登记时上传的图片
         */
        this.api.call("AbnormalController.findTaskRepairAbnormalPic",{
            abnormalId : this.selectedAbnormal.abnormal.id
        }).ok(json=>{
            let result = json.result || {};
            typeof (result.abnormalPicPath) != "undefined" ? this.repairResult.repairPicPath = result.abnormalPicPath : this.repairResult.repairPicPath = [];
            this.repairResult.pics=_.map(this.repairResult.repairPicPath,'id');
        }).fail(err=>{

        });
        this.api.call("abnormalRegistController.waybillQueryGoods",{'first':0,'rows':10},{
            "waybillId": this.selectRow.waybillId
        }).ok(json=>{
            this.goodsData = json.result.content;
        }).fail(err=>{

        });
        let box = document.getElementById("handle_tank");
        let moveArea = document.getElementById("top_tank");
        this.drag.dragEle(moveArea, box);
    }
    onChange(event: any) {
        this.repairResult.taskRepairGoodsLabel = _.map(event.selectedGoods, 'label').toString();
        // console.info(this.repairResult.taskRepairGoodsLabel);
    }

    dutyLabel: string = "";

    onDutyChange(event: any) {
        let selected = event['selected'][0];
        if(this.selectRow.taskType === '自提' && selected['label'] === '服务商'){
            this.showSuccess("warn", "提示", "自提任务不能选择服务商！");
            this.repairResult.responsibers = '';
            return;
        }
        this.dutyLabel = _.map(event.selected, 'label').toString();
    }
    save() {
        if(this.selectGoods){
            this.repairResult.taskRepairGoods = [];
            for(let good of this.selectGoods){
                this.repairResult.taskRepairGoods.push(good.wayBillGoodsId);
            }
        }
        // this.api.call("AbnormalController.addTaskRepair",{
        //     id : this.abnormal.id,
        //     taskRepairType : this.repairResult.taskRepairType,
        //     workermobile : this.repairResult.insMaster.mobile,
        //     repairFee : this.repairResult.repairFee,
        //     shipperFee : this.repairResult.shipperFee,
        //     taskRepairGoods : this.repairResult.taskRepairGoods,
        //     pics : this.repairResult.pics,
        //     responsiber :this.repairResult.responsiber.split(',')[0],
        //     remark : this.repairResult.remark
        // }).ok(json=>{
        //     ////console.log(json.result);
        //     this.confirmationService.confirm({
        //      message: '维修任务添加成功!',
        //      header: '提示',
        //      accept: () => {
        //          let obj={
        //              workerRealName:this.repairResult.insMaster.realName,
        //              handleWay:'维修',
        //              responsiber : this.repairResult.responsiber.split(',')[1] + '(维修)',
        //              shipperFee : this.repairResult.shipperFee,
        //              oldShipperFee : JSON.parse(sessionStorage.getItem("repairData")).shipperFee,
        //              flag : 'save'
        //          }
        //         this.closeWin.emit(obj);
        //      }
        //      });
        //     //alert("维修任务添加成功!");
        //     let obj={
        //         workerRealName:this.repairResult.insMaster.realName,
        //         handleWay:'维修',
        //         responsiber : this.repairResult.responsiber.split(',')[1] + '(维修)',
        //         shipperFee : this.repairResult.shipperFee,
        //         oldShipperFee : JSON.parse(sessionStorage.getItem("repairData")).shipperFee,
        //         flag : 'save'
        //     }
        //     this.closeWin.emit(obj);
        //
        // }).fail(data=>{});

        if (this.goodsData && this.repairResult.taskRepairGoods.length < 1) {
            this.showSuccess("warn", "提示", "请选择维修品名");
            return;
        }
        if(!this.repairResult.taskRepairType){
            this.showSuccess("warn", "提示", "请选择维修类型！");
            return;
        }
        if (!this.repairResult.repairFee && this.repairResult.repairFee !== 0) {
            this.showSuccess("warn", "提示", "请输入维修费用！");
            return;
        }
        if (this.repairResult.repairFee > 10000 || this.repairResult.shipperFee > 10000) {
            this.showSuccess("warn", "提示", "维修费用或承担金额不能大于10000！");
            return;
        }
        if (!this.repairResult.responsibers) {
            this.showSuccess("warn", "提示", "请选择责任方");
            return;
        }
        /*if (this.installMasterMoblie === "") {
            if (typeof (this.repairResult.insMaster) !== 'object') {
                this.showSuccess("warn", "提示", "请正确选择安装师傅！");
                return;
            }
        }*/
        this.repairResult.id = this.selectedAbnormal.abnormal.id;
        // //console.log(this.repairResult);
        // this.selectedAbnormal.repairResult = this.repairResult;
        // this.selectedAbnormal.repairResult = {};
        let beforeFee: number = this.selectedAbnormal.repairData.shipperFee || 0;
        Object.assign(this.selectedAbnormal.repairData, this.repairResult);
        if (this.installMasterMoblie === "") {
            this.selectedAbnormal.repairData.workermobile = this.repairResult.insMaster.mobile;
        } else {
            this.selectedAbnormal.repairData.workermobile = this.installMasterMoblie;
        }
        this.selectedAbnormal.repairData.taskRepairGoods = this.repairResult.taskRepairGoods;
        this.selectedAbnormal.repairData.pics = this.repairResult.pics;
        this.selectedAbnormal.repairData.responsiber = this.repairResult.responsibers;

        let handleWays: string[] = [];
        if (this.selectedAbnormal.abnormal.handleWay) {
            handleWays = this.selectedAbnormal.abnormal.handleWay.split(',');
        }
        if (_.indexOf(handleWays, "维修") == -1) {
            handleWays.push("维修");
            this.selectedAbnormal.abnormal.handleWay = handleWays.join(',');
        }

        if (this.dutyLabel) {
            this.selectedAbnormal.repairData.dutyLabel=this.dutyLabel;
            this.selectedAbnormal.abnormal.abnormalDutyName = (this.selectedAbnormal.abnormal.abnormalDutyName || "") + this.dutyLabel + ",";
        }

        let assumeFee: number = this.selectedAbnormal.abnormal.assumeFee || 0;
        let shipperFee: number = this.repairResult.shipperFee || 0;
        let newAssumeFee = (assumeFee + Number(shipperFee) - Number(beforeFee));
        this.selectedAbnormal.abnormal.assumeFee = newAssumeFee;
        // //console.log(this.selectedAbnormal);


        //保存数据到当前会话
        if (window.sessionStorage) {
            //console.log(this.repairResult);
            sessionStorage.setItem("repairData", JSON.stringify(this.repairResult));
        }
        let obj = {
            workerRealName: this.repairResult.insMaster.realName,
            handleWay: '维修',
            // responsiber : this.repairResult.responsiber.split(',')[1] + '(维修)',
            shipperFee: this.repairResult.shipperFee,
            oldShipperFee: JSON.parse(sessionStorage.getItem("repairData")).shipperFee == null ? 0 : JSON.parse(sessionStorage.getItem("repairData")).shipperFee,
            flag: 'save'
        }
        // this.selectedAbnormal.abnormal.handleWay += ",维修";
        // if(this.repairResult.responsiber) {
        //     this.selectedAbnormal.abnormal.abnormalDutyName += "," + this.repairResult.responsiber;
        // }
        this.saveDialog.emit();//用于处理过后按钮变色，勿删勿改
    }

    close() {
        let obj = {
            workerRealName: '',
            handleWay: '',
            responsiber: '',
            shipperFee: '',
            oldShipperFee: '',
            flag: 'cancel'
        }
        this.closeWin.emit(obj);
    }

    repairResult: any = {
        id: "",
        taskRepairType: "Weixiu",
        insMaster: "",
        taskRepairGoods: [],
        taskRepairGoodsLabel: "请选择…",
        repairFee: 0,
        shipperFee: 0,
        pics: [],
        repairPicPath: [],
        responsibers: "",
        remark: "",
        LStorageHandleWay: "repair"
    };

    //验证输入两位小数
    /*validateHandle(event, who) {
        let reg1 = /([\d]*\.[\d]{2})([\d]+)/g;
        let reg2 = /[\d]*\.[\d]{2}$/g;
        let reg3 = /[\d]*\.[\d]$/g;
        let reg4 = /[\d]*\.?$/g;
        let val = event.target.value;
        switch (who) {
            case 'repair':
                if (reg1.test(val)) {
                    this.repairResult.repairFee = val.toString().replace(reg1, '$1');
                    return;
                }
                if (reg2.test(val)) {
                    this.repairResult.repairFee = val;
                    return;
                }
                if (reg3.test(val)) {
                    this.repairResult.repairFee += "0";
                    return;
                }
                if (reg4.test(val)) {
                    this.repairResult.repairFee += "\.00";
                    return;
                }
                break;
            case 'seller':
                if (reg1.test(val)) {
                    this.repairResult.shipperFee = val.toString().replace(reg1, '$1');
                    return;
                }
                if (reg2.test(val)) {
                    this.repairResult.shipperFee = val;
                    return;
                }
                if (reg3.test(val)) {
                    this.repairResult.shipperFee += "0";
                    return;
                }
                if (reg4.test(val)) {
                    this.repairResult.shipperFee += "\.00";
                    return;
                }
        }
    }*/

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
            if(tar === 'repair'){
                this.repairResult.repairFee = val.toString().replace(/[^\d.]/g,'');
                if(val > 10000){
                    this.repairResult.repairFee = 10000;
                }
            }else{
                this.repairResult.shipperFee = val.toString().replace(/[^\d.]/g,'');
                if(val > 10000){
                    this.repairResult.shipperFee = 10000;
                }
            }
        }
    }
}
