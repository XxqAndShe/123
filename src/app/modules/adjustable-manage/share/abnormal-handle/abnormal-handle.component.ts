import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";


@Component({
    selector: 'abnormal-handle-win',
    templateUrl: './abnormal-handle.component.html',
    styleUrls: [
        './abnormal-handle.component.css'
    ]
})
export class AbnormalHandleWin implements OnInit {
    constructor(public api: API,
                public RequestTokenService: RequestTokenService) {
    }

    @Output() hideWin = new EventEmitter();
    @Output() onWin = new EventEmitter();
    @Input() wayBill: any; //运单号输入
    columns: any[] = [];
    @Input() selectLineInfo;//所有的数据
    loading:boolean;
    data: any;
    msgs: any;//公用提示
    close() {
        this.hideWin.emit();
    }

    initColumns(): void {
        this.columns.push({
            field: 'operator',
            header: '处理人',
        });
        this.columns.push({
            field: 'operateDate',
            header: '处理时间'
        });
        this.columns.push({
            field: 'operateInfo',
            header: '处理意见'
        })
    }

    ngOnInit() {
        this.initColumns();
        this.RequestTokenService.createToken();
    }

    vTaskDetaiReq: any = {};

    //表格加载方法
    load($event) {
        // alert("表格加载");
        //console.info(this.selectLineInfo);
        this.vTaskDetaiReq = {
            taskID: this.selectLineInfo[0].id
        }
        this.api.call("AbnormalTimeController.findTaskInstallAbnormalLogs", {first: 0, rows: 10}, this.vTaskDetaiReq)
            .ok(data => {
                //console.info("返回的数据：{}", data);
                this.data = data.result;
                ////console.log(this.data);
            })
            .fail(data => {
                this.showSuccess("error", "提示", data.error);
            });
    }

    vTaskInstallAbnormalLogReq: any;
    operateInfo: string;

    //时效异常处理保存方法
    save() {
        this.loading = true;
        if (this.operateInfo == undefined || this.operateInfo == "") {
            this.showSuccess("warn", "提示", "请填写处理意见");
        } else {
            this.vTaskInstallAbnormalLogReq = {
                taskId: this.selectLineInfo[0].id,
                operateInfo: this.operateInfo
            }
            this.api.call("AbnormalTimeController.addTaskInstallAbnormalLog", this.vTaskInstallAbnormalLogReq)
                .ok(data => {
                    //console.info("返回的数据：{}", data);
                    this.onWin.emit();
                    this.loading = false;
                })
                .fail(data => {
                    this.showSuccess("error", "提示", "保存失败");
                    this.loading = false;
                });
        }
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
}
