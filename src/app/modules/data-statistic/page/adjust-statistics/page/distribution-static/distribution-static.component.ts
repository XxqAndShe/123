import {Component, OnInit} from "@angular/core";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {DistributionStaticDate} from "../../../../../../../mock/distribution-static-test";
import {API} from "../../../../../../share/lib/api/api";
import {dispatchStatisticRequestVo} from "../../vo/dispatch-statistics.vo";
//mport{getCurrentMonthFirst, getSevenDays} from "../../../../../../share/utils/DateUtil";

import {DatePipe} from "@angular/common";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {getCurrentMonthFirst} from "../../../../../../share/utils/DateUtil";
@Component({
  selector: 'app-distribution-static',
  templateUrl: './distribution-static.component.html',
  styleUrls: ['./distribution-static.component.css']
})
export class DistributionStaticComponent implements OnInit {

  //nav插件引用设置
  navs = ["分单统计", "分单趋势", "调度人员分配情况"];
  navHrefs = [
    '/modules/data-statistic/adjust-statistics/distribution-static',
    '/modules/data-statistic/adjust-statistics/distribution-trend',
    '/modules/data-statistic/adjust-statistics/dispatcher-condition'
  ];
  curIndex = 0;

  //日历插件
  zh: any = this.datePickerService.locale();
  inputStyle: any = { // 输入框样式
    // 'width': 95+'px',
    'height': 30 + 'px',
    'textAlign': 'left',
    'cursor': 'default'
  };
  yearRange: string = "2000:2020";

  selectionRow;// 选中的行
  columns: any[] = [];
  msgs:any;
  loading:any;
  //查询参数对象
  dispatchStatisticRequestVo: any = {};


  data: any;
  DistributionStaticDateTest = DistributionStaticDate;

  constructor(public api: ApiService,
              public datePickerService: DatepickerService,
              public datePipe:DatePipe) {
  }

  ngOnInit() {
    this.initColumns();
    this.dispatchStatisticRequestVo = new dispatchStatisticRequestVo();
    this.dispatchStatisticRequestVo.endDate = new Date();
    this.dispatchStatisticRequestVo.startDate = getCurrentMonthFirst();
 //   this.doSearch();
  }

  initColumns(): void {
    this.columns.push({
      field: 'matchType',
      header: '匹配类型',
      sortable: true,
      filter: true
    }, {
      field: 'matchCount',
      header: '匹配数量',
      sortable: true,
      filter: true
    }, {
      field: 'unReceiveCount',
      header: '不受理数量',
      sortable: true,
      filter: true
    }, {
      field: 'proportion',
      header: '占比',
      sortable: true,
      filter: true
    })
  }

  //提示弹框
  showSuccess(severity:string,summary:string,detail:string) {
    this.msgs = [{severity:severity, summary:summary, detail:detail}];
  }

  /**
   * 执行查询操作
   */
  public doSearch(): any {

      //克隆新对象
      let dispatchStatisticRequestVoClone=_.clone(this.dispatchStatisticRequestVo);
      //取出日期
      let startDate=dispatchStatisticRequestVoClone.startDate;
      let endDate=dispatchStatisticRequestVoClone.endDate;
      //转换日期格式
      dispatchStatisticRequestVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
      dispatchStatisticRequestVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');

    if(!startDate || !endDate){
        this.showSuccess("warn","提示","请输入查询时间");
      return;
    }
    this.loading = true;
    this.load({
      first: 0,
      rows: 10
    });
  }
  load(page) {
     //克隆新对象
      let dispatchStatisticRequestVoClone=_.clone(this.dispatchStatisticRequestVo);
      //取出日期
      let startDate=dispatchStatisticRequestVoClone.startDate;
      let endDate=dispatchStatisticRequestVoClone.endDate;
      //转换日期格式
      dispatchStatisticRequestVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
      dispatchStatisticRequestVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');

    this.api.report().call("DispatchCountController.distributionCount",page,{
     startDate:dispatchStatisticRequestVoClone.startDate,
     endDate:dispatchStatisticRequestVoClone.endDate
   }).ok(data => {
     this.loading = false;
      this.data = data.result || {};
      })
         .fail(data => {
             this.loading = false;
             if (data.code) {
                 this.showSuccess("error","提示",data.error);
             }else {
                 this.showSuccess("warn","提示","系统异常请联系管理员");
             }
         });
  }
}
