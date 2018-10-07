import {Component, OnInit} from "@angular/core";
import {getLineOption} from "../../../../chart/merchant-line-chart-opt";
import {AreaService} from "../../../../../../share/app-service/area.service";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {dateToObject, getMonthDate, getSevenDays,getDate} from "../../../../../../share/utils/DateUtil";
import {AdjustStatistics} from "../../vo/adjust-statistics.vo";
import {getSingleLineSum} from "../../../../../../share/utils/ChartUtil";
import {DatePipe} from "@angular/common";
import {ApiService} from "../../../../../../share/app-service/api-service";

@Component({
    templateUrl: './distribution-trend.component.html',
    styleUrls: ['./distribution-trend.component.css']
})
export class DistributionTrendComponent implements OnInit {
    public AdjustStatistics: AdjustStatistics;
    //地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();
    //日期组件
    zh: any = this.datePickerService.locale();
// 图标数据
    abnormalLineChartOption: any;
    //nav插件引用设置
    navs = ["分单统计", "分单趋势", "调度人员分配情况"];
    navHrefs = [
        '/modules/data-statistic/adjust-statistics/distribution-static',
        '/modules/data-statistic/adjust-statistics/distribution-trend',
        '/modules/data-statistic/adjust-statistics/dispatcher-condition'
    ];
    curIndex = 1;
    //构造函数
    constructor(public datePickerService: DatepickerService,
                public areaService: AreaService,
                public datePipe: DatePipe,
                public  api: ApiService) {
    }

    data = [];
    msgs: any;
    tabledata: any [];
    loading:boolean;

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    ngOnInit() {

        //todo 测试数据赋值
        this.AdjustStatistics = new AdjustStatistics();
        this.AdjustStatistics.endDate = new Date();
        this.AdjustStatistics.startDate = getDate(this.datePipe.transform(getSevenDays(this.AdjustStatistics.endDate), 'yyyy-MM-dd 00:00:00'));
        this.doSearch();
    }

    /*查询*/
    doSearch(): void {

        this.loading = true;
        /*startDate  endDate  bussinessName statisticalMonth*/
        //克隆新对象
        let AdjustStatisticsClone = _.clone(this.AdjustStatistics);
        //取出日期
        let startDate = AdjustStatisticsClone.startDate;
        let endDate = AdjustStatisticsClone.endDate;
        //转换日期格式
        AdjustStatisticsClone.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd 00:00:00');
        AdjustStatisticsClone.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');
        //console.log(AdjustStatisticsClone);

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }

        let MonthDate = getMonthDate(startDate, endDate);
        this.api.report().call("DispatchCountController.distributionTrend", {
            dispatcher: this.AdjustStatistics.sellerCode,
            startDate: AdjustStatisticsClone.startDate,
            endDate: AdjustStatisticsClone.endDate
        }).ok(data => {
            this.tabledata = data.result || {};
            this.convertDataAndRender(MonthDate);
            this.loading = false;
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

    /**
     * 后端数据处理转换并渲染统计图表
     * @param monthDate 日期数组
     */
    convertDataAndRender(monthDate) {
        //将当期查询日期转换为 日期-值 对象
        let dateObject = dateToObject(monthDate);

        //测试数据，对接请删除(后端返回的数据)
        let backendData = this.tabledata;
        //   let backendData=[{"groupDay":"2017-04-22" , "clientCount":29145}];
        //获取后端数据
        for (let item of backendData) {
            let dateString = item['singleDate'].trim();
            dateObject[dateString] = item['distributionDayNum'];
        }
        //转成数组
        this.data = _.values(dateObject);

        //获取lineOption重绘制图表
        let opt = {title: '分单量趋势', legend: '分单量', xAxisData: monthDate, seriesData: this.data};
        this.abnormalLineChartOption = getLineOption(opt);

        //获取新增商家总数
        this.AdjustStatistics.DistributionSum = getSingleLineSum(this.data, monthDate.length);
    }

    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

}
