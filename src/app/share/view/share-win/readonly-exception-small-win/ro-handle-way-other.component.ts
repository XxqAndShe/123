import {Component, OnInit, Output,Input, EventEmitter} from '@angular/core';
import {TaskOtherWaybillVo} from "../exception-handle-way-win/other-vo/taskotherwaybill.vo";
import {API} from "../../../lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";
import {OtherPickUpRespVo} from "./vo/other-pickUp.vo";
import {OtherPickOldRespVo} from "./vo/other-pick-old.vo";

@Component({
    selector: 'ro-handle-way-other',
    templateUrl: './ro-handle-way-other.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class RoHandleWayOtherComponent implements OnInit{

    @Output() closeWin = new EventEmitter();
    @Input() selectionRow: any;
    @Input() subAbnormalSaleFlag : any;
    @Input() installMaster;
    @Input() ycID;
    @Input() selectRow;
    showMasterBox: boolean = false;
    navs = ["产品信息修改", "收货人信息修改", "核销信息修改", "提货信息修改", "费用信息修改"];
    curIndex: number = 0;
    dutyColumns: any[] = [];//责任方列表
    repayColumns: any[] = [];//补偿对象列表

    abnormal: any = {};
    taskOtherWaybillVo: TaskOtherWaybillVo;
    data: any;
    dutyData: any[] = [];
    repayData: any[] = [];
    result : any;
    obj :any={};
    // otherResult:any={};
    otherResult: any={
        waybillServiceTypeOld:'',
        waybillServiceType:'',
        consigneeOld:'',
        consignee:'',
        consigneeMobileOld:'',
        consigneeMobile:'',
        consigneeAddressOld:'',
        consigneeAddress:'',
        siteArrivalOld:'',
        siteArrival:'',
        distinationOld:'',
        distination:'',
        reason:'',
        pickUpMobileOld:'',
        pickUpMobile:'',
        pickUpAdrOld:'',
        pickUpAdr:'',
        check:false,
        checkOld:true,
        verificationCodeOld:"",
        verificationCode:"",
        serviceTypeTmall:'',
        surceType:'',
        dutys:[],
        vTaskOtherWaybillGoodsList:[],
        vTaskOtherFeeDataList:[],
        chatRecord:[],
        claims : '',
        remark:''
    };
    otherPickUpRespVo = new OtherPickUpRespVo();
    otherPickOldRespVo = new OtherPickOldRespVo();

    constructor(public api:API,
                public drag: DragBoxService,){}

    ngOnInit(){
        let selectRow=this.selectionRow && this.selectionRow[0] || (this.selectionRow || {});
        this.taskOtherWaybillVo = new TaskOtherWaybillVo();
        // 兼容仲裁处理页面abnormalNumber
        let abnormalNumber = selectRow.abnormalNum ? selectRow.abnormalNum: selectRow.vAbnormal.abnormalNum;
        // //console.log(this.otherResult.vTaskOtherFeeDataList);
        this.api.call("AbnormalElseHandleController.findAbnormalElseData",{
            abnormalNum : abnormalNumber,
        }).ok(json=>{
            let result = json.result || {};
            Object.assign(this.otherResult,result);
            if(this.otherResult.checkOld === this.otherResult.check){
                this.otherResult.checkNew = '';
            }else if(this.otherResult.checkOld && (!this.otherResult.check && this.otherResult.check!==false)){
                this.otherResult.checkNew = '';
            }else if(!this.otherResult.checkOld && this.otherResult.check === ''){
                this.otherResult.checkNew = '';
            }else {
                this.otherResult.checkNew = this.otherResult.check? '是': '否';
            }
            this.otherResult.checkOld = this.otherResult.checkOld? '是': '否';
            //console.log(this.otherResult);
            this.obj = this.goodsSum(this.otherResult.vTaskOtherWaybillGoodsList);
            this.feeResultHandler();

        }).fail(err=>{
            //console.log(err);
        });
        let dialogArea = document.getElementById('move');
        let dialogBox = document.getElementById('box');
        this.drag.dragEle(dialogArea, dialogBox);

        //加载更改后提货码与物流单号
        this.api.call('taskInstallController.findPickUp',
            {'taskId': this.selectionRow.taskID || this.selectionRow.id}
        ).ok(data => {
            if(data.result){
                this.otherPickUpRespVo = data.result ? data.result : {};
            }
        }).fail(data => {});
        //加载原提货码与物流单号
        this.api.call('taskInstallController.findPickUpHis',
            {
                'ycID': this.ycID,
                'taskId': this.selectRow.taskID || this.selectRow.id
            }
        ).ok(data => {
            if(data.result){
                this.otherPickOldRespVo = data.result ? data.result : {};
            }
        }).fail(data => {})
    }


    close(){
        this.closeWin.emit();
    }

    /**
     * 计算货物总数
     * @param arr
     * @returns {{}}
     */
    goodsSum(arr: any[]){
        let objTemp = {};
        objTemp['installSumNumber'] = 0;
        objTemp['oldInstallSumNumber'] = 0;
        objTemp['packageSumNumber'] = 0;
        objTemp['oldPackageSumNumber'] = 0;
        objTemp['volumeSum'] = 0;
        objTemp['oldVolumeSum'] = 0;
        objTemp['weightSum'] = 0;
        objTemp['oldweightSum'] = 0;
        objTemp['upstairsChargeOldSum'] = 0;
        objTemp['upstairsChargeSum'] = 0;
        objTemp['installChargeOldSum'] = 0;
        objTemp['installChargeSum'] = 0;
        for(let obj of arr){
            objTemp['installSumNumber'] += obj.installNumber;
            objTemp['oldInstallSumNumber'] += obj.oldInstallNumber;
            objTemp['packageSumNumber'] += obj.packageNumber;
            objTemp['oldPackageSumNumber'] += obj.oldPackageNumber;
            objTemp['volumeSum'] += obj.volume;
            objTemp['oldVolumeSum'] += obj.oldVolume;
            objTemp['weightSum'] += obj.weight;
            objTemp['oldweightSum'] += obj.oldweight;
            objTemp['upstairsChargeOldSum'] += obj.upstairsChargeOld;
            objTemp['upstairsChargeSum'] += obj.upstairsCharge;
            objTemp['installChargeOldSum'] += obj.installChargeOld;
            objTemp['installChargeSum'] += obj.installCharge;
        }
        return objTemp;
    }

    /**
     * 动态计算责任方和补偿对象金额
     */
    feeResultHandler() {
        let feeRows = this.otherResult.vTaskOtherFeeDataList || [];
        let tempArr: any[] = [];
        for (let fee of feeRows) {
            let feeObj = {};
            let bearFeeArr = fee.vTaskOtherFeeDutyDataList;
            let repayFeeObj = fee.vTaskOtherFeeRepayData;
            let tempBear = [];
            //取出当前记录的所有责任方数据并计算总和
            for (let bear of bearFeeArr) {
                let obj = {};
                obj['_countName'] = 'duty_' + bear['dutyName'] || '未知';
                obj['duty_' + bear['dutyName']] = Number(bear['assumeFee']) || 0;

                tempBear.push(obj);
            }
            //console.log(tempBear, 'tempBear');
            //合并相同责任方数据
            let bearSumObj = sumObj(tempBear,0);

            let totalFeeArr = _.values(bearSumObj);
            //不同责任方总金额
            let totalAssumeFee = _.sum(totalFeeArr);

            //补偿对象对应金额
            feeObj['_countName'] = repayFeeObj['repayName'] || '未知';
            //let feeCount = fee['fee'] ? (fee.fee - fee.oldFee) : 0;//补偿金额取差额时
            let feeCount = repayFeeObj['repayFee'] ? repayFeeObj.repayFee : 0;//补偿金额取补偿金额时
            feeObj[repayFeeObj['repayName']] = feeCount;

            //费用名称对应总额
            if (fee['name']) {
                //let feeCount=fee['fee']?(fee.fee-fee.oldFee):0;//补偿金额取差额时
                let feeCount = repayFeeObj['repayFee'] ? repayFeeObj.repayFee : 0;//补偿金额取补偿金额时
                // feeObj['_feename'] = fee['name'] || 'feename_未知';
                //对应补偿对象总额（承担总金额）
                feeObj['feename_repayCount'] = totalAssumeFee;
                //费用名称差额
                feeObj['feename_'+fee['name']] = feeCount;
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
                if (flag===1) {
                    let keys = _.keys(item);
                    keys.forEach((k) => {
                        let value = item[k];
                        if (sumObj[k]) {
                            sumObj[k] += value
                        } else {
                            sumObj[k] = value
                        }
                    });

                } else if(flag===0){//flag=1则计算补偿对象
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
            } else if(key.startsWith('feename_')){//费用名称
                let name = key.replace('feename_', '');
                obj[name] = obj['value'];
                feeNameData.push(obj);
            }else if (key != 'undefined' && key != '_countName') {//补偿对象
                obj['name'] = key;
                repayData.push(obj);
            }
        });
        this.dutyData = dutyData;
        this.repayData = repayData;

        let dutyAndRepay = this.dutyData.concat(this.repayData);
        if(_.map(dutyAndRepay, "name").includes("服务商")){
            this.showMasterBox = true;
        }
        //费用名称
        // this.feeNameData = feeNameData;
        // //console.log('=======feeNameData====')
        // console.info(this.dutyData,'duty')
        // //console.log(this.repayData, 'repay')
    }
    chanCurIndex(index: number) {
        this.curIndex = index;
    }
}
