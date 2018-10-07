import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {AreaService} from '../../../../share/app-service/area.service';
import {API} from "../../../../share/lib/api/api";
import {getDate} from "../../../../share/utils/DateUtil";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'time-abnormal-header',
    templateUrl: './time-abnormal-header.component.html',
    styleUrls: ['./time-abnormal-header.component.css']
})
export class TimeAbnormalHeaderComponent implements OnInit {

    msgs: any;//公共提示
    @Output() noSelect = new EventEmitter();//查询清空

    constructor(public api: API, public datePickerService: DatepickerService, public areaService: AreaService, public datePipe: DatePipe) {
    }

    ngOnInit(): void {
        this.abnormalTimeReqVo.signSts = 'All';
        this.abnormalTimeReqVo.abnormalTimeType = 'All';
        this.abnormalTimeReqVo.abnormalTimeHandelState = 'All';
        this.abnormalTimeReqVo.taskStatus = 'All';
        this.abnormalTimeReqVo.dateType = 'bill';
        this.abnormalTimeReqVo.nameTag = "";
        this.abnormalTimeReqVo.tel = "";
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

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

    abnormalTimeReqVo: any = {};
    data: any;

    //查询方法
    public load($event): void {
        //取出日期
        let startDate = this.abnormalTimeReqVo.startDate;
        let endDate = this.abnormalTimeReqVo.endDate;
        if (startDate != null && endDate != null) {
            //转换日期格式
            this.abnormalTimeReqVo.startDate = getDate(this.datePipe.transform(startDate, 'yyyy-MM-dd 00:00:00'));
            this.abnormalTimeReqVo.endDate = getDate(this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59'));
        }

        this.api.call("AbnormalTimeController.findAbnormalTimeTasks", $event, this.abnormalTimeReqVo)
            .ok(data => {
                ////console.info("返回的数据：{}", data);
                this.data = data.result;
                if (this.data && this.data.content.length === 0) {
                    // this.showSuccess("warn", "提示", "没有符合条件数据");
                }
            })
            .fail(data => {
                //console.info(data);
                // alert("查询失败");
                this.showSuccess("error", "提示", "查询失败");
            });
    }
    /**
     * 导出
     */
    exportCSV($event){
        //取出日期
        let startDate = this.abnormalTimeReqVo.startDate;
        let endDate = this.abnormalTimeReqVo.endDate;
        if (startDate != null && endDate != null) {
            //转换日期格式
            this.abnormalTimeReqVo.startDate = getDate(this.datePipe.transform(startDate, 'yyyy-MM-dd 00:00:00'));
            this.abnormalTimeReqVo.endDate = getDate(this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59'));
        }
        this.api.call('AbnormalTimeController.findAbnormalTimeTasks', {
            first:0,
            rows:99999999
        },this.abnormalTimeReqVo)
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

    //查询方法
    doSearch() {
        this.load({first: 0, rows: 10});
        this.noSelect.emit();
    }
}
