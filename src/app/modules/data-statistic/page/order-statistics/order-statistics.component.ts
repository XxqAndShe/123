/**
 * Created by xiaoluo on 2017-04-18.
 */
import {Component, OnInit} from "@angular/core";
//引入日期服务
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
//引入地址区域的服务
import {AreaService} from "../../../../share/app-service/area.service";
//测试数据
import {getMapData} from "../../../../../mock/map-data-test";
import {getLineOption} from "../../chart/merchant-line-chart-opt";
import {getCurrentMonthFirst, getMonthDate, getSevenDays,getDate} from "app/share/utils/DateUtil";
import {OrderAreaStatistics} from "./vo/order-area-statistics.vo";
import {ApiService} from "../../../../share/app-service/api-service";
import {OrderTrendStatistics} from "./vo/order-trend-statistics.vo";
import {DatePipe} from "@angular/common";
import {getLineArr, getMapSum, getSingleLineSum} from "../../../../share/utils/ChartUtil";


@Component({
    templateUrl: './order-statistics.component.html',
    styleUrls: [
        './order-statistics.component.css'
    ]
})
export class OrderStatisticsComponent implements OnInit {
    public OrderAreaStatistics: OrderAreaStatistics;
    public OrderTrendStatistics: OrderTrendStatistics;
    //构造函数
    constructor(public datePickerService: DatepickerService,
                public areaService: AreaService,
                public apiService: ApiService,
                public datePipe:DatePipe) {
    }

    // nav插件引用设置
    navs = ["订单区域统计", "订单趋势统计"];
    curIndex = 0;
    /*父组件绑定函数，让子组件去触发*/
    backEnd: string;
    allOrder:string;
    proAverageOrder:string;
    //定义是否显示
    isShowArea = true;
    isShowTrend = false;

    //图形数据
    OrderMapOption: any;
    OrderTrendOption: any;
    data = [];
    MoneyData=[];
    mapData = [];
    lineDate = [];
    lineMoneyData:any;
    msgs: any;
    mapOpt: any;
    lineOpt: any;
    allSum: any;
    provinceAverage: any;
    OrderSum:number;
    MonthDate:any;
    loading:boolean;

    //改变导航栏
    changeNav(i) {
        if (i == 0) {
            this.backEnd = "order-area";
            this.isShowArea = true;
            this.isShowTrend = false;
            this.curIndex = 0;
        } else if (i == 1) {
            //时间段默认为空
            this.backEnd = "order-trend";
            this.isShowArea = false;
            this.isShowTrend = true;
            this.curIndex = 1;

        }
    }

    //日期组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    //地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    ngOnInit() {
        //TODO 测试数据赋值
        this.OrderAreaStatistics = new OrderAreaStatistics();
        this.OrderTrendStatistics = new OrderTrendStatistics();
        //页面加载的时候就初始化日期
        this.OrderAreaStatistics.endWriteDate = new Date();
        this.OrderAreaStatistics.startWriteDate =getCurrentMonthFirst();
        this.OrderAreaStatistics.statisticMode = "ammount";
        this.allOrder="总数量";
        this.proAverageOrder = "订单数量";
        // this.OrderTrendStatistics.endWriteDate = new Date();
        // this.OrderTrendStatistics.startWriteDate = getDate(this.datePipe.transform(getSevenDays(this.OrderTrendStatistics.endWriteDate), 'yyyy-MM-dd 00:00:00'));
        this.OrderTrendStatistics.statisticMode = "ammount";

