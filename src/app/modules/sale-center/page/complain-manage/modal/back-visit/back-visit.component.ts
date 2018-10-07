import { VComplaintVisitedReqVo } from './../../vo/VComplaintVisitedVo';
import { API } from 'app/share/lib/api/api';
import { ShowOrHideMaskService } from 'app/share/app-service/show-or-hide-mask.service';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
import { SelectItem } from "primeng/primeng";

@Component({
    selector: 'back-visit',
    templateUrl: './back-visit.component.html',
    styleUrls: [
        './back-visit.component.css',
        '../modal-common.css'
    ]
})

export class BackVisitComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() selection;
    types: SelectItem[] = [];
    backSuccess: SelectItem[] = [];
    msgs: any;
    taskTitle: string;
    // 数据绑定vo
    vComplaintVisitedReqVo: VComplaintVisitedReqVo = new VComplaintVisitedReqVo();
    loading: boolean = false;
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        this.types.push({ label: '满意', value: 'very' }, { label: '不满意', value: 'no' });
        this.backSuccess.push({ label: '是', value: 'YES' }, { label: '否', value: 'NO' });
        this.taskTitle = _.clone(this.selection[0].taskTitle);
        this.vComplaintVisitedReqVo.complaintId = _.clone(this.selection[0].id);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
    }
    close() {
        this.closeWin.emit(false);
    }
    save() {
        // 判断必填项
        if(!this.vComplaintVisitedReqVo.complaintVisitedResult){
            this.showSuccess("warn", "提示", "请选择回访是否成功!");
            return;
        }
        if (this.vComplaintVisitedReqVo.complaintVisitedResult === 'YES'
            && !this.vComplaintVisitedReqVo.CmplaintDealSatisfaction) {
            this.showSuccess("warn", "提示", "请选择对投诉结果的满意度!");
            return;
        }
        this.loading = true;
        // 请求接口
        this.api.call("ComplaintController.visitedComplaint", this.vComplaintVisitedReqVo).ok(json => {
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
