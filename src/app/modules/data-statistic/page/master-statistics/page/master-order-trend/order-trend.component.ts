/**
 * Created by Administrator on 2017/4/19.
 */
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
//引入日期服务
import { DatepickerService } from "../../../../../../share/app-service/datepicker.service";

import { MasterOrderTrendVo } from "../../vo/master-order-trend.vo";

import {getMultiLineOption} from "../../../../chart/orderTrend-line-chart-opt";
import { getMonthDate, dateToObject,getDate,getSevenDays } from "app/share/utils/DateUtil";
import { ApiService } from "app/share/app-service/api-service";
import {getSingleLineSum} from "../../../../../../share/utils/ChartUtil";
import {DatePipe} from "@angular/common";
@Component({
    templateUrl: "./order-trend.component.html",
    styleUrls: ["./order-trend.component.css"],

})
export class MasterOrderTrend implements OnInit {
    public MasterOrderTrendVo: MasterOrderTrendVo;

    OrderTrendOption: any;//测试数据
    dataTable: any[] = [];
    orderCount: number = 0;
    userWorker:any;
    loading:boolean;
    constructor(public datePickerService: DatepickerService,
                public api: ApiService,
                public datePipe:DatePipe) { }

    ngOnInit() {
        this.MasterOrderTrendVo = new MasterOrderTrendVo;
        // this.MasterOrderTrendVo.endDate = new Date();
        // this.MasterOrderTrendVo.startDate = getDate(this.datePipe.transform(getSevenDays(this.MasterOrderTrendVo.endDate), 'yyyy-MM-dd 00:00:00'));
    }

    // nav插件引用设置
    navs = ["订单趋势", "订单信息", "师傅数量", "师傅收入趋势"];
    navHrefs = [
        'modules/data-statistic/master-statistics/master-order-trend',
        'modules/data-statistic/master-statistics/master-order-information',
        'modules/data-statistic/master-statistics/master-quantity',
        'modules/data-statistic/master-statistics/master-revenue-trends',
    ];
    curIndex = 0;
    msgs: any;//提示框

    chanCurIndex(index: number) {
        this.curIndex = index;
        ////console.log(this.curIndex);
    }
    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
    /*查询*/
    doSearch() {
        this.loading = true;
        this.getData();
    }

    getData() {
        //克隆新对象
        let MasterOrderTrendVoClone=_.clone(this.MasterOrderTrendVo);
        //取出日期
        let startDate=MasterOrderTrendVoClone.startDate;
        let endDate=MasterOrderTrendVoClone.endDate;
        //转换日期格式
        MasterOrderTrendVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd HH:mm:ss');
        MasterOrderTrendVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd HH:mm:ss');

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }
        if (!this.userWorker) {
            this.showSuccess("warn", "提示", "请选择师傅");
            return
        }
        let monthDate = getMonthDate(startDate, endDate);
        this.api.report().call("WorkerContraller.findWorkerOrderQuantity", {
            startDate: startDate,
            endDate: endDate,
            userWorkerId: this.userWorker.mobile
        }).ok(data => {
            this.dataTable = data.result || {};
            this.orderCount = 0;
            this.convertDataAndRender(monthDate);
            this.loading = false;
        }).fail(data => {
           this.loading = false;
            if (data.code) {
                this.showSuccess("error", "错误", data.error);
            } else {
                this.showSuccess("error", "错误", "系统异常请联系管理员");
            }
        });


    }

    /**
    * 后端数据处理转换并渲染统计图表
    * @param monthDate 日期数组
    */
    convertDataAndRender(monthDate) {

        let backendData = this.dataTable;

        let datas: any[] = [];
        let d1: any[] = [];
        let d2: any[] = [];
        let d3: any[] = [];
        for (let item of backendData) {
            item.writeDate = item.writeDate.trim();
        }
        monthDate.forEach(element => {
            let da = backendData.find(d => d.writeDate == element) || {};
            d1.push(da.serviceCounts || 0);
            d2.push(da.afterSaleCounts || 0);
            d3.push(da.exceptCounts || 0);
            this.orderCount += (da.serviceCounts || 0) + (da.afterSaleCounts || 0) + (da.exceptCounts || 0);
        });
        datas.push(d1);
        datas.push(d2);
        datas.push(d3);

        //获取lineOption重绘制图表
        let opt = { title: '师傅各项单趋势', xAxisData: monthDate, series: datas };
        this.OrderTrendOption = getMultiLineOption(opt);
        //获取订单总数
        this.orderCount = getSingleLineSum(datas,monthDate.length);
    }

    //日历插件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 95 + 'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";


}