        //页面加载默认查询
        this.doSearchArea();
    }

    //查询区域的数据
    doSearchArea(): void {
        this.loading = true;
        let startDate = this.OrderAreaStatistics.startWriteDate;
        let endDate = this.OrderAreaStatistics.endWriteDate;
        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }

        //克隆新对象
        let OrderAreaStatisticsClone=_.clone(this.OrderAreaStatistics);
        //取出日期
        let startWriteDate=OrderAreaStatisticsClone.startWriteDate;
        let endWriteDate=OrderAreaStatisticsClone.endWriteDate;
        //转换日期格式
        OrderAreaStatisticsClone.startWriteDate=this.datePipe.transform(startWriteDate,'yyyy-MM-dd 00:00:00');
        OrderAreaStatisticsClone.endWriteDate=this.datePipe.transform(endWriteDate,'yyyy-MM-dd 23:59:59');

        //初始化城市的数据
        this.mapData = [
                {name: '北京',value: 0 },
                {name: '天津',value: 0 },
                {name: '上海',value: 0 },
                {name: '重庆',value: 0 },
                {name: '河北',value: 0 },
                {name: '河南',value: 0 },
                {name: '云南',value: 0 },
                {name: '辽宁',value: 0 },
                {name: '黑龙江',value: 0 },
                {name: '湖南',value: 0 },
                {name: '安徽',value: 0 },
                {name: '山东',value: 0 },
                {name: '新疆',value: 0 },
                {name: '江苏',value: 0 },
                {name: '浙江',value: 0 },
                {name: '江西',value: 0 },
                {name: '湖北',value: 0 },
                {name: '广西',value: 0 },
                {name: '甘肃',value: 0 },
                {name: '山西',value: 0 },
                {name: '内蒙古',value: 0 },
                {name: '陕西',value: 0 },
                {name: '吉林',value: 0 },
                {name: '福建',value: 0 },
                {name: '贵州',value: 0 },
                {name: '广东',value: 0 },
                {name: '青海',value: 0 },
                {name: '西藏',value: 0 },
                {name: '四川',value: 0 },
                {name: '宁夏',value: 0 },
                {name: '海南',value: 0 },
                {name: '台湾',value: 0 },
                {name: '香港',value: 0 },
                {name: '澳门',value: 0 }
            ];

        //调用接口
        this.findOrderMapData(OrderAreaStatisticsClone);
    }

    //查询订单趋势的数据
    doSearchTrend():void {
        let startDate = this.OrderTrendStatistics.startWriteDate;
        let endDate = this.OrderTrendStatistics.endWriteDate;
        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }

        //克隆新对象
        let OrderTrendStatisticsClone=_.clone(this.OrderTrendStatistics);
        //取出日期
        let startWriteDate=OrderTrendStatisticsClone.startWriteDate;
        let endWriteDate=OrderTrendStatisticsClone.endWriteDate;
        //转换日期格式
        OrderTrendStatisticsClone.startWriteDate=this.datePipe.transform(startWriteDate,'yyyy-MM-dd 00:00:00');
        OrderTrendStatisticsClone.endWriteDate=this.datePipe.transform(endWriteDate,'yyyy-MM-dd 23:59:59');
        startDate = getDate(OrderTrendStatisticsClone.startWriteDate);
        endDate = getDate(OrderTrendStatisticsClone.endWriteDate);

        //调用订单趋势接口的数据
        this.findOrderTrendData(OrderTrendStatisticsClone,startDate,endDate);
    }



    /**
     * 查询订单区域
     * @param postData
     */
    findOrderMapData(postData) {
        this.apiService.core().call("OrderStatisticController.orderAreaStatistic", postData).ok(json => {
            let result;
            //获取后端数据
             let backendData = json.result;
            //替换有数据的城市
            for(let item of backendData){
                let dateString=item['name'].trim();
                this.mapData.forEach((val)=>{
                    if(val['name']==dateString){
                        val['value'] = item['value'];
                    }
                })
            }

            result = json.result;
            ////console.log(JSON.stringify(this.mapData));
            this.mapOpt = {legend: '省订单数量', series: this.mapData};
            this.allOrder="总数量";
            this.proAverageOrder = "订单数量";
            if (postData.statisticMode == "money") {
                this.mapOpt = {legend: '省订单金额', series: this.mapData};
                this.allOrder="总金额";
                this.proAverageOrder = "订单金额";
            }
            this.OrderMapOption = getMapData(this.mapOpt);
            //获取全国订单数和省平均数
            this.allSum = getMapSum(this.mapData).sum;
            this.provinceAverage = getMapSum(this.mapData).ave;
            this.loading = false;
        }).fail((err) => {
            this.loading = false;
        });
    }

    /**
     * 查询订单趋势统计
     * @param postData
     * @param startDate
     * @param endDate
     */
    findOrderTrendData(postData, startDate, endDate) {

        this.apiService.core().call("OrderStatisticController.orderTrendStatistic", postData).ok(json => {
            let result;
            this.lineDate = json.result;
            //折线图横轴坐标时间计算
            this.MonthDate = getMonthDate(startDate, endDate);
            //折线图获取订单数据数组
            this.data = getLineArr(this.lineDate, this.MonthDate);

            this.lineOpt = {title: '订单趋势统计之订单数量',legend :"订单数量", xAxisData: this.MonthDate, seriesData: this.data};
            this.proAverageOrder = "订单数量";
            if(postData.statisticMode == "money"){
                this.lineOpt = {title: '订单趋势统计之订单金额',legend :"订单金额", xAxisData: this.MonthDate, seriesData: this.data};
                this.proAverageOrder = "订单金额";
            }
            this.OrderTrendOption = getLineOption(this.lineOpt);

            //获取订单总数
            console.log(typeof this.data[0]);
            console.log(this.MonthDate.length);

            this.OrderSum = getSingleLineSum(this.data, this.MonthDate.length) || 0;
        }).fail((err) => {
            this.showSuccess("error","提示",err.error);
        });
    }
}
