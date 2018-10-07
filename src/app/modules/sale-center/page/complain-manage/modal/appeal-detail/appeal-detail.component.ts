import { API } from 'app/share/lib/api/api';
import { ShowOrHideMaskService } from 'app/share/app-service/show-or-hide-mask.service';
import { VComplaintDealReqVo } from './../../vo/VComplaintDealVo';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
@Component({
    selector: 'appeal-detail',
    templateUrl: './appeal-detail.component.html',
    styleUrls: [
        './appeal-detail.component.css',
        '../modal-common.css'
    ]
})
export class AppealDetailComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() rowData;
    @Input() complaintId;
    masterId: string; // 投诉类型id
    msgs: any;
    vComplaintAppeals: any[] = []; // 申诉
    complaintDeal: any = {}; // 投诉处理
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        let depositArea = document.getElementById('appeal_deatil_title');
        let depositBox = document.getElementById('appeal_deatil');
        this.drag.dragEle(depositArea, depositBox);
        this.load();
        // 设置高度
        let contentHeight = window.innerHeight - 90 + 'px';
        $("#content").css({"height": contentHeight});
    }
    ngAfterViewInit(): void {
        this.initFancybox();
    }
    close() {
        this.closeWin.emit(false);
    }
    load() {
        // 请求接口参数
        this.api.call("complaintController.complainDetail", { id: this.complaintId }).ok(json => {
            this.vComplaintAppeals = json.result['vComplaintAppeals'];
            this.complaintDeal = json.result['complaintDeal'];
        }).fail(fail => {
            if (fail.error) {
                this.showSuccess("warn", "提示", fail.error);
            } else {
                this.showSuccess("error", "提示", "查询失败！");
            }
        });
    }

    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
}
