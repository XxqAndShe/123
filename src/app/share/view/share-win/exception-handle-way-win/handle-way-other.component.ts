import { Component, OnInit, Output, Input, EventEmitter, DoCheck } from '@angular/core';
import { API } from "../../../../share/lib/api/api";
import { DragBoxService } from "../../../app-service/drag-box.service";
import {concat} from "rxjs/operator/concat";


@Component({
    selector: 'handle-way-other',
    templateUrl: './handle-way-other.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class HandleWayOtherComponent implements OnInit, DoCheck {
    @Input() selectionAbnormal: any;
    @Input() masterMsg;//异常大页传入的师傅
    @Input() selectRow;//所选行数据
    @Output() closeWin = new EventEmitter();
    @Output() saveDialog = new EventEmitter();

    dutyData: any[] = [];//责任方数组
    repayData: any[] = [];//补偿对象数组
    feeNameData: any[] = [];//费用名称数组

    showMasterSelectBox: boolean = false;//是否显示师傅姓名选择框
    //过滤服务类型
    filterOptions: any[] = ['专线送货'];
    msgs: any[] = [];
    level: any;//地址组件level
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
    navs:any[] = [];
    curIndex: number = 0;
    isBusinessMen: boolean = false;
    constructor(public api: API, public drag: DragBoxService) { };
    //旧运单信息对象
    oldInfo: any = {
        serviceTypeOld: "",
        consigneeOld: "",
        consigneeMobileOld: "",
        consigneeAddressOld: "",
        siteArrivalOld: "",
        distinationOld: "",
        pickUpMobileOld: "",
        pickUpAdrOld: "",
        pickUpCodeOld: "",//提货码
        logisticsBillOld: "",//物流单号
        addrCodeOld: "",//提货区域
        sfhxOld: "",
        outward: ""
    };
    //责任费用的对象,初始化为0,部分数据调接口后赋值
    oldWaybillFee: any = {
        InstallChareg: "0",//安装费
        DeliveryChareg: "0",//送货费
        UpstairsCharge: "0",//上楼费
        TakeChareg: "0",//提货费
        PayOutChareg: "0",//垫付费
        ExceedVolumeChareg: "0",//超方费
        ExceedAreaChareg: "0",//超区费
        StevedoreChareg: "0",//拆装费
        HoistingChareg: "0",//吊楼费
        TranslationChareg: "0",//平移费
        EmptyChareg: "0",//空跑费
        SpecialAreaCharge: "0",//特殊区域费
        StorageChareg: "0",//仓储费
        UrgentChareg: "0",//加急费
        OnsiteChareg: "0",//二次上门费
        MinUpstairsChareg: "0",//≤7楼搬楼费
        MaxUpstairsChareg: "0",//＞7楼搬楼费
        ServiceDebit: "0",//服务商扣费
        ProtectionChareg: "0",//保价费
    };
    //包含整个页面数据的对象
    otherResult: any = {
        abnormalId: "",
        //基本信息
        taskOtherWaybill: {
            waybillServiceType: '',
            consignee: '',
            consigneeMobile: '',
            consigneeAddress: '',
            siteArrival: '',
            distination: '',
            pickUpMobile: '',
            pickUpAdr: '',
            check: '',
            verificationCode: '',
            surceType: '',
            serviceTypeTmall: '',
        },
        //责任方
        dutySide: [{
            dutyName: ''
        }],
        //商品明细
        goodsDetail: [
            {
                oldGoodsId: '',
                oldName: '',
                oldPackageNumber: '',
                oldInstallNumber: '',
                oldweight: '',
                oldVolume: '',
                installChargeOld: '',
                upstairsChargeOld: '',
                idBak:'',
                goodsId: '',
                name: '',
                packageNumber: '',
                installNumber: '',
                weight: '',
                volume: '',
                installCharge: '',
                upstairsCharge: '',
            }
        ],
        //费用处理
        feeHandle: [{
            name: '',
            oldFee: '',
            fee: '',
            bearFeeArr: [{
                dutysId: '',
                assumeFee: ''
            }],
            repaysMetaName: '',
            repaysFee: ''
        }],
        //异常关联师傅电话号码
        userWorkerMobile:'',
        //费用处理结果
        feeResult: {
            dutyData: {},
            bcData: {}
        },
        //其他
        other: {
            moveClaim: '',
            riskReason: '',
            handleRemark: '',
            //聊天记录
            chatRecord: []
        },
        LStorageHandleWay: "other"
    };
    //核销单号对象
    vTmailCheckInspect: any = {
        verificationCode: "",
        surceType: "",
        serviceTypeTmall: "",
    };
    //更改提货信息对象
    vPickUpReq: any = {
        taskId: '',
        pickUpTel: '',
        pickUpCode: '',
        pickUpAddress: '',
        addrCode: '',
        logisticsBill: '',
        abnoSource: 'ips'
    };
    /**
     * 商品明细合计（原）
     */
    oldPackageNumTotal: number = 0;
    oldInstallNumTotal: number = 0;
    oldWeightTotal: number = 0;
    oldVolumeTotal: number = 0;
    installChargeOldTotal: number = 0;
    upstairsChargeOldTotal: number = 0;
    /**
     * 商品明细合计（改）
     */
    packageNumTotal: number = 0;
    installNumTotal: number = 0;
    weightTotal: number = 0;
    volumeTotal: number = 0;
    installChargeTotal: number = 0;
    upstairsChargeTotal: number = 0;
    arrTemp: any[] = [];
    ngOnInit() {
        if(this.selectRow.taskType === '调度任务' || this.selectRow.taskType === '配装任务' || this.selectRow.taskType === '自提'){
            this.navs = ["产品信息修改", "收货人信息修改", "核销信息修改", "提货信息修改", "费用信息修改"];
        }else{
            this.navs = ["费用信息修改"];
        }
        this.otherResult.taskOtherWaybill.check = 'empty';
        this.getOldWaybill();
        if (this.selectionAbnormal.repairData) {
            //console.log(this.selectionAbnormal, 'get');
            Object.assign(this.otherResult, this.selectionAbnormal.otherData);
        }
        let box = document.getElementById("others_tank");
        let moveArea = document.getElementById("others_top");
        this.drag.dragEle(moveArea, box);

        this.arrTemp = this.otherResult.other.chatRecord;
        // if(window.sessionStorage){
        //     //console.log(this.otherResult, 'initttttttttt');
        //     this.otherResult.other.chatRecord = sessionStorage.getItem('aaaaa').split(',');
        // }

        if(this.masterMsg){
            this.otherResult.userWorkerMobile = this.masterMsg;
        }
        //加载提货信息
        this.api.call('taskInstallController.findPickUp',
            {'taskId': this.selectRow.taskID || this.selectRow.id}
        ).ok(data => {
            if(data.result){
                this.oldInfo.pickUpCodeOld = data.result.pickUpCode ? data.result.pickUpCode : '';
                this.oldInfo.logisticsBillOld = data.result.logisticsBill ? data.result.logisticsBill: '';
                this.oldInfo.addrCodeOld = data.result.addrCode ? data.result.addrCode: '';
                this.oldInfo.pickUpAdrOld = data.result.pickUpAddress ? data.result.pickUpAddress: '';
                this.oldInfo.pickUpMobileOld = data.result.pickUpTel ? data.result.pickUpTel: '';
            }
        }).fail(data => {})
        setTimeout(()=>{
            this.initPickInfo();
        },1000);
    }

    ngDoCheck() {
        //计算
        this.feeResultHandler();
        this.onFeeTotalChange();
    }

    /**
     * 提货信息初始化，默认等于原信息
     */
    initPickInfo(){
        this.vPickUpReq.taskId = this.selectRow.taskID || this.selectRow.id;
        this.vPickUpReq.pickUpTel = this.oldInfo.pickUpMobileOld;
        this.vPickUpReq.pickUpCode = this.oldInfo.pickUpCodeOld;
        this.vPickUpReq.pickUpAddress = this.oldInfo.pickUpAdrOld;
        this.vPickUpReq.logisticsBill = this.oldInfo.logisticsBillOld;
        this.vPickUpReq.addrCode = this.oldInfo.addrCodeOld;
    }
    close() {
        //取消的方法
        this.closeWin.emit();
    }
    save() {
        if(this.otherResult.userWorkerMobile){
            this.otherResult.userWorkerMobile=this.otherResult.userWorkerMobile.replace(/\D/g,'');
        }
        /**
         * 当是否核销为true时,验证核销单号是否存在
         * */
        if (this.otherResult.taskOtherWaybill.check == 'true') {
            this.vTmailCheckInspect.verificationCode = this.otherResult.taskOtherWaybill.verificationCode;
            this.vTmailCheckInspect.surceType = this.otherResult.taskOtherWaybill.surceType;
            this.vTmailCheckInspect.serviceTypeTmall = this.otherResult.taskOtherWaybill.serviceTypeTmall;
            this.api.call('AbnormalOtherHandleController.tmailCheckInspect', this.vTmailCheckInspect)
                .ok(data => {
                })
                .fail(data => {
                    //console.log(data);
                    this.showSuccess("error", "提示", data.error);
                    return;
                })
        }
        /**
         * 输入验证
         */
        let that = this;
        for(let good of this.otherResult.goodsDetail){
            if(good.packageNumber < 0 || good.packageNumber > 10000
                || good.installNumber < 0 || good.installNumber > 10000
                    || good.weight < 0 || good.weight > 10000
                || good.volume < 0 || good.volume > 10000){
                this.showSuccess("warn", "提示", "商品件数或体积不能为负数或大于10000！");
                return;
            }
            if(good.packageNumber){
                if(good.packageNumber.toString().match(/\./g)){
                    this.showSuccess("warn", "提示", "商品件数不能有小数！");
                    return;
                }
            }
            if(good.installNumber){
                if(good.installNumber.toString().match(/\./g)){
                    this.showSuccess("warn", "提示", "商品体积不能有小数！");
                    return;
                }
            }
        }
        for (let i = 0; i < this.otherResult.feeHandle.length; i++) {
            if (this.otherResult.feeHandle[i].name) {
                for (let n = 0; n < this.otherResult.feeHandle[i].bearFeeArr.length; n++) {
                    if (!this.otherResult.feeHandle[i].fee && this.otherResult.feeHandle[i].name !== 'InstallChareg'
                        && this.otherResult.feeHandle[i].name !== 'UpstairsCharge') {
                        this.showSuccess("warn", "提示", "请完善更改后价格信息！");
                        return;
                    } else if (!this.otherResult.feeHandle[i].bearFeeArr[n].dutysId) {
                        this.showSuccess("warn", "提示", "请完善责任方信息！");
                        return;
                    } else if (!this.otherResult.feeHandle[i].bearFeeArr[n].assumeFee) {
                        this.showSuccess("warn", "提示", "请完善承担金额信息！");
                        return;
                    } else if (!this.otherResult.feeHandle[i].repaysMetaName) {
                        this.showSuccess("warn", "提示", "请完善收款对象信息！");
                        return;
                    }  else if (this.otherResult.feeHandle[i].fee > 10000
                        || this.otherResult.feeHandle[i].bearFeeArr[n].assumeFee > 10000
                        || this.otherResult.feeHandle[i].repaysFee > 10000) {
                        this.showSuccess("warn", "提示", "金额不能大于10000！");
                        return;
                    } else if (this.otherResult.feeHandle[i].repaysFee && this.otherResult.feeHandle[i].repaysFee.toString().match(/\.\d{3,}/)) {
                        this.showSuccess("warn", "提示", "收款金额最多支持两位小数！");
                        return;
                    } else if (this.otherResult.feeHandle[i].bearFeeArr[n].dutysId == this.otherResult.feeHandle[i].repaysMetaName) {
                        this.showSuccess("warn", "提示", "责任方与收款对象不能相同！");
                        return;
                    }/* else if ((this.otherResult.feeHandle[i].bearFeeArr[n].dutysId == 'business') && !this.otherResult.other.chatRecord.length){
                        this.showSuccess("warn", "提示", "商家责任需上传图片！");
                        return;
                    }*/
                }

                //计算
                this.feeResultHandler();
                /*if (!this.validFeeNameAmount()) {
                    this.showSuccess("warn", "提示", "费用承担金额总和必须等于差额总和");
                    return;
                }*/
            }
            if(this.otherResult.feeHandle[i].name === ''){
                for (let j = 0; j < this.otherResult.feeHandle[i].bearFeeArr.length; j++) {
                    if(this.otherResult.feeHandle[i].bearFeeArr[j].dutysId != '' || this.otherResult.feeHandle[i].bearFeeArr[j].assumeFee != ''){
                        this.showSuccess("warn", "提示", "请选择费用名称！");
                        return;
                    }
                    if(this.otherResult.feeHandle[i].repaysMetaName){
                        this.showSuccess("warn", "提示", "请选择费用名称！");
                        return;
                    }
                }
            }
        }
        if (this.showMasterSelectBox && !this.otherResult.userWorkerMobile) {
            this.showSuccess("warn", "提示", "请输入师傅名称！");
            return;
        }
        if(this.otherResult.other.moveClaim && !this.otherResult.other.riskReason){
            this.showSuccess("warn", "提示", "请选择出险原因！");
            return;
        }
        if(this.level < 2){
            this.showSuccess("warn", "提示", "提货区域需精确到区县级！");
            return;
        }
        if(this.vPickUpReq.pickUpTel !== this.oldInfo.pickUpMobileOld || this.vPickUpReq.pickUpAddress !== this.oldInfo.pickUpAdrOld
        || this.vPickUpReq.addrCode !== this.oldInfo.addrCodeOld || this.vPickUpReq.pickUpCode !== this.oldInfo.pickUpCodeOld
        || this.vPickUpReq.logisticsBill !== this.oldInfo.logisticsBillOld){
            if(!this.vPickUpReq.pickUpTel || !this.vPickUpReq.pickUpAddress || !this.vPickUpReq.addrCode
                || !this.vPickUpReq.pickUpCode || !this.vPickUpReq.logisticsBill){
                this.showSuccess("warn", "提示", "请完善提货信息！");
                return;
            }
        }
        if (!this.otherResult.other.handleRemark) {
            this.showSuccess("warn", "提示", "请填写备注信息！");
            return;
        }
        //直接从表格返回的数据中取数据（这里暂时只是模拟数据）
        this.otherResult.abnormalId = this.selectionAbnormal.abnormal.id;
        this.otherResult.feeResult.dutyData = this.dutyData;
        this.otherResult.feeResult.bcData = this.repayData;
        // 图片storage
        // if (window.sessionStorage) {
        //     // //console.log(this.otherResult.other.chatRecord, 'this.otherResult.other.chatRecord')
        //     sessionStorage.setItem("aaaaa", this.otherResult.other.chatRecord);
        // }
        //把整个页面的数据对象存到sessionStorage
        //测试单独其他部分的接口服务是否正常
        /*this.api.call('abnormalOtherHandleController.abnormalOtherHandle', this.otherResult)
            .ok(data => {
                //console.log(data);
            })
            .fail(data => {
                // TODO(优化)
                ////console.log(data);
            });*/
        // if (window.sessionStorage) {
        //     sessionStorage.setItem("otherData", JSON.stringify(this.otherResult));
        // }
        let beforeFee: number = this.selectionAbnormal.otherData.shipperFee || 0;
        this.otherResult.shipperFee = 0;
        this.dutyData.forEach((item) => {
            if (item.name === '商家') {
                this.otherResult.shipperFee += item.value;
            }
        })
        Object.assign(this.selectionAbnormal.otherData, this.otherResult);

        // if (this.selectionAbnormal.abnormal.handleWay) {
        //     this.selectionAbnormal.abnormal.handleWay = this.selectionAbnormal.abnormal.handleWay.replace("其它,", "");
        // }
        // this.selectionAbnormal.abnormal.handleWay = (this.selectionAbnormal.abnormal.handleWay || "") + "其它,";
        // let abnormalDutyName: string = this.selectionAbnormal.abnormal.abnormalDutyName || "";

        let handleWays: string[] = [];
        if (this.selectionAbnormal.abnormal.handleWay) {
            handleWays = this.selectionAbnormal.abnormal.handleWay.split(',');
        }
        if (_.indexOf(handleWays, "其它") == -1) {
            handleWays.push("其它");
            this.selectionAbnormal.abnormal.handleWay = handleWays.join(',');
        }

        // 接收处理好的责任方字符串
        let abnormalDutyName: String = this.dutyNameDeal();


        // this.selectionAbnormal.abnormal.abnormalDutyName = abnormalDutyName;
        // this.otherResult.dutySide = abnormalDutyName;
        // 传到异常信息大类保存
        this.selectionAbnormal.otherData.dutyName = abnormalDutyName;
        this.selectionAbnormal.abnormal.assumeFee = Number(this.selectionAbnormal.abnormal.assumeFee || 0) + Number(this.otherResult.shipperFee || 0) - Number(beforeFee);
        this.saveDialog.emit();//用于处理过后按钮变色，勿删勿改
        //提货信息修改时才保存sessionStorage
        if(this.vPickUpReq.pickUpTel !== this.oldInfo.pickUpMobileOld || this.vPickUpReq.pickUpAddress !== this.oldInfo.pickUpAdrOld
            || this.vPickUpReq.addrCode !== this.oldInfo.addrCodeOld || this.vPickUpReq.pickUpCode !== this.oldInfo.pickUpCodeOld
            || this.vPickUpReq.logisticsBill !== this.oldInfo.logisticsBillOld){
            sessionStorage.setItem('vPickUpReq',JSON.stringify(this.vPickUpReq));
        }
    }
    dutyChange($event, i) {
        Object.assign(this.otherResult.dutySide[i], $event.selected[0]);
        if($event.event.value === 'businessmen'){
            this.isBusinessMen = true;
        }else{
            this.isBusinessMen = false;
        }
    }
    i = 0;
    addRespon(who, index?: any) {
        switch (who) {
            case 'respon':
                //this.dutys.push({});
                this.otherResult.dutySide.push({});
                break;
            case 'fee':
                this.otherResult.feeHandle.push({
                    name: '',
                    oldFee: '',
                    fee: '',
                    bearFeeArr: [{
                        dutysId: '',
                        assumeFee: ''
                    }],
                    repaysMetaName: ''
                });
                //console.info(this.otherResult.feeHandle)
                //this.fees.push({});
                break;
            case 'goods':
                //this.goodsName.push(this.i++);
                this.otherResult.goodsDetail.push({
                    oldGoodsId: 0,
                    oldName: '',
                    oldPackageNumber: 0,
                    oldInstallNumber: 0,
                    oldweight: 0,
                    oldVolume: 0,
                    installChargeOld: 0,
                    upstairsChargeOld: 0,
                    goodsId: 0,
                    name: 0,
                    packageNumber: 0,
                    installNumber: 0,
                    weight: 0,
                    volume: 0,
                    installCharge: 0,
                    upstairsCharge: 0,
                });
                break;
            case 'bearFee':
                this.otherResult.feeHandle[index]['bearFeeArr'].push({});
                ////console.log(index);
                break;
        }
    }
    removeRespon(who, i, j?: any) {
        switch (who) {
            case 'respon':
                /*if(this.dutys.length!==1){
                    this.dutys = this.dutys.slice(0,i).concat(this.dutys.slice(i++));
                }*/
                if (this.otherResult.dutySide.length !== 1) {
                    this.otherResult.dutySide.splice(i, 1);
                }
                break;
            case 'fee':
                if (this.otherResult.feeHandle.length !== 1) {
                    this.otherResult.feeHandle.splice(i, 1);
                    //this.fees = this.fees.slice(0,i).concat(this.fees.slice(i++));
                }
                break;
            case 'goods':
                if (this.otherResult.goodsDetail.length !== 1) {
                    this.otherResult.goodsDetail.splice(i, 1);
                }
                break;
            case 'bearFee':
                if (this.otherResult.feeHandle[j].bearFeeArr.length !== 1) {
                    this.otherResult.feeHandle[j].bearFeeArr.splice(i, 1);
                }
                break;
        }
    }
    /**
     * 查询品名和数量
     */
    getOldWaybill(): any {
        this.api.call('abnormalOtherHandleController.waybillQueryOtherHandle', { "abnormalId": this.selectionAbnormal.abnormal.id })
            .ok(data => {
                // TODO(优化)
                //console.log(this.selectionAbnormal);
                this.oldInfo.serviceTypeOld = data.result.serviceType;
                this.oldInfo.consigneeOld = data.result.consigneeOld;
                this.oldInfo.consigneeMobileOld = data.result.consigneeMobileOld;
                this.oldInfo.consigneeAddressOld = data.result.consigneeAddressOld;
                this.oldInfo.siteArrivalOld = data.result.siteArrivalOld;
                this.oldInfo.distinationOld = data.result.distinationOld;
                // this.oldInfo.pickUpMobileOld = data.result.pickUpMobileOld;
                // this.oldInfo.pickUpAdrOld = data.result.pickUpAdrOld;
                this.oldInfo.sfhxOld = data.result.tmail;
                this.oldInfo.outward = data.result.outward;
                this.otherResult.goodsDetail = [];
                //console.log(this.oldInfo, 'this.oldInfo');
                for (let i = 0; i < data.result.goods.length; i++) {
                    this.otherResult.goodsDetail.push({
                        oldGoodsId: data.result.goods[i].oldGoodsId,
                        oldInstallNumber: data.result.goods[i].oldInstallNumber,
                        oldName: data.result.goods[i].oldName,
                        oldPackageNumber: data.result.goods[i].oldPackageNumber,
                        oldVolume: data.result.goods[i].oldVolume,
                        oldweight: data.result.goods[i].oldweight,
                        installChargeOld: data.result.goods[i].installChargeOld,
                        upstairsChargeOld: data.result.goods[i].upstairsChargeOld,
                        idBak:data.result.goods[i].idBak,
                    });
                    /**
                     * 商品明细合计计算
                     * @type {Number}
                     */
                    this.oldPackageNumTotal += data.result.goods[i].oldPackageNumber;
                    this.oldInstallNumTotal += data.result.goods[i].oldInstallNumber;
                    this.oldWeightTotal += data.result.goods[i].oldweight;
                    this.oldVolumeTotal += data.result.goods[i].oldVolume;
                    this.installChargeOldTotal += data.result.goods[i].installChargeOld;
                    this.upstairsChargeOldTotal += data.result.goods[i].upstairsChargeOld;
                }
                //    费用回显
                {
                    //console.log(data.result.vWaybillFee);
                    if (data.result.vWaybillFee) {
                        //安装费
                        if (data.result.vWaybillFee.installCharge) { this.oldWaybillFee.InstallChareg = data.result.vWaybillFee.installCharge; }
                        //送货费
                        if (data.result.vWaybillFee.deliveryCharge) { this.oldWaybillFee.DeliveryChareg = data.result.vWaybillFee.deliveryCharge; }
                        //上楼费
                        if (data.result.vWaybillFee.upstairsCharge) { this.oldWaybillFee.UpstairsCharge = data.result.vWaybillFee.upstairsCharge; }
                        //保价费
                        if (data.result.vWaybillFee.protectioncharge) { this.oldWaybillFee.ProtectionChareg = data.result.vWaybillFee.protectioncharge; }
                        //提货费
                        if (data.result.vWaybillFee.takecharge) { this.oldWaybillFee.TakeChareg = data.result.vWaybillFee.takecharge; }
                    }
                }
            })
            .fail(data => {
                // TODO(优化)
                ////console.log(data);
            })
    }

    /**
     * 动态赋值
     */
    oldWaybillFeeObj = {
        "安装费": "InstallChareg",
        "送货费": "DeliveryChareg",
        "上楼费": "UpstairsCharge",//
        "保价费": "ProtectionChareg",
        "提货费": "TakeChareg",
        "垫付费": "PayOutChareg",
        "超方费": "ExceedVolumeChareg",
        "超区费": "ExceedAreaChareg",
        "拆装费": "StevedoreChareg",
        "吊楼费": "HoistingChareg",
        "平移费": "TranslationChareg",
        "空跑费": "EmptyChareg",
        "特殊区域费": "SpecialAreaCharge",//
        "仓储费": "StorageChareg",
        "加急费": "UrgentChareg",
        "二次上门费": "OnsiteChareg",
        "≤7楼搬楼费": "MinUpstairsChareg",
        "＞7楼搬楼费": "MaxUpstairsChareg",
        "服务商扣费": "ServiceDebit",

    };
    readonly: boolean = false;
    //下拉框选择事件
    onFeeNameChange(event: any, fee: any, index: number, oldWaybillFee?: any) {
        let fieldName = event;
        fee.oldFee = oldWaybillFee[fieldName];
        if(event === 'InstallChareg' || event === 'UpstairsCharge'){
            $("input[alt=fee_"+index+"]").attr({readonly: 'readonly', placeholder: ''});
        } else {
            $("input[alt=fee_"+index+"]").removeAttr('readonly');
        }
    }

    // ----------------------
    tmallhomeObj = {
        "家装干支服务": "homebranchservice",
        "家装干支装服务": "hometrunckandbranchandinstallservice",
        "卫浴大件干支,集成吊顶大件干支": "Bathroombranchservice",
        "卫浴大件安装,集成吊顶大件安装": "Bathroominstallservice",
        "地板干支,涂料干支,瓷砖干支,油漆干支": "floorbranchservice",
        "地板安装,涂料安装,瓷砖安装,油漆安装": "floorinstallservice",
    };
    tmalljiyoujiaObj = {
        "家装干支装服务": "hometrunckandbranchandinstallservice",
        "卫浴大件干支,集成吊顶大件干支": "Bathroombranchservice"
    };
    //下拉框选择事件
    onOrderOriginChange(who: any) {
        switch (who) {
            case 'tmallhome':
                this.loadOptions(this.tmallhomeObj);
                break;
            case 'tmallbuilding':
                this.loadOptions(this.tmallhomeObj);
                break;
            case 'tmalljiyoujia':
                this.loadOptions(this.tmalljiyoujiaObj);
                break;
        }
    }
    loadOptions(fwbmObj: any) {
        $('#serviceTypeTmall_select').html('<option value="">请选择</option>');
        for (let obj in fwbmObj) {
            let tag = `<option value=${fwbmObj[obj]}>${obj}</option>`;
            $('#serviceTypeTmall_select').append(tag);
        }
    }

    /**
     * 字典选择变动
     */
    onMetaSelectedChange(event: any, obj: any, type: string) {
        let selected = event['selected'][0];
        if (type == 'duty') {
            if (!this.oldInfo.outward && selected['label'] === '承运商') {
                this.showSuccess("warn", "提示", "此单尚无承运商！");
                obj['dutysId'] = '';
                return;
            }
            if(this.selectRow.taskType === '自提' && selected['label'] === '服务商'){
                this.showSuccess("warn", "提示", "自提任务不能选择服务商！");
                obj['dutysId'] = '';
                return;
            }
            obj['dutysName'] = selected['label'];
        }
        else {
            if (!this.oldInfo.outward && selected['label'] === '承运商') {
                this.showSuccess("warn", "提示", "此单尚无承运商！");
                obj['repaysMetaName'] = '';
                return;
            }
            if(this.selectRow.taskType === '自提' && selected['label'] === '服务商'){
                this.showSuccess("warn", "提示", "自提任务不能选择服务商！");
                obj['repaysMetaName'] = '';
                return;
            }
            obj['repaysName'] = selected['label'];
        }
    }
    /**
     * 动态计算责任方和补偿对象金额
     */
    feeResultHandler() {
        let feeRows = this.otherResult.feeHandle || [];
        let tempArr: any[] = [];
        for (let fee of feeRows) {
            let feeObj = {};
            let bearFeeArr = fee.bearFeeArr;
            let tempBear = [];
            //取出当前记录的所有责任方数据并计算总和
            for (let bear of bearFeeArr) {
                let obj = {};
                if (bear['dutysId'] && bear['dutysName']) {
                    //临时变量，为了计算判断(duty_前缀为了区分与赔偿对象）
                    obj['_countName'] = 'duty_' + bear['dutysName'] || '未知';
                    obj['duty_' + bear['dutysName']] = Number(bear['assumeFee']) || 0;
                }
                tempBear.push(obj);
            }
            //合并相同责任方数据
            let bearSumObj = sumObj(tempBear, 0);

            let totalFeeArr = _.values(bearSumObj);
            //不同责任方总金额
            let totalAssumeFee = _.sum(totalFeeArr);

            //补偿对象对应金额
            if (fee['repaysMetaName']) {
                feeObj['_countName'] = fee['repaysName'] || '未知';
                //let feeCount = fee['fee'] ? (fee.fee - fee.oldFee) : 0;//补偿金额取差额时
                let feeCount = fee['repaysFee'] ? Number(fee.repaysFee) : 0;//补偿金额取补偿金额时
                feeObj[fee['repaysName']] = feeCount;
            }
            //费用名称对应总额
            if (fee['name']) {
                //let feeCount = fee['fee'] ? (fee.fee - fee.oldFee) : 0;//补偿金额取差额时
                let feeCount = fee['repaysFee'] ? Number(fee.repaysFee) : 0;//补偿金额取补偿金额时
                // feeObj['_feename'] = fee['name'] || 'feename_未知';
                //对应补偿对象总额（总金额）
                feeObj['feename_repayCount'] = totalAssumeFee;
                //费用名称差额
                feeObj['feename_' + fee['name']] = feeCount;
            }
            //合并责任方和补偿对象数据为一个对象
            Object.assign(feeObj, bearSumObj);
            tempArr.push(feeObj);
        }
        //计算所有的责任方补偿对象对应的同金额（合并）
        let totalSumObj = sumObj(tempArr, 1);
        /**
         * //合并相同责任方数据
         * @param arr
         * @returns {{}}
         */
        function sumObj(arr, flag?: any) {
            //计算总和
            let sumObj = {};
            let countName = 'undefined';
            for (let item of arr) {
                //先了解计算的是什么,flag=1则计算责任方
                if (flag === 1) {
                    let keys = _.keys(item);
                    keys.forEach((k) => {
                        let value = item[k];
                        if (sumObj[k]) {
                            sumObj[k] += value
                        } else {
                            sumObj[k] = value
                        }
                    });

                } else if (flag === 0) {//flag=1则计算补偿对象
                    countName = item['_countName'];
                    let value = Number(item[countName]) || 0;
                    if (sumObj[countName]) {
                        sumObj[countName] += value
                    } else {
                        sumObj[countName] = value
                    }
                }
            }
            return sumObj;
        }

        // //console.log('totalSumObj=',totalSumObj);
        let dutyData = [];//责任方数组
        let repayData = [];//补偿对象数组
        let feeNameData = [];//费用名称数组
        _.forOwn(totalSumObj, function (value, key) {
            let obj = {
                'value': value
            };
            if (key.startsWith('duty_')) {//责任方
                let name = key.replace('duty_', '');
                obj['name'] = name;
                dutyData.push(obj);
            } else if (key.startsWith('feename_')) {//费用名称
                let name = key.replace('feename_', '');
                obj[name] = obj['value'];
                feeNameData.push(obj);
            } else if (key != 'undefined' && key != '_countName') {//补偿对象
                obj['name'] = key;
                repayData.push(obj);
            }
        });
        this.dutyData = dutyData || [];
        this.repayData = repayData;
        //费用名称
        this.feeNameData = feeNameData;
        // //console.log('=======feeNameData====')
        // console.info(totalSumObj)
        // //console.log(feeNameData)

        //显示隐藏师傅输入框
        this.showOrHideMaster();
    }

    /**
     * 验证费用名称的承担金额总额必须等于差额
     * fix bug:https://pm.1ziton.com/issues/2965
     * 提示’承担金额总和必须等于差额‘
     * @returns {boolean}
     */
    validFeeNameAmount() {
        //总承担金额
        let totalRepayArr = _.map(this.feeNameData, 'repayCount');
        let totalFeeNameArr = _.map(_.map(this.feeNameData, 'value'), i => {return Math.abs(i)});
        let totalRepay = _.sum(totalRepayArr);
        let totalFee = _.sum(totalFeeNameArr);
        //console.log(this.feeNameData, 'this.feeNameData');
        //console.log(totalRepayArr, totalFeeNameArr, 'totalFeeNameArr');
        //console.log(totalFee, totalRepay, totalFee / totalRepay);
        if (totalFee / totalRepay !== 2) {
            return false;
        }
        return true;
    }

    /**
     *
     */
    onFeeTotalChange() {
        this.packageNumTotal = 0;
        this.installNumTotal = 0;
        this.weightTotal = 0;
        this.volumeTotal = 0;
        this.installChargeTotal = 0;
        this.upstairsChargeTotal = 0;
        for (let i = 0; i < this.otherResult.goodsDetail.length; i++) {
            this.packageNumTotal += this.otherResult.goodsDetail[i].packageNumber;
            this.installNumTotal += this.otherResult.goodsDetail[i].installNumber;
            this.weightTotal += this.otherResult.goodsDetail[i].weight;
            this.volumeTotal += this.otherResult.goodsDetail[i].volume;
            this.installChargeTotal += this.otherResult.goodsDetail[i].installCharge;
            this.upstairsChargeTotal += this.otherResult.goodsDetail[i].upstairsCharge;
        }
        for(let i = 0; i < this.otherResult.feeHandle.length; i++){
            if(this.otherResult.feeHandle[i].name == 'InstallChareg'){
                this.otherResult.feeHandle[i].fee = this.installChargeTotal;
            }
            if(this.otherResult.feeHandle[i].name == 'UpstairsCharge'){
                this.otherResult.feeHandle[i].fee = this.upstairsChargeTotal;
            }
        }




    }


    /**
     * 责任方相同回显异常信息处理方法
     * @returns {string}
     */
    dutyNameDeal(): any {
        let downDutyArr: any[] = [];
        let str: string = '';
        let abnormalDutyNameArr: any[] = [];
        let objTemp: any = {};
        let arrTemp: any[] = [];

        for (let m = 0; m < this.otherResult.feeHandle.length; ++m) {
            for (let i = 0; i < this.otherResult.feeHandle[m].bearFeeArr.length; ++i) {
                switch (this.otherResult.feeHandle[m].bearFeeArr[i].dutysId) {
                    case 'serviceProvider':
                        str = '服务商';
                        break;
                    case '1ziton':
                        str = '一智通';
                        break;
                    case 'business':
                        str = '商家';
                        break;
                    case 'Operator':
                        str = '承运商';
                        break;
                }
                downDutyArr.push(str);
            }

        }
        for (let element of this.otherResult.dutySide) {
            if (!element.label) {
                continue;
            }
            abnormalDutyNameArr.push(element.label);
        }
        abnormalDutyNameArr = abnormalDutyNameArr.concat(downDutyArr);

        // 名字去重
        for (let i = 0; i < abnormalDutyNameArr.length; ++i) {
            if (!objTemp[abnormalDutyNameArr[i]]) {
                arrTemp.push(abnormalDutyNameArr[i]);
                objTemp[abnormalDutyNameArr[i]] = 1;
            }
        }

        // let dutyName: string = arrTemp.join(',');
        // dutyName = dutyName.charAt(dutyName.length - 1) === ',' ? dutyName.substr(0, dutyName.length - 1) : dutyName;


        return arrTemp;
    }

    /**
     *
     * 费用处理限制承担金额
     * @param obj
     * @param b
     */
    clear(obj,b) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
        this.otherResult.feeHandle[b].bearFeeArr.assumeFee = obj.value;//双向绑定数据等于表格显示的数据
    }

    //承担金额的输入限制
    swapPositive(event,i,b){
        if(event){
            event=event.toString().replace(/\-/g,'');
        }
        this.otherResult.feeHandle[i].bearFeeArr[b].assumeFee = event;
    }

    //师傅姓名输入框的显示隐藏
    showOrHideMaster(){
        let dataArr = [];
        dataArr = this.dutyData.concat(this.repayData);
        let newArr = _.map(dataArr,"name");
        if(newArr.includes("服务商")){
            this.showMasterSelectBox = true;
        }else{
            this.showMasterSelectBox = false;
        }
    }

    /**
     * 商品明细带入信息
     */
    cloneTake(){
        for(let i = 0;i<this.otherResult.goodsDetail.length;i++){
            this.otherResult.goodsDetail[i].name = this.otherResult.goodsDetail[i].oldName;
            this.otherResult.goodsDetail[i].packageNumber = this.otherResult.goodsDetail[i].oldPackageNumber;
            this.otherResult.goodsDetail[i].installNumber = this.otherResult.goodsDetail[i].oldInstallNumber;
            this.otherResult.goodsDetail[i].weight = this.otherResult.goodsDetail[i].oldweight;
            this.otherResult.goodsDetail[i].volume = this.otherResult.goodsDetail[i].oldVolume;
            this.otherResult.goodsDetail[i].installCharge = this.otherResult.goodsDetail[i].installChargeOld;
            this.otherResult.goodsDetail[i].upstairsCharge = this.otherResult.goodsDetail[i].upstairsChargeOld;
        }
    }
    chanCurIndex(index: number) {
        this.curIndex = index;
    }

    /**
     * 获取地址组件level
     * @param e
     */
    getLevel(e){
        this.level = e.level;
    }
}
