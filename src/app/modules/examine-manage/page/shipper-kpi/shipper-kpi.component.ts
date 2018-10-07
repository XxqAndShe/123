import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {LazyLoadEvent} from "primeng/components/common/api";
import {ApiService} from "../../../../share/app-service/api-service";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './shipper-kpi.component.html',
    styleUrls: [
        './shipper-kpi.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class ShipperKpiComponent implements AfterViewInit {
    selectNum = 0;  //表格选中个数
    selectionRow; // 表格选中行
    msgs: any;//公共提示
    showModal: boolean = false;
    modalState: string = 'out';
    maxDateValue;

    constructor(public datePickerService: DatepickerService,
                public  api: ApiService,
                public datePipe: DatePipe) {
    }

    billSource: any;//运单来源
    startDate: any;
    endDate: any;

    clientId: any;
    shipperName: any;
    shipperTel: any;
    masterName: any;
    masterNo: any;
    loading:boolean;

    //输入框组件
    public temp: string;
    public suggestionResult: string[];//查询建议结果
    searchResult(event, type?): void {
        if (type = 'receive') {
            //查询收货人
        }
        if (event.query.startsWith("a")) {
            this.suggestionResult = ["aaa", "aab", "aac"];
        }
        else if (event.query.startsWith("b")) {
            this.suggestionResult = ["bbb", "bba", "bbc"];
        }
    }

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    dataSource: any[];//服务器返回的数据
    data: any;

    ngAfterViewInit(): void {
        if(this.billSource=='isTmall'){
            this.billSource=true
        }else{
            this.billSource=false
        }
        this.api.report().call("shipperController.listShipperKPI", {first: 0, rows: 10}, {
            startDate: this.startDate,
            endDate: this.endDate,
            isTmall: this.billSource,
            realName: this.shipperName,
            mobile: this.shipperTel
        }).ok(
            data => {
                // alert(data);
                this.data = data.result;
            }
        ).fail(data => {
            alert(data.error)

        });
    }

    ngOnInit(): void {
        this.maxDateValue = new Date();
        this.billSource = "";
        this.shipperTel = "";
        this.shipperName = "";
        this.data = {
            content: [],
            totalElements: 0
        };
        if(this.billSource=='isTmall'){
            this.billSource=true
        }else{
            this.billSource=false
        }
        this.api.report().call("shipperController.listShipperKPI", {first: 0, rows: 10}, {
            startDate: this.startDate,
            endDate: this.endDate,
            isTmall: this.billSource,
            realName: this.shipperName,
            mobile: this.shipperTel
        }).ok(
            data => {
                // alert(data);
                this.data = data.result;
            }
        ).fail(data => {
            this.showSuccess("error", "提示", data.error);

        });
        /*	this.dataSource=[
         {
         shipperId: '6565165', shipperName: '维斯', phone: '15425632547', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 340, grade: 2
         },
         {
         shipperId: '54345353', shipperName: '螺丝', phone: '15425632547', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 340, grade: 2
         },
         {
         shipperId: '47242452', shipperName: '杜兰特', phone: '15425632547', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 340, grade: 2
         },
         {
         shipperId: '758757857', shipperName: '詹姆斯', phone: '15425632547', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 340, grade: 2
         }
         ]*/
    }

    load(e) {

    }

    //查询方法
    doSearch() {
        this.loading = true;
        /**
         * 格式化时间
         */
        if (this.billSource == 'isTmall') {
            this.billSource = true;
        } else {
            this.billSource = false;
        }
        this.api.report().call("shipperController.listShipperKPI", {first: 0, rows: 10}, {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd 00:00:00'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd 23:59:59'),
            isTmall: this.billSource,
            realName: this.shipperName,
            mobile: this.shipperTel

        }).ok(json => {
            //console.log(this.billSource);
            this.data = json.result || {};
            this.loading = false;
        })
            .fail(data => {
this.loading = false;
            });
    }

    modalData: any[] = [];
    //右侧弹出框
    displayModal() {
        let that = this;
        this.showModal = true;
        setTimeout(function () {
            that.modalState = 'in';
        }, 0);

    }

    closeModal() {
        let that = this;
        this.modalState = 'out';
        setTimeout(function () {
            that.showModal = false;
        }, 200);
    }

    onRowSelect($event) {
        this.selectNum = 1;
        ////console.log(this.selectionRow);
    }

    //表格懒加载事件，把服务器返回的数据赋给data
    onLazyLoad(event: LazyLoadEvent) {
        // setTimeout(() => {
            // if (this.dataSource) {
                // this.data = this.dataSource.slice(event.first, (event.first + event.rows));
                this.api.report().call("shipperController.listShipperKPI", event, {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    isTmall: this.billSource,
                    realName: this.shipperName,
                    mobile: this.shipperTel

                }).ok(json => {
                    //console.log(this.billSource);
                    this.data = json.result || {};
                    //console.log(this.dataSource);
                }).fail(data => {

                });
            // }

        // }, 250);/

    }

    wid100 = {
        'width': '100px'
    }
    wid120 = {
        'width': '120px'
    }
    wid400 = {
        'width': '400px'
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
}
