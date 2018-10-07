/**
 * Created by Administrator on 2017/4/19.
 */
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { DatepickerService } from "../../../../../../share/app-service/datepicker.service";
//引入地址区域的服务
import { AreaService } from "../../../../../../share/app-service/area.service";
//测试数据

import { MasterQuantityVo } from '../../vo/masterQuantity.vo';
import {getMapData} from "../../../../../../../mock/map-data-test";
import { ApiService } from "app/share/app-service/api-service";
import {DatePipe} from "@angular/common";
import {getCurrentMonthFirst,getSevenDays,getDate} from "../../../../../../share/utils/DateUtil";
@Component({
    selector: "master-quantity",
    templateUrl: "./master-quantity.component.html",
    styleUrls: ["./master-quantity.component.css"],

})
export class MasterQuantity implements OnInit {
    public MasterQuantityVo: MasterQuantityVo;
    mastrtCount: any;
    masterArg: any;
    loading:boolean;
    ngOnInit() {
        this.MasterQuantityVo = new MasterQuantityVo;
        //TODO 测试数据赋值
        // this.OrderMapOption = getMasterQuantityOption("all");
        // this.orderQryParams.queryObj = "All";

        /*
        * 默认时间*/
        // this.MasterQuantityVo.endDate = new Date();
        // this.MasterQuantityVo.startDate = getCurrentMonthFirst();
    }
    constructor(public datePickerService: DatepickerService,
        public areaService: AreaService,
        public api: ApiService,
                public datePipe:DatePipe) { }
    // nav插件引用设置
    navs = ["订单趋势", "订单信息", "师傅数量", "师傅收入趋势"];
    navHrefs = [
        'modules/data-statistic/master-statistics/master-order-trend',
        'modules/data-statistic/master-statistics/master-order-information',
        'modules/data-statistic/master-statistics/master-quantity',
        'modules/data-statistic/master-statistics/master-revenue-trends',
    ];
    abnormalLineChartOption: any;//图表数据
    msgs: any;//提示框
    //查询参数对象
    orderQryParams = {
        startDate: '',
        endDate: '',
        queryObj: '',
        sellerName: '',
        addressCode: '',
        sellerCode: ''
    };
    //图形数据
    OrderMapOption: any;
    OrderTrendOption: any;
    curIndex = 2;

    chanCurIndex(index: number) {
        this.curIndex = index;
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
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
    /*查询*/
    doSearch() {
        //克隆新对象
        let MasterQuantityVoClone=_.clone(this.MasterQuantityVo);
        //取出日期
        let startDate=MasterQuantityVoClone.startDate;
        let endDate=MasterQuantityVoClone.endDate;
        //转换日期格式
        MasterQuantityVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd HH:mm:ss');
        MasterQuantityVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd HH:mm:ss');

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }
        this.loading = true;
        this.api.report().call("WorkerContraller.findWorkerCounts", {
            startDate: startDate,
            endDate: endDate
        }).ok(jsonData => {
            // this.tabledata = jsonData.result;
            this.mastrtCount = 0;
            let datas = [];
            let max = 0;
            jsonData.result.forEach(item => {
                let d: any = {};
                d.name = item.province;
                d.value = item.number;
                if (item.number > max) {
                    max = item.number;
                }
                this.mastrtCount += item.number;
                datas.push(d);
            });
            this.masterArg = (this.mastrtCount / jsonData.result.length)||0;
            this.masterArg = Math.ceil(this.masterArg);//向上取整
            max=_.ceil(max,-1);
            let opt = { max: max, legend: '省师傅数量',series: datas };
            this.OrderMapOption = getMapData(opt);
            this.orderQryParams.queryObj = "All";
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
}
