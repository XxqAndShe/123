///<reference path="../../../../../../share/utils/DateUtil.ts"/>
import {Component, OnInit} from "@angular/core";
/*日历*/
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {getCurrentMonthFirst, getSevenDays,getDate} from "../../../../../../share/utils/DateUtil";
import {BusRanking} from "../../vo/bus-ranking.vo";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './bus-ranking.component.html',
    styleUrls: ['./bus-ranking.component.css'],


})
export class BusRankingComponent implements OnInit{
    public BusRanking: BusRanking;
    // nav插件引用设置
    navs = ["商家排名","商家数量趋势","商家订单统计","商家账单支出趋势统计"];
    navHrefs = [
        'modules/data-statistic/bus-statistics/bus-ranking',
        'modules/data-statistic/bus-statistics/merchant-quantity',
        'modules/data-statistic/bus-statistics/bus-order',
        'modules/data-statistic/bus-statistics/expenditure-trends',
    ];
    curIndex = 0;

    chanCurIndex(index:number){
        this.curIndex=index;
    }

    isSelect = false;
    columns: any[] = [];
    data: any[] = [];
    selectionRow:any[] = [];
    loading:boolean;

    constructor(public datePickerService: DatepickerService,
                public api:ApiService,
                public datePipe:DatePipe){}

    ngOnInit():void{
        this.BusRanking = new BusRanking();
        //页面加载的时候就初始化日期
        this.BusRanking.endDate = new Date();
        this.BusRanking.startDate = getCurrentMonthFirst();
        this.initColumns();
        this.doSearch();
    }
    //日历插件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        // 'width': 95+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";
  msgs:any;

  //提示弹框
  showSuccess(severity:string,summary:string,detail:string) {
    this.msgs = [{severity:severity, summary:summary, detail:detail}];
  }

    /*查询*/
    doSearch():void{
        this.loading = true;
        if(this.BusRanking.startDate == "" || this.BusRanking.startDate == undefined || this.BusRanking.endDate == "" || this.BusRanking.endDate == undefined){
            this.showSuccess("warn","提示","时间段不能为空");
            return
        }
        //克隆新对象
        let BusRankingClone=_.clone(this.BusRanking);
        //取出日期
        let startDate=BusRankingClone.startDate;
        let endDate=BusRankingClone.endDate;

      if(!startDate || !endDate){
          this.showSuccess("warn","提示","请输入查询时间");
        return;
      }
      this.load({
          first: 0,
          rows: 10
      });
    }

    // 初始化列
    initColumns(): void {
        this.columns.push(
            {
            field: "numRank",
            header: "排名",
            sortable: true,
            filter: false
            },
            {
                field: "shipper",
                header: "商家",
                sortable: true,
                filter: false
            },
            {
                field: "orderCount",
                header: "订单数量",
                sortable: true,
                filter: false
            },   {
                field: "totalCost",
                header: "订单总价",
                sortable: true,
                filter: false
            }
        );
    }

    load(page):any{
         //克隆新对象
        let BusRankingClone=_.clone(this.BusRanking);
        //取出日期
        let startDate=BusRankingClone.startDate;
        let endDate=BusRankingClone.endDate;
        //转换日期格式
        BusRankingClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        BusRankingClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');
        startDate= getDate(BusRankingClone.startDate);
        endDate= getDate(BusRankingClone.endDate);

        this.api.core().call("BusinessmenContraller.findBusinessmenRanking",page,{
          startDate: startDate,
          endDate:endDate,
          shipperId:this.BusRanking.shipperCode
        }).ok(data=>{
            this.data = data.result;
           this.loading = false;
        }).fail(data=>{
            this.loading = false;
            if (data.code)
            {
                this.showSuccess("error","提示",data.error);
            }else {
                this.showSuccess("warn","提示","系统异常请联系管理员");
            }
        });
        }

}
