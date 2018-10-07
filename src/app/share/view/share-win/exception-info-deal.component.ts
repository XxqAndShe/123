/**
 * Created by hua on 2017-02-22.
 */
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { animationScale } from "../../../modules/sale-center/page/exception-handle/share/dialog.animation";
import { DragBoxService } from "../../app-service/drag-box.service";
import { API } from "../../lib/api/api";
import { WaybillAbnormalRequestVo } from "../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import { ConfirmationService } from "primeng/components/common/api";
import { RequestTokenService } from "../../app-service/request-token.service";

@Component({
    selector: 'exception-info-deal',
    templateUrl: './exception-info-deal.component.html',
    styleUrls: ['./exception-info-deal.component.css'],
    animations: [animationScale]
})
export class ExceptionInfoDealComponent implements OnInit, AfterViewInit {

    public exceptionOption: boolean[] = [true, false, false];//异常信息弹框选项
    public customerInfoState: boolean = false;//客户资料是否显示
    public stepState: boolean = false;//步骤详细
    msgs: any;
    otherMaster;

    latestFollow: any[] = [];
    historyFollow: any[] = [];
    abnormalPics: any[] = [];

    @Input() boxState: string = 'hide';
    @Output() close = new EventEmitter<string>();
    @Output() save = new EventEmitter<string>();
    @Input() selectionAbnormal: any;
    @Output() showWaybillDetail = new EventEmitter<boolean>();
    abnormal: any = {};
    customerName: any;//客户名称
    customerMobile: any;//客户电话
    netSetCompanyName: any;//网店名称
    clientType: any;//客户类型
    discount: any;//折扣
    settlementMode: any;//结算模式
    address: any;//所属区域(返货收货地址)
    businesser: any;//业务员
    service: any;//个性化服务
    remark: any;//备注
    telphoto: any;//联系人电话
    responArea: any;//责任范围
    result: any;
    compareAbnormalHandler: any;

    /**
     * 用于使进行过相应处理的按钮变成蓝色
     * @type {boolean}
     */
    repaired: boolean = false;
    supplied: boolean = false;
    returned: boolean = false;
    othered: boolean = false;
    vetoed: boolean = false;

    showRepairWin: boolean = false;//维修
    showSupplyWin: boolean = false;//补件
    showReturnWin: boolean = false;//返货
    showOtherWin: boolean = false;//其他
    showVetoWin: boolean = false;//否决
    //控制对话框是否置顶
    zIndex: number = 10000;
    showOtherWinIndex: number;
    showRepairWinIndex: number;
    showSupplyWinIndex: number;
    showReturnWinIndex: number;
    showVetoWinIndex: number;
    isSeeImg: boolean = false;

    aBnormalGuide = {
        text: '',
        handleWay: '',
        feeStandard: '',
        abnormalDuty: ''
    };

    constructor(public drag: DragBoxService,
        public api: API,
        public confirmationService: ConfirmationService,
        public requestTokenService: RequestTokenService) {
    }

    showInfo(who?) {
        if (who) {
            this.customerInfoState = this.customerInfoState ? false : true;
        }
        else {
            this.stepState = this.stepState ? false : true;
        }
    }

    /*选择异常信息弹框头部选项*/
    selectExceptionOption(index) {
        for (let i = 0, len = this.exceptionOption.length; i < len; i++) {
            if (this.exceptionOption[i]) {
                this.exceptionOption[i] = false;
                break;
            }
        }
        this.exceptionOption[index] = true;
    }

    closeBox() {
        this.close.emit('exception-handle');
        sessionStorage.removeItem('vPickUpReq');
    }

