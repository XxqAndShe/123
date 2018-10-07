/**
 * Created by Administrator on 2017/4/19.
 */
import { Component, OnInit } from '@angular/core';
import { DatepickerService } from "../../../../../../share/app-service/datepicker.service";

import { MasterRevenueVo } from '../../vo/master-revenue-trends.vo';
import { ApiService } from "app/share/app-service/api-service";
import { getMonthDate, dateToObject,getDate,getSevenDays } from "app/share/utils/DateUtil";
import {DatePipe} from "@angular/common";
import {getLineOption} from "../../../../chart/merchant-line-chart-opt";
@Component({

    templateUrl: "./revenue-trends.component.html",
    styleUrls: ["./revenue-trends.component.css"],

})
export class RevenueTrends implements OnInit {
    tabledata: any;
    master: any;
    totalCount: number;
    totalAverage: number;
    public MasterRevenueVo: MasterRevenueVo;
    loading:boolean;
    ngOnInit() {
        this.MasterRevenueVo = new MasterRevenueVo;
        //todo 测试数据赋值

        /*
        * 默认时间*/
        //  this.MasterRevenueVo.endDate = new Date();
        // this.MasterRevenueVo.startDate = getDate(this.datePipe.transform(getSevenDays(this.MasterRevenueVo.endDate), 'yyyy-MM-dd 00:00:00'));
    }
    constructor(public datePickerService: DatepickerService,
                public api: ApiService,
                public datePipe:DatePipe) {
    }
    // nav插件引用设置
    navs = ["订单趋势", "订单信息", "师傅数量", "师傅收入趋势"];
    navHrefs = [
        'modules/data-statistic/master-statistics/master-order-trend',
        'modules/data-statistic/master-statistics/master-order-information',
        'modules/data-statistic/master-statistics/master-quantity',
        'modules/data-statistic/master-statistics/master-revenue-trends',
    ];
    msgs: any;
    // 图标数据
    abnormalLineChartOption: any;
    curIndex = 3;
    chanCurIndex(index: number) {
        this.curIndex = index;
        //console.log(this.curIndex);
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
    /*查询*/
    doSearch() {
        this.loading = true;
        //克隆新对象
        let MasterRevenueVoClone=_.clone(this.MasterRevenueVo);
        //取出日期
        let startDate=MasterRevenueVoClone.startDate;
        let endDate=MasterRevenueVoClone.endDate;
        //转换日期格式
        MasterRevenueVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        MasterRevenueVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59ss');

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }

        if (!this.master) {
            this.showSuccess("error", "错误", "请选择师傅");
            return
        }

        // userWorkerId：this.master
        let monthDate = getMonthDate(startDate, endDate);

        this.api.report().call("WorkerContraller.findWorkerIncomeSum", {
            startDate: startDate,
            endDate: endDate,
            userWorkerId: this.master.mobile
        }).ok(jsonData => {
            this.tabledata = jsonData.result;
            this.totalCount = 0;
            this.convertDataAndRender(monthDate);
            this.loading = false;
        }).fail(jsonData => {
            this.loading = false;
            if (jsonData.code) {
                this.showSuccess("error", "错误", jsonData.error);
            } else {
                this.showSuccess("error", "错误", "系统异常请联系管理员");
            }
        });

    }

    convertDataAndRender(monthDate) {

        //将当期查询日期转换为 日期-值 对象
        let dateObejct = dateToObject(monthDate);

        //测试数据，对接请删除(后端返回的数据)
        let backendData = this.tabledata;
        //获取后端数据
        for (let item of backendData) {
            let dateString = item['writeDate'].trim();
            dateObejct[dateString] = item['totalFee'];
        }
        //转成数组
        let data = _.values(dateObejct);
        this.totalCount = _.sum(data);
        this.totalAverage = (this.totalCount / monthDate.length)||0;
        //获取lineOption重绘制图表
        let opt = { title: '师傅收入趋势',legend:'师傅收入', xAxisData: monthDate, seriesData: data }
        this.abnormalLineChartOption = getLineOption(opt);
    }

    //日历插件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

}
