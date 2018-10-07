import { API } from 'app/share/lib/api/api';
import { ShowOrHideMaskService } from 'app/share/app-service/show-or-hide-mask.service';
import { VComplaintSaveReqVo } from './../../vo/VComplaintSaveReqVo';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
@Component({
    selector: 'add-complain',
    templateUrl: './add-complain.component.html',
    styleUrls: [
        './add-complain.component.css',
        '../modal-common.css'
    ]
})
export class AddComplainComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() selection;
    @Input() addOrChange;
    msgs: any;
    // 数据绑定vo
    vComplaintSaveReqVo: VComplaintSaveReqVo = new VComplaintSaveReqVo();
    loading: boolean = false;
    // picUrl: any[] =[];
    picUrl: any[] = [];
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        // 表示修改
        if (this.addOrChange) {
            this.vComplaintSaveReqVo = _.clone(this.selection[0]);
            this.vComplaintSaveReqVo.complaintSource =  this.selection[0].complaintSourceEnum;
            this.vComplaintSaveReqVo.fileInfos = _.map(this.selection[0].picInfos, 'id');
            this.picUrl =  _.clone(this.selection[0].picInfos);
        }
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
    }
    close() {
        this.closeWin.emit(false);
    }
    save() {
        // 判断必填项是否为空
        if (!this.vComplaintSaveReqVo.taskTitle) {
            this.showSuccess("warn", "提示", "任务号不能为空!");
            return;
        }
        if (!this.vComplaintSaveReqVo.complainantName) {
            this.showSuccess("warn", "提示", "投诉人不能为空!");
            return;
        }
        if (!this.vComplaintSaveReqVo.complaintSource) {
            this.showSuccess("warn", "提示", "投诉来源不能为空!");
            return;
        }
        if (!this.vComplaintSaveReqVo.complaintContent) {
            this.showSuccess("warn", "提示", "投诉内容不能为空!");
            return;
        }
        this.loading = true;
        // 请求接口
        this.api.call("ComplaintController.saveComplaint", this.vComplaintSaveReqVo).ok(json => {
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
