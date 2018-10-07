import { VComplaintAppealReqVo } from './../../vo/VComplaintAppealVo';
import { API } from 'app/share/lib/api/api';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
import { ShowOrHideMaskService } from "app/share/app-service/show-or-hide-mask.service";
@Component({
    selector: 'appeal',
    templateUrl: './appeal.component.html',
    styleUrls: [
        './appeal.component.css',
        '../modal-common.css'
    ]
})
export class AppealComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() selection;
    msgs: any;
    taskTitle: string;
    // 数据绑定vo
    vComplaintAppealReqVo: VComplaintAppealReqVo = new VComplaintAppealReqVo();
    loading: boolean = false;
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        this.taskTitle = _.clone(this.selection[0].taskTitle);
        this.vComplaintAppealReqVo.complaintId = _.clone(this.selection[0].id);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
    }
    close() {
        this.closeWin.emit(false);
    }
    save() {
        // 判断必填项是否为空
        if (!this.vComplaintAppealReqVo.appealName) {
            this.showSuccess("warn", "提示", "申诉人不能为空!");
            return;
        }
        if (!this.vComplaintAppealReqVo.appealContent) {
            this.showSuccess("warn", "提示", "申诉内容不能为空!");
            return;
        }
        if (!this.vComplaintAppealReqVo.complaintResult) {
            this.showSuccess("warn", "提示", "投诉结果不能为空!");
            return;
        }
        this.loading = true;
        // 请求接口
        this.api.call("ComplaintController.appealComplaint", this.vComplaintAppealReqVo).ok(json => {
            // 保存成功
            this.loading = false;
            this.closeWin.emit(true);
        }).fail(fail => {
            if (fail.error) {
                this.showSuccess("error", "提示",fail.error);
            } else {
                this.showSuccess("error", "提示","保存失败!");
            }
            this.loading = false;
        })
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
}
