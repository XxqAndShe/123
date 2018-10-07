import {Component, OnInit} from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {LazyLoadEvent} from "primeng/components/common/api";
import {API} from "../../../../share/lib/api/api";
import {ApiService} from "../../../../share/app-service/api-service";
import {DatePipe} from "@angular/common";
@Component({
    templateUrl: './master-kpi.component.html',
    styleUrls: [
        './master-kpi.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class MasterKpiComponent implements OnInit {
    selectNum: number = 0;  //表格选中个数
    selectionRow; //表格选中行
    msgs: any;//公共提示
    startDate: any;
    endDate: any;
    billSource: any = 'All';//运单来源
    masterId: any;
    masterName: any;
    dataSource: any[];//服务器返回的数据
    data: any;
    maxDateValue;
    //右侧弹出框
    modalState: string = 'out';
    showModal: boolean = false;
    loading:boolean;

    //输入框组件
    public temp: string;
    public suggestionResult: string[];//查询建议结果

    ngOnInit(): void {
        this.maxDateValue = new Date();
        this.data = {
            content: [],
            totalElements: 0
        };
        this.data = [];
        if (this.billSource == 'tmall') {
            this.billSource = true;
        } else {
            this.billSource = false;
        }
        this.apiService.report().call("userWorkerController.listUserWorkerKPI",{first:0,rows:10},{startDate: this.startDate,
            endDate: this.endDate,
            isTmall: this.billSource,
            realName: this.masterName,
            mobile: this.masterId}).ok(data => {
            // alert(data);
            this.data = data.result;
        }).fail(data => {
            this.showSuccess("error", "提示", data.error);
        });
        //TODO
        //表格测试数据
        // this.dataSource=[
        //     {
        //         masterName: 'banch', masterId: '1zt54151651', area: '华南', manager: 'J', four1: '及时率', five1: '超时票数', six1: 'KPI得分', seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 340, grade: 3
        //     },
        //     {
        //         masterName: 'lambol', masterId: '1zt6546546', area: '华中', manager: 'D', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 560, grade: 1
        //     },
        //     {
        //         masterName: 'tyler', masterId: '1zt65465111', area: '华北', manager: 'L', four1: 1, five1: 1, six1: 1, seven1: 1, four2: 1, five2: 1, six2: 1, seven2: 1,four3: 1, five3: 1, six3: 1, seven3: 1,four4: 1, five4: 1, six4: 1, seven4: 1,four5: 1, five5: 1, six5: 1, seven5: 1,four6: 1, five6: 1, six6: 1, seven6: 1,four7: 1, five7: 1, six7: 1, seven7: 1, total: 450, grade: 2
        //     }
        // ]
    }

    searchResult(event, type?) {
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
    constructor(public datePickerService: DatepickerService, public apiService: ApiService, public datePipe: DatePipe) {
    }

    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    displayModal() {
        this.showModal = true;
        this.modalState = 'in';
    }

    closeModal() {
        this.showModal = false;
        this.modalState = 'out';
    }

    onRowSelect($event) {

        this.selectNum = 1;
    }

    doSearch() {
        this.loading = true;
        if (this.billSource == 'tmall') {
            this.billSource = true;
        } else {
            this.billSource = false;
        }
        this.apiService.report().call("userWorkerController.listUserWorkerKPI", {first: 0, rows: 10}, {
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd 00:00:00'),
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd 23:59:59'),
            isTmall: this.billSource,
            realName: this.masterName,
            mobile: this.masterId

        }).ok(json => {
            this.loading = false;
            this.data = json.result || {};
        }).fail(data => {
          this.loading = false;
        });
    }

    //表格懒加载事件，把服务器返回的数据赋给masters
    onLazyLoad(event: LazyLoadEvent) {
        setTimeout(() => {
            // if(this.data) {
            // 	this.data = this.dataSource.slice(event.first, (event.first + event.rows));
            // }
            if (this.billSource == 'tmall') {
                this.billSource = true;
            } else {
                this.billSource = false;
            }
            this.apiService.report().call("userWorkerController.listUserWorkerKPI", event, {
                startDate: this.startDate,
                endDate: this.endDate,
                isTmall: this.billSource,
                realName: this.masterName,
                mobile: this.masterId
            }).ok(json => {
                //console.log(this.billSource);
                this.data = json.result || {};
                //console.log(this.dataSource);
            }).fail(data => {

            });
        }, 250);
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
