/**
 * Created by hua on 2017-02-22.
 */
import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from "@angular/core";
import {animationScale} from "../../../../modules/sale-center/page/exception-handle/share/dialog.animation";
import {DragBoxService} from "../../../app-service/drag-box.service";
import {API} from "../../../lib/api/api";
import {WaybillAbnormalRequestVo} from "../../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import {ConfirmationService} from "primeng/components/common/api";
import {RequestTokenService} from "../../../app-service/request-token.service";

@Component({
    selector:'readonly-exception-info',
    templateUrl:'./view-exception-info.component.html',
    styleUrls:['./view-exception-info.component.css'],
    animations:[animationScale]
})
export class ReadonlyExceptionInfoComponent implements OnInit, AfterViewInit{
    constructor(public drag: DragBoxService,
                public api: API,
                public confirmationService : ConfirmationService,
                public requestTokenService: RequestTokenService
    ) {
    }

    public exceptionOption: boolean[] = [true, false, false];//异常信息弹框选项
    public customerInfoState: boolean = false;//客户资料是否显示
    public stepState: boolean = false;//步骤详细
    msgs:any;
    @Input() abnormalSaleFlag : any;

    latestFollow: any[] = [];
    historyFollow: any[] = [];
    abnormalPics: any[] = [];

    assumeFeeSum : number = 0;
    otherMaster;

    @Input() boxState: string = 'hide';
    @Output() close = new EventEmitter<string>();
    @Output() save = new EventEmitter<string>();
    @Input() selectionRow: any;
    @Output() showWaybillDetail = new EventEmitter<boolean>();
    abnormal: any = {};
    vAbnormalObj: any = {};//用于接收仲裁处理表格传进来的数据中一个子对象
    abnormal_num : any;
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
    compareAbnormalHandler:any;
    exceptionMove: '';//异常移交
    followMsg: '';//跟踪信息
    responsibersArr : any[]=[];
    installMasterCollect : any[]=[];
    responsibers : string = "";
    taskReturnType : any;
    isSeeImg: boolean = false;

    public GZImgs: any[] = [];


    abnormalId;
    ycID: any;
    /**
     * 用于使进行过相应处理的按钮变成蓝色
     * @type {boolean}
     */
    repaired: boolean=false;
    supplied: boolean=false;
    returned: boolean=false;
    othered: boolean=false;
    vetoed: boolean=false;

    aBnormalGuide = {
        text: '',
        handleWay: '',
        feeStandard: '',
        abnormalDuty: ''
    };

