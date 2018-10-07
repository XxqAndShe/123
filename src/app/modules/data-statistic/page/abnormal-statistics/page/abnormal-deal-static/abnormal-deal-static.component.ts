import {Component, OnInit} from "@angular/core";
import {TableDataTest} from "../../../../../../../mock/table-data-test";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {AbnormalSingleTrendVo} from "../vo/abnormal-statistics.vo";
import {ConfirmDialogModule,ConfirmationService} from "primeng/primeng";
import {API} from "../../../../../../share/lib/api/api";
import {getCurrentMonthFirst, getDate, getSevenDays} from "../../../../../../share/utils/DateUtil";
import {DatePipe} from "@angular/common";
import {ApiService} from "../../../../../../share/app-service/api-service";
@Component({
  selector: 'app-abnormal-deal-static',
  templateUrl: './abnormal-deal-static.component.html',
  styleUrls: ['./abnormal-deal-static.component.css']
})
export class AbnormalDealStaticComponent implements OnInit {

  //nav插件引用设置
  navs = ["异常单量统计","异常单量趋势","异常处理统计"];
    loading:boolean;
  navHrefs = [
    'modules/data-statistic/abnormal-statistics/abnormal-quantity-static',
    'modules/data-statistic/abnormal-statistics/abnormal-quantity-trend',
    'modules/data-statistic/abnormal-statistics/abnormal-deal-static'
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

  tableData:any={};

  //默认分页信息
    defaultPage = {first: 0, rows: 10}
  total: any = 0;
    msgs:any;
  //查询参数对象
  public AbnormalSingleTrendVo: AbnormalSingleTrendVo;

  constructor(public datePickerService:DatepickerService,
  			 public api: API,
  			 public apiService: ApiService,
              public confirmationService:ConfirmationService,
              public datePipe:DatePipe) { }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

  ngOnInit() {
    this.tableData=TableDataTest;
    this.AbnormalSingleTrendVo = new AbnormalSingleTrendVo();
    this.AbnormalSingleTrendVo.endDate = new Date();
    this.AbnormalSingleTrendVo.startDate = getCurrentMonthFirst();
    this.load();
  }

  doSearch(page):void {
      this.loading = true;
      //克隆新对象
      let AbnormalSingleTrendVoClone=_.clone(this.AbnormalSingleTrendVo);
      //取出日期
      let startDate=AbnormalSingleTrendVoClone.startDate;
      let endDate=AbnormalSingleTrendVoClone.endDate;
      //转换日期格式
      this.AbnormalSingleTrendVo.startDate=getDate(this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00'));
      this.AbnormalSingleTrendVo.endDate=getDate(this.datePipe.transform(endDate,'yyyy-MM-dd 00:00:00'));
      console.log(this.AbnormalSingleTrendVo);

    ////console.log(startDate,endDate);
      if (!startDate || !endDate) {
          this.showSuccess("warn", "提示", "请输入查询时间");
          return
      }

    //调用后端接口
    this.load();
  }

     /**
     * 查询异常处理
     */
    getAbnormalHandle($event): void {
    	this. tableData = [];		//清空异常类型
    	//转换日期格式
	      this.AbnormalSingleTrendVo.startDate=getDate(this.datePipe.transform(this.AbnormalSingleTrendVo.startDate,'yyyy-MM-dd 00:00:00'));
	      this.AbnormalSingleTrendVo.endDate=getDate(this.datePipe.transform(this.AbnormalSingleTrendVo.endDate,'yyyy-MM-dd 00:00:00'));
	      console.log(this.AbnormalSingleTrendVo);
    	this.apiService.report().call('abnoHandleController.abnoHandle',$event,this.AbnormalSingleTrendVo)
	    .ok(json => {
	    	for (let i = 0; i < json.result.content.length; i++) {
            	json.result.content[i].timelyRate ? json.result.content[i].timelyRate += '%' : json.result.content[i].timelyRate = '0%';
            	json.result.content[i].timelyRateMonth ? json.result.content[i].timelyRateMonth += '%' : json.result.content[i].timelyRateMonth = '0%';
	        }
            this.tableData = json.result;
	    	this.loading = false;
        })
        .fail(json => {
            this.loading = false;
        });
    }
    getTotalNumber():void{
    	this.total = 0;
    	this.apiService.report().call('abnoHandleController.totalNumberGet',this.AbnormalSingleTrendVo)
	    .ok(json => {
            this.total = json.result.total;
            this.loading = false;
        })
        .fail(json => {
            this.loading = false;
        });
    }
    load($event?:any){
       $event=$event?$event:this.defaultPage;
       this.getAbnormalHandle($event);
       this.getTotalNumber();
    }
}