    ngOnInit() {
        if (!window.localStorage) {
            alert("浏览器版本太低，请升级浏览器");
            this.close.emit('exception-handle');
        }
        sessionStorage.removeItem('vPickUpReq');//避免获取上次填写的数据
        /*this.latestFollow = [];
         this.historyFollow = [];*/
        // localStorage.getItem(this.selectionAbnormal.id);
        if (localStorage.getItem(this.selectionAbnormal.id)) {
            // //console.log("obj");
            this.exceptionObj = JSON.parse(localStorage.getItem(this.selectionAbnormal.id));
            this.abnormal = this.exceptionObj.abnormal;
            if(this.exceptionObj.repairData.LStorageHandleWay){
                this.saveDialog(null, this.exceptionObj.repairData.LStorageHandleWay);
            }
            if(this.exceptionObj.supplyData.LStorageHandleWay){
                this.saveDialog(null, this.exceptionObj.supplyData.LStorageHandleWay);
            }
            if(this.exceptionObj.returnData.LStorageHandleWay){
                this.saveDialog(null, this.exceptionObj.returnData.LStorageHandleWay);
            }
            if(this.exceptionObj.otherData.LStorageHandleWay){
                this.saveDialog(null, this.exceptionObj.otherData.LStorageHandleWay);
            }
            if(this.exceptionObj.vetoData.LStorageHandleWay){
                this.saveDialog(null, this.exceptionObj.vetoData.LStorageHandleWay);
            }
        }
        else {
            // //console.log("abn");
            Object.assign(this.abnormal, this.selectionAbnormal);
            this.exceptionObj.abnormal = this.abnormal;
        }


        this.api.call("AbnormalController.determineAbnormalHandler", {
            abnormalId: this.selectionAbnormal.id
        }).ok(json => {
            this.compareAbnormalHandler = json.result.compareAbnormalHandler;
        }).fail(err => {
            //console.log(err);
        });

        this.api.call("AbnormalController.findAbnormalPic", {
            abnormalId: this.selectionAbnormal.id,
            waybillId: this.selectionAbnormal.waybillId
        }).ok(json => {
            let result: any = json.result || [];
            result.forEach((abnormalPic) => {
                this.abnormalPics.push({
                    picUrlPath: abnormalPic["picUrlPath"]
                });
            });
        }).fail(err => {
            //console.log(err);
        });

        // this.api.call("AbnormalGuideController.abnormalGuideFind", {"first": 0, "rows": 100}, {
        //     abnormalTypeBId: this.selectionAbnormal.waybillId
        // }).ok(json => {
        //     ////console.log(this.selectionAbnormal.waybillId);
        //     ////console.log(json.result);
        //     this.result = json.result || [];
        //
        //     this.customerName = this.result.customerName;
        //     this.customerMobile = this.result.customerMobile;
        //     this.netSetCompanyName = this.result.netSetCompanyName;
        //     this.clientType = this.result.clientType;
        //     this.address = this.result.address;
        //     this.remark = this.result.remark;
        //     this.telphoto = this.result.telphoto;
        //
        // }).fail(err => {
        //
        // });

        Object.assign(this.abnormal, this.selectionAbnormal);

        //this.selectionAbnormal.handleWay = '';
        // this.selectionAbnormal.abnormalDutyName = '';
        this.selectionAbnormal.worker = '';

        this.api.call("CustomerController.findCustomerInfo", {
            waybillId: this.selectionAbnormal.waybillId
        }).ok(json => {
            ////console.log(this.selectionAbnormal.waybillId);
            ////console.log(json.result);
            this.result = json.result || [];

            this.customerName = this.result.customerName;
            this.customerMobile = this.result.customerMobile;
            this.netSetCompanyName = this.result.netSetCompanyName;
            this.clientType = this.result.clientType;
            this.address = this.result.address;
            this.remark = this.result.remark;
            this.telphoto = this.result.telphoto;

        }).fail(err => {

        });

        this.history();
        this.getGZImg();

        this.api.call("AbnormalGuideController.findAbnormalGuideOne", {
            abnormalId: this.selectionAbnormal.id
        }).ok(json => {
            this.result = json.result || [];
            this.aBnormalGuide.text = this.result.text;
            this.aBnormalGuide.handleWay = this.result.handleWay;
            this.aBnormalGuide.feeStandard = this.result.feeStandard;
            this.aBnormalGuide.abnormalDuty = this.result.abnormalDuty;
        }).fail(err => {
            //console.log(err);
        });

        this.api.call("UserWorkerController.findInstallMaster", {
            waybillId: this.selectionAbnormal.waybillId,
            abnormalNum: this.abnormal.abnormalNum
        }).ok(json => {
            let result: any = json.result && json.result[0] || (json.result || {});
            this.abnormal.worker = result.installMaster ? result.installMaster : "";
            this.abnormal.outName = result.waybillOutGoingName ? result.waybillOutGoingName : "";
            this.exceptionObj.abnormal.worker = this.abnormal.worker;
            this.otherMaster = result.otherMaster;
        }).fail(err => {
            //console.log(err);
        });

        let box = document.getElementById('exception_box');
        let moveArea = document.getElementById("exception_move");
        this.drag.dragEle(moveArea, box);
        this.requestTokenService.createToken();
        this. getDutyLabels();
        this.getHandleWays();
        /**
         * 取出保存的承担金额
         */
        let localObj = localStorage.getItem(this.selectionAbnormal.id) ? JSON.parse(localStorage.getItem(this.selectionAbnormal.id)) : {};
        let localAssumeFee = localObj.abnormal ? localObj.abnormal.assumeFee : 0;
        this.exceptionObj.abnormal.assumeFee = localAssumeFee;
    }