    trackResult: any={
        trackPicPath: [],
        fileInfos: [],
    };

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
    }
    abnormalSource;
    ngOnInit() {
        this.selectionRow = this.selectionRow && this.selectionRow[0] || (this.selectionRow || {});
        Object.assign(this.vAbnormalObj, this.selectionRow.vAbnormal);

        /**
         * 把异常处理状态转成中文
         * @param abnormalSrc 英文异常处理状态
         * TODO 目前从返回数据只知道一种状态，其他状态还需添加判断
         */
        let abnormalSrc=this.vAbnormalObj.abnoHandleSts;
        if(abnormalSrc === 'hashandle'){
            this.abnormalSource = '已处理';
        }
        Object.assign(this.abnormal, this.selectionRow);
        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("AbnormalController.determineAbnormalHandler",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
            }).ok(json => {
                this.compareAbnormalHandler = json.result.compareAbnormalHandler;
                this.ycID = json.result.abnormalId;
            }).fail(err => {

            });
        }else{
            this.api.call("AbnormalController.determineAbnormalHandler",{
                abnormalId: this.selectionRow.id
            }).ok(json => {
                this.compareAbnormalHandler = json.result.compareAbnormalHandler;
                this.ycID = json.result.abnormalId;
            }).fail(err => {

            });
        }


        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("AbnormalHandleController.findAbnormalHandle",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
            }).ok(json => {
                this.result = json.result || {};
                this.exceptionMove = this.result.handlePerson;
                this.followMsg = this.result.text;
                JSON.stringify(this.result.abnormalPicPath[0]) != "{}" ? this.trackResult.trackPicPath = this.result.abnormalPicPath : this.trackResult.trackPicPath = [];
                //图片id绑定
                this.trackResult.fileInfos=_.map(this.trackResult.trackPicPath,'id');
                // //console.log(JSON.stringify(this.result.abnormalPicPath[0]), 'mypicture');
            }).fail(err => {
                //console.log(err);
            });
        }else{
            this.api.call("AbnormalHandleController.findAbnormalHandle",{
                abnormalId : this.selectionRow.id
            }).ok(json => {
                this.result = json.result || {};
                this.exceptionMove = this.result.handlePerson;
                this.followMsg = this.result.text;
                JSON.stringify(this.result.abnormalPicPath[0]) != "{}" ? this.trackResult.trackPicPath = this.result.abnormalPicPath : this.trackResult.trackPicPath = [];
                //图片id绑定
                this.trackResult.fileInfos=_.map(this.trackResult.trackPicPath,'id');
                //console.log(JSON.stringify(this.result.abnormalPicPath[0]), 'mypicture');
            }).fail(err => {
                //console.log(err);
            });
        }


        // this.api.call("AbnormalGuideController.abnormalGuideFind",{"first": 0, "rows": 100},{
        //     abnormalTypeBId : this.selectionRow.waybillId
        // }).ok(json => {
        //     this.result = json.result || [];
        //     this.customerName = this.result.customerName;
        //     this.customerMobile = this.result.customerMobile;
        //     this.netSetCompanyName = this.result.netSetCompanyName;
        //     this.clientType = this.result.clientType;
        //     this.address = this.result.address;
        //     this.remark = this.result.remark;
        //     this.telphoto = this.result.telphoto;
        //
        // }).fail(err => {
        //     //console.log(err);
        // });
        Object.assign(this.abnormal, this.selectionRow);
        this.api.call("CustomerController.findCustomerInfo", {
            waybillId: this.selectionRow.waybillId || 0
        }).ok(json => {
            this.result = json.result && json.result[0] || (json.result || {});
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

        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("AbnormalGuideController.findAbnormalGuideOne",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
            }).ok(json => {
                this.result = json.result || [];
                this.aBnormalGuide.text = this.result.text;
                this.aBnormalGuide.handleWay = this.result.handleWay;
                this.aBnormalGuide.feeStandard = this.result.feeStandard;
                this.aBnormalGuide.abnormalDuty = this.result.abnormalDuty;
            }).fail(err => {
                //console.log(err);
            });
        } else{
            this.api.call("AbnormalGuideController.findAbnormalGuideOne",{
                abnormalId: this.selectionRow.id
            }).ok(json => {
                this.result = json.result || [];
                this.aBnormalGuide.text = this.result.text;
                this.aBnormalGuide.handleWay = this.result.handleWay;
                this.aBnormalGuide.feeStandard = this.result.feeStandard;
                this.aBnormalGuide.abnormalDuty = this.result.abnormalDuty;
            }).fail(err => {
                //console.log(err);
            });
        }

        if(this.abnormalSaleFlag === 'abnormalSale') {
            this.api.call("AbnormalController.findAbnormalPic", {
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag,
                waybillId: this.selectionRow.waybillId
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
        }else{
            this.api.call("AbnormalController.findAbnormalPic", {
                abnormalId: this.selectionRow.id,
                waybillId: this.selectionRow.waybillId
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
        }

        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("TaskRepairController.findTaskRepairData",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("TaskRepairController.findTaskRepairData",{
                abnormalId : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
            }).fail(err=>{
                //console.log(err);
            });
        }

        this.api.call("UserWorkerController.findInstallMaster", {
            waybillId: this.selectionRow.waybillId || 0,
            abnormalNum : this.selectionRow.abnormalNum || ''
        }).ok(json => {
            let result: any = json.result && json.result[0] || (json.result || {});
            this.abnormal.worker = result.installMaster?result.installMaster:"";
            this.abnormal.outName = result.waybillOutGoingName?result.waybillOutGoingName:"";
            this.abnormal.endCity = result.endCity;
            this.otherMaster = result.otherMaster;
        }).fail(err => {
            //console.log(err);
        });


        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("TaskAllController.findVTaskAllAbnormalInfo",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
                // //console.log("findVTaskAllAbnormalInfo1");
                // //console.log(result);
                // //console.log("findVTaskAllAbnormalInfo2");
                this.abnormal.handleWay = result.abnormalHandleName.join(",");
                this.responsibers = result.abnormalHandleDuty.join(",");
                this.assumeFeeSum = result.assumeFeeSum;
                this.heightLine(this.abnormal.handleWay);
                // if(this.abnormal.worker === ""){
                //     this.abnormal.worker = result.installMasterCollect.join(",");
                // }
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("TaskAllController.findVTaskAllAbnormalInfo",{
                abnormalId : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
                if(result.abnormalHandleName!==undefined){
                    this.abnormal.handleWay = result.abnormalHandleName.join(",");
                }
                if(result.abnormalHandleDuty!==undefined){
                    this.responsibers = result.abnormalHandleDuty.join(",");
                }
                if(result.assumeFeeSum!==undefined){
                    this.assumeFeeSum = result.assumeFeeSum;
                }
                // if(this.abnormal.worker === ""){
                //     this.abnormal.worker = result.installMasterCollect.join(",");
                // }
                this.heightLine(this.abnormal.handleWay);
            }).fail(err=>{
                //console.log(err);
            });
        }

        this.abnormal.endCity = this.selectionRow.endCity;

        let dialogArea = document.getElementById('exception_move');
        let dialogBox = document.getElementById('exception_box');
        this.drag.dragEle(dialogArea, dialogBox);
    }

    ngAfterViewInit(): void {
        this.initFancybox();
    }

    /**
     * 取当前数据的处理方式，让相应按钮高亮
     */
    heightLine(handleWay:any){
        // if(this.abnormal.handleWay || this.selectionRow.handleWay || this.vAbnormalObj.strHandleWay){
        if(handleWay){
            let str=handleWay;
            if(str.search(/维修/) > -1){
                this.repaired = true;
            }
            if(str.search(/返货/) > -1){
                this.returned = true;
            }
            if(str.search(/补件/) > -1){
                this.supplied = true;
            }
            if(str.search(/其他/) > -1){
                this.othered = true;
            }
            if(str.search(/否决/) > -1){
                this.vetoed = true;
            }
        }
    }

    getGZImg() {

        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("AbnormalController.findFileInfos", {
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
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
        }else{
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

    }

    /**
     * 更新责任方
     */
    updateResponsibers(result:any){
        if(this.taskReturnType == 'CARRIERS'){
            if(result.vTaskReturnCarriers.abnormalDuty){
                this.responsibersArr.push(result.vTaskReturnCarriers.abnormalDuty);
            }
            if(result.vTaskReturnCarriers.assumeFee){
                this.assumeFeeSum = Number(this.assumeFeeSum) + Number(result.vTaskReturnCarriers.assumeFee);
            }
        }else if(this.taskReturnType == 'SERVICE'){
            if(result.vTaskReturnService.abnormalDuty){
                this.responsibersArr.push(result.vTaskReturnService.abnormalDuty);
            }
            if(result.vTaskReturnService.assumeFee){
                this.assumeFeeSum = Number(this.assumeFeeSum) + Number(result.vTaskReturnService.assumeFee);
            }
        }
        this.responsibers = this.responsibersArr.join(',')
    }
    /**
     * 更新责任方-补货维修
     */
    updateResponsibers2(result:any){
        if(result.responsiber){
            this.responsibersArr.push(result.responsiber);
        }
        if(result.assumeFee){
            this.assumeFeeSum = Number(this.assumeFeeSum) + Number(result.assumeFee);
        }
        this.responsibers = this.responsibersArr.join(',')
    }

    showRepairWin: boolean = false;//维修
    showSupplyWin: boolean = false;//补件
    showReturnWin: boolean = false;//返货
    showOtherWin: boolean = false;//其他
    showVetoWin: boolean = false;//否决
    showDialog(who) {
        switch (who) {
            case "other":
                if(!this.othered){
                    return;
                }
                this.showOtherWin = true;
                break;
            case "repair":
                if(!this.repaired){
                    return;
                }
                this.showRepairWin = true;
                break;
            case "supply":
                if(!this.supplied){
                    return;
                }
                this.showSupplyWin = true;
                break;
            case "return":
                if(!this.returned){
                    return;
                }
                this.showReturnWin = true;
                break;
            case "veto":
                if(!this.vetoed){
                    return;
                }
                this.showVetoWin = true;
                break;
        }
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
    }
    history() {

        if(this.abnormalSaleFlag === 'abnormalSale'){
            this.api.call("TrackController.findAbnormalTrackInfo", {"first": 0, "rows": 100}, {
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.abnormalSaleFlag
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

        }else{
            this.api.call("TrackController.findAbnormalTrackInfo", {"first": 0, "rows": 100}, {
                abnormalId: this.abnormal.id
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

    }

    seeImg(){
        this.isSeeImg = true;
    }

    closeImgWrap(){
        this.isSeeImg = false;
    }

    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'showCloseButton': false,
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling':'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                },
                'afterLoad': function(){
                    // 暂仅适合谷歌浏览器，TODO(兼容，有需要在插件上扩展方法)
                    $('.fancybox-wrap').on('mousewheel', function (e: any) {
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
