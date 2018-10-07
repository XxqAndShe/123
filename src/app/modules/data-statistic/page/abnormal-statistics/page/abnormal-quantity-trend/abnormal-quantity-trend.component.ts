import {Component, OnInit} from "@angular/core";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {getLineOption} from "app/modules/data-statistic/chart/merchant-line-chart-opt";
import {API} from "../../../../../../share/lib/api/api";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {dateToObject, getMonthDate, getSevenDays,getDate} from "../../../../../../share/utils/DateUtil";
import {ConfirmationService} from "primeng/primeng";
import {AbnormalSingleTrendVo} from "../vo/abnormal-statistics.vo";
import {getSingleLineSum} from "../../../../../../share/utils/ChartUtil";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './abnormal-quantity-trend.component.html',
    styleUrls: ['./abnormal-quantity-trend.component.css']
})
export class AbnormalQuantityTrendComponent implements OnInit {

    //nav插件引用设置
    navs = ["异常单量统计", "异常单量趋势", "异常处理统计"];
    loading:boolean;
    navHrefs = [
        'modules/data-statistic/abnormal-statistics/abnormal-quantity-static',
        'modules/data-statistic/abnormal-statistics/abnormal-quantity-trend',
        'modules/data-statistic/abnormal-statistics/abnormal-deal-static'
    ];
    curIndex = 1;
    //日历插件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    // 图标数据
    abnormalLineChartOption: any;

    //异常统计趋势VO
    abnormalSingleTrendVo: any = {};
    //总数
    total: number = 0;
    //每天总数
    date = [];
    msgs: any;

    constructor(public datePickerService: DatepickerService,
                public api: API,
                public apiService: ApiService,
                public confirmationService: ConfirmationService,
                public datePipe: DatePipe) {
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    ngOnInit() {
        this.abnormalSingleTrendVo = new AbnormalSingleTrendVo();
        // this.abnormalSingleTrendVo.endDate = new Date();
        // this.abnormalSingleTrendVo.startDate = getDate(this.datePipe.transform(getSevenDays(this.abnormalSingleTrendVo.endDate), 'yyyy-MM-dd 00:00:00'));
    }

    doSearch(): void {
        this.loading = true;
        /*startDate  endDate  bussinessName statisticalMonth*/
        //克隆新对象
        let abnormalSingleTrendVoClone = _.clone(this.abnormalSingleTrendVo);
        //取出日期
        let startDate = abnormalSingleTrendVoClone.startDate;
        let endDate = abnormalSingleTrendVoClone.endDate;
        //转换日期格式
        abnormalSingleTrendVoClone.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd 00:00:00');
        abnormalSingleTrendVoClone.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }


        let MonthDate = getMonthDate(startDate, endDate);

        this.convertDataAndRender(MonthDate);
        this.getAbnormalSingleTrend();

    }

    /**
     * 后端数据处理转换并渲染统计图表
     * @param monthDate 日期数组
     */
    convertDataAndRender(monthDate) {

        //将当期查询日期转换为 日期-值 对象
        let dateObject = dateToObject(monthDate);

        //测试数据，对接请删除(后端返回的数据)
        let backendData = [{"groupDay": "2017-04-21", "clientCount": 29145}];
        //获取后端数据
        for (let item of backendData) {
            let dateString = item['groupDay'].trim();
            dateObject[dateString] = item['clientCount'];
        }
        //转成数组
        let data = _.values(dateObject);

        //获取lineOption重绘制图表
        let opt = {title: '异常单量趋势', legend: "异常单", xAxisData: monthDate, seriesData: this.date};
        this.abnormalLineChartOption = getLineOption(opt);

        //获取新增商家总数
       // this.total = getSingleLineSum(data, monthDate.length);
    }

    //获取异常单量
    getAbnormalSingleTrend(): void {
        this.apiService.report().call("abnormalStatisticsController.findAbnormalSingleTrend", this.abnormalSingleTrendVo)
            .ok(data => {
                this.total = data["result"]["total"];
                this.date = data["result"]["dailySingleVolumes"];
                let MonthDate = data["result"]["dates"];

                let opt = {title: '异常单量趋势', legend: "异常单", xAxisData: MonthDate, seriesData: this.date};
                this.abnormalLineChartOption = getLineOption(opt);
                //获取新增商家总数
                this.loading = false;
            })
            .fail(data => {
                this.loading = false;
                if (data.code) {
                    this.showSuccess("warn", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            })
    }

}
