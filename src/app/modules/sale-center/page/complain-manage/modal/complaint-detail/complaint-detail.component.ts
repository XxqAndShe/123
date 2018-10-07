import { API } from 'app/share/lib/api/api';
import { ShowOrHideMaskService } from 'app/share/app-service/show-or-hide-mask.service';
import { VComplaintDealReqVo } from './../../vo/VComplaintDealVo';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
@Component({
    selector: 'complaint-detail',
    templateUrl: './complaint-detail.component.html',
    styleUrls: [
        './complaint-detail.component.css',
        '../modal-common.css'
    ]
})
export class ComplaintDetailComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() rowData;
    @Input() complaintId;
    masterId: string; // 投诉类型id
    msgs: any;
    vComplaintAppeals: any[] = []; // 申诉
    complaintDeal: any = {}; // 投诉处理
    backVisits: any = {}; // 回访
    selectionRow: any;
    showWhichWin: string;
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        this.selectionRow = [this.rowData];
        let depositArea = document.getElementById('complaint_detail_title');
        let depositBox = document.getElementById('complaint-detail');
        this.drag.dragEle(depositArea, depositBox);
        this.load();
        // 设置高度
        let contentHeight = window.innerHeight - 90 + 'px';
        $("#content").css({ "height": contentHeight });
    }
    ngAfterViewInit(): void {
        this.initFancybox();
    }
    close() {
        this.closeWin.emit(false);
    }
    load() {
        // 请求接口参数
        this.api.call("complaintController.findComplaintMaterialDetail"
            , { id: this.complaintId }).ok(json => {
                this.vComplaintAppeals = json.result['vComplaintAppeals'];
                this.complaintDeal = json.result['complaintDeal'];
                this.backVisits = json.result['vComplaintVisitedResponse'];
            }).fail(fail => {
                if (fail.error) {
                    this.showSuccess("warn", "提示", fail.error);
                } else {
                    this.showSuccess("error", "提示", "查询失败！");
                }
            });
    }
    showWin(which) {
        switch (which) {
            case 'handle-complain':
                if (this.selectionRow[0].complaintDealStatus === '已处理'||this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已处理或者否决的投诉不能再处理!");
                    return;
                }
                this.showWhichWin = 'handle-complain';
                break;
            case 'appeal':
                if (this.selectionRow[0].complaintDealStatus !== '已处理') {
                    this.showSuccess("warn", "提示", "只有已处理的投诉才可以申诉!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已否决的投诉不能申诉!");
                    return;
                }
                this.showWhichWin = 'appeal';
                break;
            case 'back-visit':
                if (this.selectionRow[0].complaintDealStatus !== '已处理') {
                    this.showSuccess("warn", "提示", "只有已处理的投诉才可以回访!");
                    return;
                }
                if (this.selectionRow[0].lastVisitdTime) {
                    this.showSuccess("warn", "提示", "已经回访过的投诉不允许重复回访!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已否决的投诉不能回访!");
                    return;
                }
                this.showWhichWin = 'back-visit';
                break;
        }
        this.mask.show();
    }
    closeWin1(event) {
        this.showWhichWin = '';
        // this.mask.hide();
        if (event) {
            this.showSuccess("success", "提示", "操作成功");
            // 更新列表数据
            this.load();
        }
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