    ngAfterViewInit(): void {
        this.initFancybox();
    }

    showDialog(who: string) {
        this.zIndex++;
        switch (who) {
            case "other":
                this.showOtherWin = true;
                this.showOtherWinIndex = this.zIndex;
                break;
            case "repair":
                this.showRepairWin = true;
                this.showRepairWinIndex = this.zIndex;
                break;
            case "supply":
                this.showSupplyWin = true;
                this.showSupplyWinIndex = this.zIndex;;
                break;
            case "return":
                this.showReturnWin = true;
                this.showReturnWinIndex = this.zIndex;;
                break;
            case "veto":
                this.showVetoWin = true;
                this.showVetoWinIndex = this.zIndex;;
                break;
        }
    }

    saveDialog(option: any, who) {
        this.closeDialog(who);
        switch (who) {
            case 'other':
                this.othered = true;
                break;
            case 'repair':
                this.repaired = true;
                break;
            case 'supply':
                this.supplied = true;
                break;
            case 'return':
                this.returned = true;
                break;
            case 'veto':
                this.vetoed = true;
                break;
        }
        /*let repairFee = sessionStorage.getItem("repairData") ? JSON.parse(sessionStorage.getItem("repairData")).shipperFee : 0;
        let supplyFee = sessionStorage.getItem("supplyData") ? JSON.parse(sessionStorage.getItem("supplyData")).assumeFee : 0;
        let returnFee = sessionStorage.getItem("returnData") ? JSON.parse(sessionStorage.getItem("returnData")).carrier.assumeFee + JSON.parse(sessionStorage.getItem("returnData")).servicer.assumeFee : 0;
        this.selectionAbnormal.assumeFee = Number(repairFee) + Number(supplyFee) + Number(returnFee);*/
    }

    closeDialog(who) {
        switch (who) {
            case 'other':
                this.showOtherWin = false;
                break;
            case 'repair':
                this.showRepairWin = false;
                break;
            case 'supply':
                this.showSupplyWin = false;
                break;
            case 'return':
                this.showReturnWin = false;
                break;
            case 'veto':
                this.showVetoWin = false;
                break;
        }

        this. getDutyLabels();
    }

    getDutyLabels() {
        let dutyLabels: string[] = [];

        if(this.exceptionObj.repairData.dutyLabel && _.indexOf(dutyLabels, this.exceptionObj.repairData.dutyLabel) == -1){
            dutyLabels.push(this.exceptionObj.repairData.dutyLabel);
        }
        if(this.exceptionObj.supplyData.dutyLabel && _.indexOf(dutyLabels, this.exceptionObj.supplyData.dutyLabel) == -1){
            dutyLabels.push(this.exceptionObj.supplyData.dutyLabel);
        }
        if(this.exceptionObj.returnData.dutyLabel && _.indexOf(dutyLabels, this.exceptionObj.returnData.dutyLabel) == -1){
            dutyLabels.push(this.exceptionObj.returnData.dutyLabel);
        }
        // if(this.exceptionObj.otherData.dutySide && this.exceptionObj.otherData.dutySide.length>0){
        //     this.exceptionObj.otherData.dutySide.forEach(element => {
        //         //console.log(element, 999);
        //         if(_.indexOf(dutyLabels, element.label) == -1){
        //             dutyLabels.push(element.label);
        //         }
        //     });
        // }
        if(this.exceptionObj.otherData.dutyName){
            this.exceptionObj.otherData.dutyName.forEach(name => {
                name = name.charAt(name.length - 1) === ',' ? name.substr(0, name.length - 1) : name;
                if(_.indexOf(dutyLabels, name) == -1){
                    dutyLabels.push(name);
                }
            })
        }
        this.exceptionObj.abnormal.abnormalDutyName=dutyLabels.join(',');

    }

    /**
     * 取处理方式
     */
    getHandleWays() {
        let handleWays: string[] = [];

        if(this.exceptionObj.repairData.LStorageHandleWay && _.indexOf(handleWays, this.exceptionObj.repairData.LStorageHandleWay) == -1){
            handleWays.push("维修");
        }
        if(this.exceptionObj.supplyData.LStorageHandleWay && _.indexOf(handleWays, this.exceptionObj.supplyData.LStorageHandleWay) == -1){
            handleWays.push("补件");
        }
        if(this.exceptionObj.returnData.LStorageHandleWay && _.indexOf(handleWays, this.exceptionObj.returnData.LStorageHandleWay) == -1){
            handleWays.push("返货");
        }
        if(this.exceptionObj.otherData.LStorageHandleWay && _.indexOf(handleWays, this.exceptionObj.otherData.LStorageHandleWay) == -1){
            handleWays.push("其他");
        }
        this.exceptionObj.abnormal.handleWay=handleWays.join(',');
    }

