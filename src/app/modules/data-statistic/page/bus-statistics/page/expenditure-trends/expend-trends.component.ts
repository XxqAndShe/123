import {Component} from "@angular/core";

import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {AreaService} from "../../../../../../share/app-service/area.service";
import {getLineOption} from "../../../../chart/merchant-line-chart-opt";
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import {ApiService} from "../../../../../../share/app-service/api-service";
import {getMonthDate, dateToObject, getSevenDays,getDate} from "app/share/utils/DateUtil";
import {ExpenditrueTrend} from "../../vo/expenditure-trends.vo";
import {getSingleLineSum} from "../../../../../../share/utils/ChartUtil";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './expend-trends.component.html',
    styleUrls: ['./expend-trends.component.css']
})
export class ExpendTrendsComponent {

    public ExpenditrueTrend: ExpenditrueTrend;
    curIndex = 3;
    //日期组件
    zh: any = this.datePickerService.locale();
    // nav插件引用设置
    navs = ["商家排名", "商家数量趋势", "商家订单统计", "商家账单支出趋势统计"];
    navHrefs = [
        'modules/data-statistic/bus-statistics/bus-ranking',
        'modules/data-statistic/bus-statistics/merchant-quantity',
        'modules/data-statistic/bus-statistics/bus-order',
        'modules/data-statistic/bus-statistics/expenditure-trends',
    ];
    // 图标数据
    abnormalLineChartOption: any;
    msgs: any;
    tabledata: any[] = [];
    loading:boolean;

    chanCurIndex(index: number) {
        this.curIndex = index;
    }

    //构造函数
    constructor(public datePickerService: DatepickerService,
                public areaService: AreaService,
                public confirmationService: ConfirmationService,
                public api: ApiService,
                public datePipe:DatePipe) {
    }

    ngOnInit() {
        this.ExpenditrueTrend = new ExpenditrueTrend();
        //设置默认的日期
        // this.ExpenditrueTrend.endDate = new Date();
        // this.ExpenditrueTrend.startDate = getDate(this.datePipe.transform(getSevenDays(this.ExpenditrueTrend.endDate), 'yyyy-MM-dd 00:00:00'));
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /*查询*/
    doSearch(): void {
        this.loading = true;
        if(this.ExpenditrueTrend.startDate == null || this.ExpenditrueTrend.startDate == undefined || this.ExpenditrueTrend.endDate == null || this.ExpenditrueTrend.endDate == undefined){
            this.showSuccess("warn","提示","时间段不能为空");
            return;
        }
        /*startDate  endDate  bussinessName statisticalMonth*/
        //克隆新对象
        let ExpenditrueTrendClone=_.clone(this.ExpenditrueTrend);
        //取出日期
        let startDate=ExpenditrueTrendClone.startDate;
        let endDate=ExpenditrueTrendClone.endDate;
        //转换日期格式
        ExpenditrueTrendClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        ExpenditrueTrendClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');
        startDate= getDate(ExpenditrueTrendClone.startDate);
        endDate= getDate(ExpenditrueTrendClone.endDate);

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return
        }

        //横轴坐标时间计算
        let monthDate = getMonthDate(startDate, endDate);

        //获取后台数据
        this.api.core().call("BusinessmenContraller.findBusinessmenExpend", {
            startDate: startDate,
            endDate: endDate,
            shipperId: this.ExpenditrueTrend.shipperCode
        }).ok(jsonData => {
            this.tabledata = jsonData.result;
            this.convertDataAndRender(monthDate);
            this.loading = false;
        }).fail(jsonData => {
            this.loading = false;
            if (jsonData.code) {
                this.showSuccess("error", "提示", jsonData.error);
            } else {
                this.showSuccess("warn", "提示", "系统异常请联系管理员");
            }
        });

        // let MonthDate = getMonthDate(startDate, endDate);

        // let data = [1213, 344, 111, 666, 12940, 56, 76,23,535,1244];
        // let opt = {title: '商家新增数量趋势', xAxisData: MonthDate, seriesData: data};
        // let options = getLineOption(opt);
        // this.abnormalLineChartOption = options

    }

    /**
     * 后端数据处理转换并渲染统计图表
     * @param monthDate 日期数组
     */
    convertDataAndRender(monthDate) {

        //将当期查询日期转换为 日期-值 对象
        let dateObject = dateToObject(monthDate);

        //测试数据，对接请删除(后端返回的数据)
        //let backendData=[{"groupDay":"2017-04-21" , "clientCount":29145}];
        let backendData = this.tabledata;
        //获取后端数据
        for (let item of backendData) {
            let dateString = item['businessDate'].trim();
            dateObject[dateString] = item['orderAmount'];
        }
        //转成数组
        let data = _.values(dateObject);

        //获取lineOption重绘制图表
        let opt = {title: '商家支出趋势统计', legend:'商家支出',xAxisData: monthDate, seriesData: data};
        this.abnormalLineChartOption = getLineOption(opt);
        //获取新增商家总数
        this.ExpenditrueTrend.totalExpend = getSingleLineSum(data, monthDate.length);
    }

    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    //地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

}
