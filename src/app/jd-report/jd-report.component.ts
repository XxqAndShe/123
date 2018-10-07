import {Component, OnInit} from '@angular/core';
import {API} from "../share/lib/api/api";
import {JdRportVo} from "./jd-report.vo";
import {DatepickerService} from "../share/app-service/datepicker.service";
import {DatePipe} from "@angular/common";
import {Message} from "primeng/primeng";
import {ShowOrHideMaskService} from "../share/app-service/show-or-hide-mask.service";
import {doExportCSV} from "../share/utils/gridUtil";

@Component({
    selector: 'app-jd-report',
    templateUrl: './jd-report.component.html',
    styleUrls: ['./jd-report.component.css']
})
export class JdReportComponent implements OnInit {
    data: any;

    /**
     * 位置
     */
    leftSize: any;
    topSize: any;
    showWhichWin;
    tips: any;
    //请求接口标识
    searchLoading: boolean = false;
    //总数据
    totalRecords: number = 0;
    //选中的数据
    selectionRow: any[] = [];
    jdRportVo: JdRportVo = new JdRportVo();

    /**
     * 日历组件
     * @type {any}
     */
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 90 + 'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    dateMax: Date = new Date();
    //推单开始时间
    beginDate: any;
    //推单结束时间
    endDate: any;

    //签收开始时间
    signStartDate: any;
    //签收结束时间
    signEndDate: any;
    msgs: Message[] = [];
    header = [
        "运单号-waybillId",
        "京东订单号-orderNo",
        "服务类型-servicesScope",
        "是否签收-signStatus",
        "收货人姓名-receiver",
        "收货人电话-receiverTel",
        "收货地址-receiverAddr",
        "品名-goodsNames",
        "费用金额(元)-sumPri",
        "揽件费用(元)-colPri",
        "干线费用(元)-maiPri",
        "支线费用(元)-vouPri",
        "保价费用(元)-vouPri",
        "安装费用(元)-insPri",
    ];

    //设置表格
    columns: any[] = [];


    constructor(public api: API, public datePickerService: DatepickerService, public datePipe: DatePipe, public mask: ShowOrHideMaskService,) {
    }

    ngOnInit() {
        for (let i = 0; i < this.header.length; i++) {
            let arr = this.header[i].split('-');
            this.columns[i] = {};
            this.columns[i].field = arr[1];
            this.columns[i].header = arr[0];
            this.columns[i].sortable = false;
            this.columns[i].filter = true;
            if (arr[2]) {
                this.columns[i]['width'] = arr[2];
            }
        }
    }

    load(event) {
        //推单
        if(this.beginDate){
            this.jdRportVo.startDate = moment(this.beginDate).format('YYYY-MM-DD 00:00:00');
        }else {
            this.jdRportVo.startDate = this.beginDate;
        }
        if(this.endDate){
            this.jdRportVo.endDate =  moment(this.endDate).format('YYYY-MM-DD 23:59:59');
        }else {
            this.jdRportVo.endDate =  this.endDate;
        }
        //签收
        if(this.signStartDate){
            this.jdRportVo.signStartDate = moment(this.signStartDate).format('YYYY-MM-DD 00:00:00');
        }else{
            this.jdRportVo.signStartDate = this.signStartDate;
        }
        if(this.signEndDate){
            this.jdRportVo.signEndDate =  moment(this.signEndDate).format('YYYY-MM-DD 23:59:59');
        }else{
            this.jdRportVo.signEndDate =  this.signEndDate;
        }


        if ((this.beginDate) && (this.endDate)) {
            if (this.jdRportVo.startDate > this.jdRportVo.endDate) {
                this.showSuccess("warn", "提示", "推单结束时间不能小于开始时间!");
                return;
            }
        }
        if ((this.signStartDate) && (this.signEndDate)) {
            if (this.jdRportVo.signStartDate > this.jdRportVo.signEndDate) {
                this.showSuccess("warn", "提示", "签收结束时间不能小于开始时间!");
                return;
            }
        }
        this.searchLoading = true;
        this.api.boss().call("JdReportController.queryJdOrder", event, this.jdRportVo).ok(json => {
            this.data = json.result.content;
            this.totalRecords = json.result.totalElements;
            this.searchLoading = false;
        }).fail(data => {
            this.searchLoading = false;
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                this.showSuccess("error", "提示", "请联系管理员");
            }
        });
    }

    /**
     * 搜索
     */
    doSearch() {
        this.load({first: 0, rows: 20});
    }

    doExport() {
        doExportCSV(this.data, this.columns, '京东订单价格表');
    }

    /**
     * 对有textLength属性的column进行字节数量控制
     * @param val
     * @param textLength
     * @returns {string|void|any}
     */
    replaceTextOmit(val: any, textLength: number = 25) {
        let resultData, temp;
        resultData = this.dataToStr(val);
        if (typeof resultData === 'string') {
            temp = resultData.slice(0, textLength);
            return resultData.length > textLength ? `${temp}...` : resultData;
        } else {
            return resultData;
        }
    }

    /**
     * 数据转为字符串
     * @param val
     * @returns {any}
     */
    dataToStr(val: any) {
        let resultData;
        if (typeof val === 'number') {
            resultData = val.toString();
        } else if (typeof val === 'undefined') {
            resultData = '';
        } else if (val === null) {
            resultData = '';
        } else if (typeof val === 'object') {
            resultData = JSON.stringify(val);
        } else if (typeof val === 'boolean') {
            resultData = val ? '是' : '否';
        } else {
            resultData = val;
        }
        return resultData;
    }

    /**
     * 鼠标悬浮事件
     * @param event
     * @param type
     * @param row
     * @param col
     */
    onCellMouseEnter(event: any, type, row, col) {
        event.stopPropagation();
        this.showWhichWin = type;
        this.leftSize = event.clientX;
        this.topSize = event.clientY;
        if (col['header'] === '品名') {
            this.tips = row['goodsNames'];
        }
    }

    /**
     * 鼠标移开索引改变
     */
    onCellMouseLeave() {
        this.showWhichWin = '';
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
}