    /*    //跟进信息模拟数据
     latestFollow=[
     {followContent: '跟进内容',follower: '李涛',followTime:'2017-04-13 12:12'}
     ];
     historyFollow=[
     {followContent: '跟进内容',follower: '李涛',followTime:'2017-04-13 12:12'}
     ];*/

    exceptionMove: '';//异常移交
    followMsg: '';//跟踪信息
    exceptionPic: any[];//图片
    //整个异常处理的大对象，包含五个小弹窗的小对象
    exceptionObj: any = {
        abnormal: new WaybillAbnormalRequestVo(),
        repairData: {},
        supplyData: {},
        returnData: {},
        otherData: {},
        vetoData: {},
        text: "",
        pics: []
    };

    //保存的方法，取出sessionStorage里五个弹窗的小对象并存到exceptionObj里
    /*setStorage(): any {
        /!*        let storage = window.sessionStorage;
         for (let i = 0; i < storage.length; i++) {
         switch (storage.key(i)) {
         case 'repairData':
         this.exceptionObj.repairData = JSON.parse(storage.getItem(storage.key(i)));
         break;
         case 'supplyData':
         this.exceptionObj.supplyData = JSON.parse(storage.getItem(storage.key(i)));
         break;
         case 'returnData':
         this.exceptionObj.returnData = JSON.parse(storage.getItem(storage.key(i)));
         break;
         case 'otherData':
         this.exceptionObj.otherData = JSON.parse(storage.getItem(storage.key(i)));
         break;
         case 'vetoData':
         this.exceptionObj.vetoData = JSON.parse(storage.getItem(storage.key(i)));
         break;
         }
         }
         sessionStorage.setItem("exceptionData", JSON.stringify(this.exceptionObj));*!/

        // //console.log(this.exceptionObj);
        localStorage.setItem(this.selectionAbnormal.id, JSON.stringify(this.exceptionObj));

        this.api.call("AbnormalController.addVAbnormalHandle", {
            abnormalId: this.selectionAbnormal.id,
            compareAbnormalHandler: this.compareAbnormalHandler,
            handlePerson: this.exceptionMove,
            text: this.followMsg,
            pics: this.exceptionPic
        }).ok(json => {
            // //console.log("addVAbnormalHandle1");
            // //console.log(this.selectionAbnormal.id);
            // //console.log(json.result);
            // //console.log("addVAbnormalHandle2");
            this.selectionAbnormal.abnoHandleStsName = "处理中";
            this.showSuccess("success", "提示", "保存成功!");
            let that = this;
            setTimeout(function () {
                that.save.emit();
            }, 500);
        }).fail(err => {
            //console.log(err);
            this.showSuccess("error", "提示", "保存失败!");
        });

        // this.close.emit('exception-handle');
    }*/

    history() {
        this.api.call("TrackController.findAbnormalTrackInfo", { "first": 0, "rows": 100 }, {
            abnormalId: this.abnormal.id,
        }).ok(json => {
            let count = 0;
            let result: any = json.result || [];
            result.forEach((follow) => {
                count++;
                if (count == 1) {
                    this.latestFollow.push({
                        followContent: follow["remark"],
                        follower: follow["operator"],
                        followTime: follow["trackedTime"]
                    });
                } else {
                    this.historyFollow.push({
                        followContent: follow["remark"],
                        follower: follow["operator"],
                        followTime: follow["trackedTime"]
                    });
                }
            });
        }).fail(err => {

        });
    }

    public GZImgs: any[] = [];

    getGZImg() {
        this.api.call("AbnormalController.findFileInfos", {
            abnormalId: this.abnormal.id,
        }).ok(json => {
            let result: any = json.result || [];

            // //console.log(result, 'picture');
            result.forEach(element => {
                this.GZImgs.push({
                    picUrlPath: element.picUrlPath,
                    picDate: element.picDate
                });
            });

        }).fail(err => {
            // alert(1);
        });
    }

