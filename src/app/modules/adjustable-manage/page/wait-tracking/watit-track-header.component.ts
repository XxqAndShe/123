import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {InsTaskTrackRequestVo} from "../../vo/instask-track-request.vo";
import {API} from "../../../../share/lib/api/api";
import {WaitTrackHeaderService} from "../../service/watit-track-header.service";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {AreaService} from '../../../../share/app-service/area.service';
import {ConfirmationService} from "primeng/primeng";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'wait-track-header',
    templateUrl: './wait-track-header.component.html',
    styleUrls: ['./wait-track-header.component.css']
})
export class WaitTrackHeaderComponent implements OnInit {

    insTaskTrackRequestVo: InsTaskTrackRequestVo;

    @Output() onCollect = new EventEmitter();
    @Output() noSelect = new EventEmitter();

    taskType: string = '';
    taskStatus: string = '';
    msgs:any;//公共提示

    taskTypeChanged($event) {
        this.taskType = $event;
    }

    taskStatusChanged($event) {
        this.taskStatus = $event;
        let changeInfo = {taskType: this.taskType, taskStatus: this.taskStatus}
        this.onCollect.emit(changeInfo);
    }

    constructor(public api: API,
                public waitTrackHeaderService: WaitTrackHeaderService,
                public datePickerService: DatepickerService,
                public areaService: AreaService,
                public datePipe : DatePipe,
                public confirmationService: ConfirmationService) {}

    //输入框组件
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

    /*公用弹框*/
    alert(msg:string,title?:string,cb?:any,cd?:any){
        this.confirmationService.confirm({
            message: msg,
            header: title||'提示',
            accept: (e) => {
                if(cb){
                    cb(e);
                }
            },
            reject:(e) => {
                if(cd){
                    cd(e)
                }
            },
        });
    }

    ngOnInit() {
        this.insTaskTrackRequestVo = new InsTaskTrackRequestVo();
        this.insTaskTrackRequestVo.currentPage = "0";
        this.insTaskTrackRequestVo.pageSize = "10";
        this.insTaskTrackRequestVo.trackUser = "1";

        // 设置下拉框默认选项
        this.toTraceTaskVo.taskType = 'All';
        this.toTraceTaskVo.taskStatus = 'All';
        this.toTraceTaskVo.queryDateType = 'bill';

    }
    toTraceTaskVo: any = {};
    data: any;

    /**
     * 执行查询操作
     */
    public doSearch(): any {
        this.load({first:0,rows:10});
        this.noSelect.emit();
    }

    public load($event): void {

        //克隆新对象
        let traceVo=_.clone(this.toTraceTaskVo);
        //取出日期
        let beginDate=traceVo.beginDate;
        let endDate=traceVo.endDate;
        //转换格式
        traceVo.beginDate=this.datePipe.transform(beginDate,'yyyy-MM-dd HH:mm:ss');
        traceVo.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');

        this.api.call('TaskTraceController.findToTraceTask', $event,traceVo)
            .ok(data => {
                this.data = data.result;
                if(this.data && this.data.content.length===0){
                    // this.showSuccess("warn","提示","没有符合条件数据");
                }
            })
            .fail(err => {
                this.showSuccess("error","提示","查询失败！");
            });
    }
    /**
     * 导出
     */
    exportCSV($event){
        //克隆新对象
        let traceVo=_.clone(this.toTraceTaskVo);
        //取出日期
        let beginDate=traceVo.beginDate;
        let endDate=traceVo.endDate;
        //转换格式
        traceVo.beginDate=this.datePipe.transform(beginDate,'yyyy-MM-dd HH:mm:ss');
        traceVo.endDate=this.datePipe.transform(endDate,'yyyy-MM-dd 23:59:59');
        this.api.call('TaskTraceController.findToTraceTask', {
            first:0,
            rows:99999999
        }, traceVo)
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

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 78 + 'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

}
