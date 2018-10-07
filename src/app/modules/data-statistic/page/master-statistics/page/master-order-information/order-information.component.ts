/**
 * Created by Administrator on 2017/4/19.
 */
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { DatepickerService } from "../../../../../../share/app-service/datepicker.service";
import { AreaService } from "../../../../../../share/app-service/area.service";

import { MasterOrderInformationVo } from '../../vo/master-order-information.vo'
import { ApiService } from "../../../../../../share/app-service/api-service";
import {DatePipe} from "@angular/common";
import {getCurrentMonthFirst} from "../../../../../../share/utils/DateUtil";
@Component({
    templateUrl: "./order-information.component.html",
    styleUrls: ["./order-information.component.css"],

})
export class MasterOrderInformation implements OnInit {
    isSelect:boolean;
    public MasterOrderInformationVo: MasterOrderInformationVo;
    startDate: any;
    endDate: any;
    areaId: string;
    userWorker: any;
    loading:boolean;

    ngOnInit(): void {
        this.MasterOrderInformationVo = new MasterOrderInformationVo;
        this.initColumns();
        /*
        * 默认时间*/
        this.MasterOrderInformationVo.endDate = new Date();
        this.MasterOrderInformationVo.startDate = getCurrentMonthFirst();

    }  //地址组件
    // 初始化列
    initColumns(): void {
        this.columns.push(
            {
                field: "worker",
                header: "师傅名称",
                sortable: true,
                filter: true
            },
            {
                field: "mobile",
                header: "师傅电话",
                sortable: true,
                filter: true
            },
            {
                field: "orderCount",
                header: "总完成订单数量",
                sortable: true,
                filter: true
            },
            {
                field: "exceptCounts",
                header: "异常单数量",
                sortable: true,
                filter: true
            },
            {
                field: "afterSaleCounts",
                header: "售后单数量",
                sortable: true,
                filter: true
            },
            {
                field: "orderTotal",
                header: "订单总价",
                sortable: true,
                filter: true
            },
            {
                field: "feeSum",
                header: "师傅服务费",
                sortable: true,
                filter: true
            },
            {
                field: "contribution",
                header: "贡献值",
                sortable: true,
                filter: true
            }
        );
    }
    // nav插件引用设置
    navs = ["订单趋势", "订单信息", "师傅数量", "师傅收入趋势"];
    navHrefs = [
        'modules/data-statistic/master-statistics/master-order-trend',
        'modules/data-statistic/master-statistics/master-order-information',
        'modules/data-statistic/master-statistics/master-quantity',
        'modules/data-statistic/master-statistics/master-revenue-trends',
    ];
    curIndex = 1;

    chanCurIndex(index: number) {
        this.curIndex = index;
        //console.log(this.curIndex);
    }
    columns: any[] = [];
    data: any;
    selectionRow: any[] = [];


    constructor(public datePickerService: DatepickerService,
        public areaService: AreaService,
        public api: ApiService,
                public datePipe:DatePipe) { }


    public doSearch() {
        //克隆新对象
        let MasterOrderInformationVoClone=_.clone(this.MasterOrderInformationVo);
        //取出日期
        let startDate=MasterOrderInformationVoClone.startDate;
        let endDate=MasterOrderInformationVoClone.endDate;
        //转换日期格式
        MasterOrderInformationVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        MasterOrderInformationVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');

        if (!startDate || !endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }
        this.loading = true;
        this.load({
            first:0,
            row:10
        });

    }

    load(page){
         //克隆新对象
        let MasterOrderInformationVoClone=_.clone(this.MasterOrderInformationVo);
        //取出日期
        let startDate=MasterOrderInformationVoClone.startDate;
        let endDate=MasterOrderInformationVoClone.endDate;
        //转换日期格式
        MasterOrderInformationVoClone.startDate=this.datePipe.transform(startDate,'yyyy-MM-dd 00:00:00');
        MasterOrderInformationVoClone.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');

         let mob = this.userWorker || {};
        this.api.report().call("WorkerContraller.findWorkerOrderTotal", page, {
            startDate: startDate,
            endDate: endDate,
            userWorkerId: mob.mobile,
            areaId: this.areaId,
        }).ok(data => {
            this.data = data.result;
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

    //日历插件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    dataHandler: Function = this.areaService.selectBoxHandler();

    msgs: any;//提示框
    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
}
