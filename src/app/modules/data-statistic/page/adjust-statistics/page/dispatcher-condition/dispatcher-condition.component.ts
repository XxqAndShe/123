import {Component, OnInit} from "@angular/core";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {TableDataTest} from "../../../../../../../mock/table-data-test";
import {AdjustStatistics} from "../../vo/adjust-statistics.vo";
import {getCurrentMonthFirst, getSevenDays} from "../../../../../../share/utils/DateUtil";
import {DatePipe} from "@angular/common";
import {ApiService} from "../../../../../../share/app-service/api-service";

@Component({
  templateUrl: './dispatcher-condition.component.html',
  styleUrls: ['./dispatcher-condition.component.css']
})
export class DispatcherConditionComponent implements OnInit {
    selectionRow:any;
    averageTodayNum:number = 0;//分配单量平均数
    averageDistribution:number = 0;//分配及时订单平均数
    averageTodayPromptness:any = 0;//分配及时率平均数
    averageCount:number = 0;//分配单量平均数
    averagePromptnessCount:number = 0;//分配及时订单平均数
    averagePromptness:any = 0;//分配及时率平均数
    loading:any;

  //nav插件引用设置
  navs = ["分单统计","分单趋势","调度人员分配情况"];
  navHrefs = [
    '/modules/data-statistic/adjust-statistics/distribution-static',
    '/modules/data-statistic/adjust-statistics/distribution-trend',
    '/modules/data-statistic/adjust-statistics/dispatcher-condition'
  ];
  curIndex = 2;

  //日历插件
  zh: any=this.datePickerService.locale();
  inputStyle: any={ // 输入框样式
    // 'width': 95+'px',
    'height': 30+'px',
    'textAlign': 'left',
    'cursor': 'default'
  };
  yearRange: string="2000:2020";

  tableData: any = {};
  msgs:any;
  //查询参数对象
  public AdjustStatistics: AdjustStatistics;

  constructor(public datePickerService:DatepickerService,
              public datePipe:DatePipe,
               public  api:ApiService) { }

  //提示弹框
  showSuccess(severity:string,summary:string,detail:string) {
    this.msgs = [{severity:severity, summary:summary, detail:detail}];
  }

  ngOnInit() {

    this.AdjustStatistics = new AdjustStatistics();
    this.AdjustStatistics.endDate = new Date();
    this.AdjustStatistics.startDate = getCurrentMonthFirst();
   // this.doSearch($event);


  }

  doSearch():void {

      //克隆新对象
      let AdjustStatisticsClone=_.clone(this.AdjustStatistics);
      //取出日期
      let startDate=AdjustStatisticsClone.startDate;
      let endDate=AdjustStatisticsClone.endDate;

    if(!startDate || !endDate){
        this.showSuccess("warn","提示","请输入查询时间");
      return;
    }
    this.loading = true;
   this.load({
       first: 0,
       rows: 10
   })
  }

  load(page){
     //克隆新对象
      let AdjustStatisticsClone=_.clone(this.AdjustStatistics);
      //取出日期
      let startDate=AdjustStatisticsClone.startDate;
      let endDate=AdjustStatisticsClone.endDate;
      //转换日期格式
      AdjustStatisticsClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
      AdjustStatisticsClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd HH:mm:ss')

    if(!startDate || !endDate){
        this.showSuccess("warn","提示","请输入查询时间");
      return;
    }
    this.api.report().call("DispatchCountController.distributionNum",page,
        {
          startDate:AdjustStatisticsClone.startDate,
          endDate:AdjustStatisticsClone.endDate
        }
    ).ok(data => {

      this.loading = false;
      this.tableData = data.result || {};
      this.average()//调用平均值

    }) .fail(data => {
        this.loading = false;
        if (data.code) {
            this.showSuccess("error","提示",data.error);
        }else {
            this.showSuccess("warn","提示","系统异常请联系管理员");
        }
    });
  }

    /**
     * 平均值计算
     * @param $event
     */
    average(){
        //调用前清零
        let TodayNum = 0;
        let Distribution = 0;
        let Count = 0;
        let PromptnessCount = 0;
        let averageTable = this.tableData.content;
        //循环取平均值
        for (let i = 0;i<averageTable.length;i++){
            TodayNum += averageTable[i].distributionTodayCount/averageTable.length;//分配单量平均数
            Distribution += averageTable[i].distributionPromptnessTodayCount/averageTable.length;//分配及时订单平均数
            Count += averageTable[i].distributionCount/averageTable.length;//分配单量平均数
            PromptnessCount += averageTable[i].distributionPromptnessCount/averageTable.length;//分配及时订单平均数
        }
        this.averageTodayNum = Math.round(TodayNum*100)/100;
        this.averageDistribution = Math.round(Distribution*100)/100;
        this.averageCount = Math.round(Count*100)/100;
        this.averagePromptnessCount = Math.round(PromptnessCount*100)/100;

        if (TodayNum == 0) {
            this.averageTodayPromptness = "0.00%"//分配及时率平均数
        } else {
            this.averageTodayPromptness = (Math.round((Distribution/TodayNum)*10000)/10000)//分配及时率平均数
            this.averageTodayPromptness = this.toPercent(this.averageTodayPromptness);
        }

        if (Count == 0) {
            this.averagePromptness = "0.00%";//分配及时率平均数
        } else {
            this.averagePromptness = (Math.round((PromptnessCount/Count)*10000)/10000);//分配及时率平均数
            this.averagePromptness = this.toPercent(this.averagePromptness);
        }


    }

    toPercent(data){
        var strData = parseFloat(data)*10000;
        strData = Math.round(strData);
        strData/=100.00;
        var flag=strData.toString().split(".");
        var result;
        if(flag.length==1){
            result = strData.toString()+".00%";
        }
        if(flag.length>1) {
            if (flag[1].length < 2) {
                result = strData.toString() + "0%";
            } else {
                result = strData.toString() + "%";
            }
        }
        return result;
    }

    onRowSelect($event){
        //克隆新对象
        let AdjustStatisticsClone=_.clone(this.AdjustStatistics);
        //取出日期
        let startDate=AdjustStatisticsClone.startDate;
        let endDate=AdjustStatisticsClone.endDate;
        //转换日期格式
        AdjustStatisticsClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        AdjustStatisticsClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd HH:mm:ss')

        if(!startDate || !endDate){
            this.showSuccess("warn","提示","请输入查询时间");
            return;
        }
        this.api.report().call("DispatchCountController.distributionNum",$event,
            {
                startDate:AdjustStatisticsClone.startDate,
                endDate:AdjustStatisticsClone.endDate
            }
        ).ok(data => {
            this.tableData = data.result || {};
        }) .fail(data => {
            if (data.code) {
                this.showSuccess("error","提示",data.error);
            }else {
                this.showSuccess("warn","提示","系统异常请联系管理员");
            }
        });

    }
}
