import {Component, OnInit, Output, EventEmitter, Input, AfterContentInit, ViewChildren} from '@angular/core';
import {MixSearchRequestVo} from '../../vo/mix-search-request.vo';
import {MixSearchResponseVo} from '../../vo/mix-search-response.vo';
import {API} from "../../../../share/lib/api/api";
import {MixSearchHeaderService} from "../../service/mix-search-header.service";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {AreaService} from '../../../../share/app-service/area.service';
import {DatePipe} from "@angular/common";

@Component({
    selector: 'mix-search-header',
    templateUrl: './mix-search-header.component.html',
    styleUrls: ['./mix-search-header.component.css']
})

export class MixSearchHeaderComponent implements OnInit {
    @Input() inputWaybill;
    msgs: any;//公共提示;

    @Output() noSelect = new EventEmitter();//查询清空
    @Output() onCollect = new EventEmitter();

    constructor(public api: API,
                public mixSearchHeaderService: MixSearchHeaderService,
                public datePickerService: DatepickerService,
                public datePipe: DatePipe,
                public areaService: AreaService,) {

    }

    ngOnInit(): void {
        this.mixSearchRequestVo = new MixSearchRequestVo();
        this.mixSearchResponseVo = [];
        // this.mixSearchRequestVo.beginDate = this.dateText1;
        // this.mixSearchRequestVo.endDate = this.dateText2;

        // 设置下拉框默认选项
        this.vTaskMixSearch.taskType = 'All';
        this.vTaskMixSearch.taskStatus = 'All';
        this.vTaskMixSearch.matchType = 'All';
        this.vTaskMixSearch.queryDateType = 'createDate';
        if (this.inputWaybill) {
            if (this.inputWaybill.match(/[a-zA-Z0-9]/g)) {
                this.vTaskMixSearch.billOrTask = this.inputWaybill.replace(/[,，]/g, "\n");
            } else {
                this.vTaskMixSearch.consignee = this.inputWaybill;
            }
        }
    }

    //输入框组件
    public temp: string;
    public suggestionResult: string[];//查询建议结果
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

    //综合查询请求vo
    mixSearchRequestVo: MixSearchRequestVo;

    //综合查询响应vo数组
    mixSearchResponseVo: MixSearchResponseVo[];

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 78+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    vTaskMixSearch: any = {};
    data: any;

    /**
     * 执行查询操作
     */
    public doSearch(): any {
        this.load({first: 0, rows: 10});
        this.noSelect.emit();
    }

    public load($event): void {
        //克隆新对象
        let mixSearchVo = _.clone(this.vTaskMixSearch);
        //取出日期
        let beginDate = mixSearchVo.beginDate;
        let endDate = mixSearchVo.endDate;
        //转换格式
        mixSearchVo.beginDate = this.datePipe.transform(beginDate, 'yyyy-MM-dd HH:mm:ss');
        mixSearchVo.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');

        this.api.call('TaskMixSearchController.comprehensiveQuery', $event, mixSearchVo)
            .ok(data => {
                this.data = data.result;
                if (this.data && this.data.content.length === 0) {
                    // this.showSuccess("warn", "提示", "没有符合条件数据");
                }
            })
            .fail(err => {
                this.showSuccess("error", "提示", "查询失败！");
            });
    }

    /**
     * 导出
     */
    exportCSV($event){
        //克隆新对象
        let mixSearchVo = _.clone(this.vTaskMixSearch);
        //取出日期
        let beginDate = mixSearchVo.beginDate;
        let endDate = mixSearchVo.endDate;
        //转换格式
        mixSearchVo.beginDate = this.datePipe.transform(beginDate, 'yyyy-MM-dd HH:mm:ss');
        mixSearchVo.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');
        this.api.call('TaskMixSearchController.comprehensiveQuery', {
            first:0,
            rows:99999999
        }, mixSearchVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();


    taskType: string = '';
    taskStatus: string = '';

    taskTypeChanged($event) {
        this.taskType = $event;
    }

    taskStatusChanged($event) {
        this.taskStatus = $event;
        let changeInfo = {taskType: this.taskType, taskStatus: this.taskStatus};
        this.onCollect.emit(changeInfo);
    }

    billOrTaskMsg: string = '多单查询请以回车键换行隔开';

    clearTextArea() {
        this.vTaskMixSearch.billOrTask = null;
    }
}
