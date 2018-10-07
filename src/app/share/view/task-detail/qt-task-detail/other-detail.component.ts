import { Component, EventEmitter, Output, Input, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { API } from "../../../lib/api/api";
import { NodeVo } from "../../../../modules/sale-center/page/abnormal-sale/vo/nodeVo";
import { ShowOrHideMaskService } from "../../../app-service/show-or-hide-mask.service";
@Component({
  selector: 'other-task-detail',
  templateUrl: './other-detail.component.html',
  styleUrls: [
    './other-detail.component.css'
  ]
})

export class OtherTaskDetailComponent implements OnInit, AfterViewInit {
  @Input() selectedRowData;
  @Output() closeModal = new EventEmitter<any>();
  isoperationEnd: boolean = false;//终止订单
  msgs: any;
  // 切换标签
  public infoTypeActive: string;
  // 进度
  public items: MenuItem[];

  nodeVo: NodeVo = new NodeVo();

  otherResult: any = {
    waybillServiceTypeOld: '',
    waybillServiceType: '',
    consigneeOld: '',
    consignee: '',
    consigneeMobileOld: '',
    consigneeMobile: '',
    consigneeAddressOld: '',
    consigneeAddress: '',
    siteArrivalOld: '',
    siteArrival: '',
    distinationOld: '',
    distination: '',
    pickUpMobileOld: '',
    pickUpMobile: '',
    pickUpAdrOld: '',
    pickUpAdr: '',
    check: '',
    checkOld: '',
    verificationCodeOld: "",
    verificationCode: "",
    serviceTypeTmall: '',
    surceType: '',
    dutys: [],
    vTaskOtherWaybillGoodsList: [],
    vTaskOtherFeeDataList: [],
    chatRecord: [],
    claims: '',
    remark: ''
  }

  obj: any = {};
  dutyData: any[] = [];
  repayData: any[] = [];

  wayBill: any;
  columns1: any[] = [];
  dutyColumns: any[] = [];//责任方列表
  repayColumns: any[] = [];//补偿对象列表

  totalActiveIndex: number = 4; // 总进度

  //任务状态下面的时间数组
  timeArr: any[] = [];

  constructor(public api: API,
              public mask: ShowOrHideMaskService) {
  }

  ngOnInit() {
    let selectRow = this.selectedRowData && this.selectedRowData[0] || (this.selectedRowData || {});
    this.infoTypeActive = 'rwxx';
    this.items = [
      {
        label: '处理',
      },
      {
        label: '短信发送',
      },
      {
        label: '短信回复',
      },
      {
        label: '最终确认',
      }
    ];

    this.api.call("AbnormalElseHandleController.findAbnormalElseData", {
      abnormalNum: selectRow.abnormalNum,
    }).ok(json => {
      let result = json.result || {};
      Object.assign(this.otherResult, result);
      this.otherResult.checkOld = this.otherResult.checkOld ? '是' : '否';
      this.otherResult.checkNew = this.otherResult.check ? '是' : '否';
      this.obj = this.goodsSum(this.otherResult.vTaskOtherWaybillGoodsList);
      this.feeResultHandler();
    }).fail(err => {
      //console.log(err);
    });

    //生成顶部节点数据
    this.getDetailsInfo();
  }

  ngAfterViewInit(): void {
    this.initFancybox();
  }

  /**
   * 终止订单确认刷新*/
  doHideSave() {
    this.isoperationEnd = false;
    this.showSuccess("success", "提示", "操作成功！");
    this.selectedRowData.length = 0;
  }

  close() {
    this.closeModal.emit();
  }

  stopTask() {
    this.isoperationEnd = true;
  }

  hideWin(event) {
    if(event){
      this.showSuccess("warn","提示",event);
      return;
    }
    this.isoperationEnd = false;//终止订单
  }

  /*公共弹窗提示*/
  showSuccess(severity: string, summary: string, detail: string) {
    this.msgs = [{ severity: severity, summary: summary, detail: detail }];
  }

  /**
   * 顶部节点数据
   */
  getDetailsInfo() {
    let selectRow = this.selectedRowData && this.selectedRowData[0] || (this.selectedRowData || {});
    //console.log(selectRow);
    let taskId = selectRow['id'];
    if (!taskId) {
      throw new Error('taskId 不能为空');
    }
    let qryParams = {
      "taskID": taskId
    }

    this.api.call("TaskDetailContorller.findOtherTaskNode", qryParams).ok(json => {
      let result = json.result || {};
      console.info(result)
      if (result) {
        this.nodeVo = result;
        //节点进度
        //this.totalActiveIndex = result.nodeSort;
        //节点时间
        //this.timeArr = json.result.dataNode;
      }
    });
  }

  // 标签切换
  selectInfoPanel(type): void {
    this.infoTypeActive = type;
    switch (type) {
      case 'xqxx':

        break;
      case 'gjxx':
        //alert("gjxx");
        break;
      case 'ycxx':
        //alert("ycxx");
        break;
      case 'shxx':
        //alert("shxx");
        break;
      case 'gzxx':
        //alert("gzxx");
        break;
    }
  }

  zz

  goodsSum(arr: any[]) {
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
    for (let obj of arr) {
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
   * 图片大图预览
   */
  initFancybox() {
    $(function () {
      $("a[rel=fancybox]").fancybox({
        'titlePosition': 'over',
        'cyclic': true,
        'scrolling': 'yes',
        'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
          return '<span id="fancybox-title-over">' + (currentIndex + 1) +
            ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
        }
      });
    });
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
      let bearSumObj = sumObj(tempBear, 0);

      let totalFeeArr = _.values(bearSumObj);
      //不同责任方总金额
      let totalAssumeFee = _.sum(totalFeeArr);

      //补偿对象对应金额
      feeObj['_countName'] = repayFeeObj['repayName'] || '未知';
      feeObj[repayFeeObj['repayName']] = totalAssumeFee;

      //费用名称对应总额
      if (fee['name']) {
        let feeCount = fee['fee'] ? (fee.fee - fee.oldFee) : 0;
        // feeObj['_feename'] = fee['name'] || 'feename_未知';
        //对应补偿对象总额（承担总金额）
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
    this.dutyData = dutyData;
    this.repayData = repayData;
    //费用名称
    // this.feeNameData = feeNameData;
    //console.log('=======feeNameData====')
    console.info(this.dutyData, 'duty')
    //console.log(this.repayData, 'repay')
  }
}