    //完成的方法
    getStorage() {
        if(sessionStorage.getItem('vPickUpReq')){
            this.exceptionObj.vPickUpReq=JSON.parse(sessionStorage.getItem('vPickUpReq'));
        }else{
            this.exceptionObj.vPickUpReq={};
        }
        if (_.keys(this.exceptionObj.vetoData).length === 0 && _.keys(this.exceptionObj.otherData).length === 0 && _.keys(this.exceptionObj.returnData).length === 0 && _.keys(this.exceptionObj.supplyData).length === 0 && _.keys(this.exceptionObj.repairData).length === 0) {
            this.showSuccess("warn", "提示", "请选择处理方式！");
            return;
        }
        /*if(!this.followMsg && _.keys(this.exceptionObj.vetoData).length === 0
            && _.keys(this.exceptionObj.otherData).length === 0
            && _.keys(this.exceptionObj.returnData).length === 0
            && _.keys(this.exceptionObj.supplyData).length === 0
            && _.keys(this.exceptionObj.repairData).length === 0){
            this.showSuccess("warn", "提示", "请填写跟进信息！");
            return;
        }*/


        // this.api.call("AbnormalController.addVAbnormalHandle", {
        //     abnormalId: this.selectionAbnormal.id,
        //     compareAbnormalHandler: false,
        //     handlePerson: this.exceptionMove,
        //     text: this.followMsg,
        //     pics: this.exceptionPic
        // }).ok(json => {
        //     // //console.log("addVAbnormalHandle1");
        //     // //console.log(this.selectionAbnormal.id);
        //     // //console.log(json.result);
        //     // //console.log("addVAbnormalHandle2");
        //     //this.selectionAbnormal.abnoHandleStsName = "处理中";
        //     //this.showSuccess("success", "提示", "保存成功!");
        // }).fail(err => {
        //     //console.log(err);
        //     // this.showSuccess("error", "提示", "保存失败!");
        // });
        this.exceptionObj.text = this.followMsg;
        this.exceptionObj.pics = this.exceptionPic;
        // //console.log("abnormalHandle+++++++++++");
        // //console.log(this.exceptionObj);
        // //console.log("abnormalHandle-----------");
        // localStorage.setItem(this.selectionAbnormal.id, JSON.stringify(this.exceptionObj));
        // this.api.call("AbnormalController.abnormalHandle", JSON.parse(localStorage.getItem(this.selectionAbnormal.id))).ok(json => {
        this.api.call("AbnormalController.abnormalHandle", this.exceptionObj).ok(json => {
            this.showSuccess("success", "提示", "异常处理成功！");
            let that = this;
            localStorage.removeItem(this.selectionAbnormal.id);
            sessionStorage.removeItem('vPickUpReq');
            setTimeout(function () {
                that.save.emit();
            }, 500);
        }).fail(json => {
            this.showSuccess("error", "提示", "异常处理失败：" + json.error);
        })
    }

    onChangeHandler(event) {
        /*        //console.log(this.exceptionMove);
         //console.log(this.selectionAbnormal.handleWay);*/
        // if(this.selectionAbnormal.handleWay === ''){
        //     this.confirmationService.confirm({
        //         message: '异常已有处理结果，不允许移交异常！',
        //         header: '提示',
        //         accept: () => {
        //             return;
        //         }
        //     });
        //     //console.log("异常已有处理结果，不允许移交异常！");
        //     return;
        // }
        if (this.abnormal.handleWay != '' && typeof (this.abnormal.handleWay) != "undefined") {
            this.showSuccess("error", "提示", "异常已有处理结果，不允许移交异常！");
            return this.compareAbnormalHandler = false;
        }
        //this.showSuccess("error","提示","sbai");

        if (this.compareAbnormalHandler == false) {
            this.showSuccess("error", "提示", "当前用户不是该异常处理人，不允许移交异常!");
            return this.compareAbnormalHandler = false;
        }
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }

    seeImg() {
        this.isSeeImg = true;
    }

    closeImgWrap() {
        this.isSeeImg = false;
    }

    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'showCloseButton': false,
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                },
                'afterLoad': function(){
                    // 暂仅适合谷歌浏览器，TODO(兼容)
                    $('.fancybox-wrap').on('mousewheel', function (e: any) {

                        //console.log($('.fancybox-wrap'), '123');

                        let event = e || window.event;
                        let zoom = parseInt(this.style.zoom, 10) || 100;
                        zoom += event.originalEvent.wheelDelta / 12; //可适合修改
                        if (zoom > 0)
                            this.style.zoom = zoom + '%';
                    });
                }
            });

        });
    }



    /**
     * 是否点击订单号
     */
    waybillIdClick(): void{
        this.showWaybillDetail.emit(true);
    }
}
