import {Component, EventEmitter, Output, OnInit, Input} from "@angular/core";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "../../../../../../share/app-service/drag-box.service";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {API} from "../../../../../../share/lib/api/api";
import {DatePipe} from "@angular/common";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector: 'trace-time',
    templateUrl: './trace-time.component.html',
    styleUrls: [
        './trace-time.component.css'
    ]
})

export class TraceTimeComponent implements OnInit {
    zh: any = this.datepickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    minDateValue;//限制日期输入不能早于当天
    constructor(public api: API,
                public mask: ShowOrHideMaskService,
                public drag: DragBoxService,
                public datepickerService: DatepickerService,
                public datepipe: DatePipe,
                public requestTokenService: RequestTokenService
    ) {
    }

    ngOnInit() {
        this.minDateValue = new Date();
        let depositArea01 = document.getElementById('deposit_apply_title01');
        let depositBox01 = document.getElementById('deposit_apply01');
        this.drag.dragEle(depositArea01, depositBox01);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
        this.requestTokenService.createToken();
    }

    @Output() hideWin = new EventEmitter<boolean>();//取消
    @Output() hideSave = new EventEmitter<boolean>();//保存
    msgs:any;
    showError(severity:string,summary:string,detail:string) {
    this.msgs = [{severity:severity, summary:summary, detail:detail}];
}
    hideWindow(dialog: any) {
        this.hideWin.emit(false);
    }

    //保存
    showSuccess(success, dialog) {
        if (!this.reservationTime) {
            this.showError("warn","提示","请选择预约时间");
            return;
        }
        let time = this.datepipe.transform(this.reservationTime, "yyyy-MM-dd HH:mm:ss");
        this.api.call("AftermarketTaskController.reservation", {
            taskId: this.content.id,
            appointmentTime: time
        }).ok(json => {
            this.hideSave.emit();
        }).fail((err) => {
            this.msgHint = err.error;
        });
        success.style.display = "block";
        dialog.style.display = "none";
    }

    hideSuccess(success, dialog) {
        success.style.display = "none";
        dialog.style.display = "block";
        this.hideWin.emit(false);
    }

    msgHint: string;    //预约响应提示
    reservationTime: Date;
    @Input() content: any;
}
