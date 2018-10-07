import {Component} from "@angular/core";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {AreaService} from "../../../../../../share/app-service/area.service";
import {getLineOption} from "app/modules/data-statistic/chart/merchant-line-chart-opt";
import {getMonthDate, dateToObject, getSevenDays,getDate} from "app/share/utils/DateUtil";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {MerchantQuantity} from "../../vo/merchant-quantity.vo";
import {getSingleLineSum} from "../../../../../../share/utils/ChartUtil";
import {DatePipe} from "@angular/common";
@Component({
    templateUrl: './merchant-quantity.component.html',
    styleUrls: ['./merchant-quantity.component.css']
})
export class MerchantQuantityComponent {
    public MerchantQuantity: MerchantQuantity;
    curIndex = 1;
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

    chanCurIndex(index: number) {
        this.curIndex = index;
    }
    tabledata :any[]=[];
    loading:boolean;

    //构造函数
    constructor(public datePickerService: DatepickerService,
                public areaService: AreaService,
                public api:ApiService,
                public datePipe:DatePipe) {
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    ngOnInit() {

        this.MerchantQuantity = new MerchantQuantity();
        //设置默认的日期
        // this.MerchantQuantity.endDate = new Date();
        // this.MerchantQuantity.startDate = getDate(this.datePipe.transform(getSevenDays(this.MerchantQuantity.endDate), 'yyyy-MM-dd 00:00:00'));
    }

    /*查询*/
    doSearch(): void {
        this.loading = true;
        if(this.MerchantQuantity.startDate == null || this.MerchantQuantity.startDate == undefined || this.MerchantQuantity.endDate == null || this.MerchantQuantity.endDate == undefined){
            this.showSuccess("warn","提示","时间段不能为空");
            return;
        }
        //克隆新对象
        let MerchantQuantityClone=_.clone(this.MerchantQuantity);
        //取出日期
        let startDate=MerchantQuantityClone.startDate;
        let endDate=MerchantQuantityClone.endDate;
        //转换日期格式
        MerchantQuantityClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        MerchantQuantityClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');
        startDate= getDate(MerchantQuantityClone.startDate);
        endDate= getDate(MerchantQuantityClone.endDate);

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return
        }
        //横轴坐标时间计算
        let monthDate = getMonthDate(startDate, endDate);
        //获取后台数据
        this.api.core().call("BusinessmenContraller.findBusinessmenAmount",{
            startDate: startDate,
            endDate:endDate
        }).ok(jsonData=>{
            this.tabledata = jsonData.result;
            this.loading = false;
            this.convertDataAndRender(monthDate);
        }).fail(jsonData=>{
            this.loading = false;
            if (jsonData.code)
            {
                this.showSuccess("error","提示",jsonData.error);
            }else {
                this.showSuccess("warn","提示","系统异常请联系管理员");
            }
        });
    }

    /**
     * 后端数据处理转换并渲染统计图表
     * @param monthDate 日期数组
     */
    convertDataAndRender(monthDate){

        //将当期查询日期转换为 日期-值 对象
        let dateObject=dateToObject(monthDate);

        //测试数据，对接请删除(后端返回的数据)
        //let backendData=[{"groupDay":"2017-04-21" , "clientCount":29145}];
        let backendData = this.tabledata;
        //获取后端数据
        for(let item of backendData){
            let dateString=item['groupDay'].trim();
            dateObject[dateString]=item['clientCount'];
        }
        //转成数组
        let data=_.values(dateObject);

        //获取lineOption重绘制图表
        let opt = {title: '商家新增数量趋势',legend :"商家新增量",xAxisData: monthDate, seriesData: data};
        this.abnormalLineChartOption = getLineOption(opt);

        //获取新增商家总数
        this.MerchantQuantity.newMerchant = getSingleLineSum(data,monthDate.length);
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
