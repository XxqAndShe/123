import { API } from 'app/share/lib/api/api';
import { ShowOrHideMaskService } from 'app/share/app-service/show-or-hide-mask.service';
import { VComplaintDealReqVo } from './../../vo/VComplaintDealVo';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { DragBoxService } from "../../../../../../share/app-service/drag-box.service";
import {VServiceRemedyRspVo} from "../../vo/VServiceRemedyRspVo";
@Component({
    selector: 'handle-complain',
    templateUrl: './handle-complain.component.html',
    styleUrls: [
        './handle-complain.component.css',
        '../modal-common.css'
    ]
})
export class HandleComplainComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Input() selection;
    msgs: any;
    // 数据绑定vo
    vComplaintDealReqVo: VComplaintDealReqVo = new VComplaintDealReqVo();
    loading: boolean = false;
    masterId: string; // 投诉类型id
    complaintDuty: string; // 责任方名称
    dutyNames: any[] = []; // 责任人
    showTable: boolean = true;
    vServiceRemedyRspVo = new VServiceRemedyRspVo();//是否服务补救
    constructor(
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public api: API
    ) { }
    ngOnInit() {
        this.vComplaintDealReqVo.complaintId = _.clone(this.selection[0].id);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
        // 请求之前的数据
        this.load();
    }
    ngAfterViewInit(): void {
        this.initFancybox();
    }
    load() {
        this.api.call("ComplaintController.getDeal", { id: this.selection[0].id }).ok(json => {
            this.vComplaintDealReqVo.complaintDealStatus = json.result.complaintDealStatus;
            this.complaintDuty = json.result.duty;
            this.dutyNames = [{ subject: json.result.dutyName }];
            this.vComplaintDealReqVo.dutyName = this.dutyNames[0]['subject'];
            this.vComplaintDealReqVo.dutyMobile = json.result.dutyMobile;
            this.vComplaintDealReqVo.penaltyFee = json.result.penaltyFee;
            this.vComplaintDealReqVo.remark = json.result.remark;
            this.vComplaintDealReqVo.complaintResult = json.result.complaintResult;
            // 还少一个投诉类型的回显
            this.vComplaintDealReqVo.masterId = json.result.masterId;
            this.vComplaintDealReqVo.hasCompensate = json.result.hasCompensate;
            this.vComplaintDealReqVo.compensateFee = json.result.compensateFee;
            this.vComplaintDealReqVo.compensateRemark = json.result.compensateRemark;
            if(this.vComplaintDealReqVo.hasCompensate === false){
                this.vServiceRemedyRspVo.isService = 'false';
            }else{
                this.vServiceRemedyRspVo.isService = 'true';
            }
        }).fail(fail => {
            if (fail.error) {
                this.showSuccess("error", "提示", fail.error);
            } else {
                this.showSuccess("error", "提示", "查询失败!");
            }
            this.loading = false;
        })
    }
    close() {
        this.closeWin.emit(false);
    }
    /**
     * 去掉投诉类型的时候,需要把带出来的数据也清空
     */
    clear() {
        this.complaintDuty = '';
        this.dutyNames = [];
        this.vComplaintDealReqVo.dutyName = '';
        this.vComplaintDealReqVo.penaltyFee = '';
    }
    save() {
        // 判断必填项
        if (!this.vComplaintDealReqVo.masterId && this.vComplaintDealReqVo.complaintDealStatus !== 'veto') {
            this.showSuccess("warn", "提示", "投诉类型未选择或不正确!");
            return;
        }
        if (!this.vComplaintDealReqVo.dutyName && this.vComplaintDealReqVo.complaintDealStatus !== 'veto') {
            this.showSuccess("warn", "提示", "责任人不能为空!");
            return;
        }
        if (this.vComplaintDealReqVo.complaintDealStatus === 'completed' && !this.vComplaintDealReqVo.complaintResult) {
            this.showSuccess("warn", "提示", "已处理必须选择投诉结果!");
            return;
        }
        if(this.vServiceRemedyRspVo.isService === 'true'){
            this.vComplaintDealReqVo.hasCompensate = true;
        }else{
            this.vComplaintDealReqVo.hasCompensate = false;
        }
        if(this.vComplaintDealReqVo.hasCompensate && !this.vComplaintDealReqVo.compensateFee && this.vComplaintDealReqVo.compensateFee !== 0){
            this.showSuccess("warn", "提示", "服务补救选是时，补偿金额必填!");
            return;
        }
        if (this.vComplaintDealReqVo.complaintDealStatus === 'veto') {
            this.vComplaintDealReqVo.complaintResult = "nopass";
        }
        if(this.vServiceRemedyRspVo.isService === 'false'){
            this.vComplaintDealReqVo.compensateFee = null;
            this.vComplaintDealReqVo.compensateRemark = '';
        }
        this.loading = true;
        // 请求接口
        this.api.call("ComplaintController.dealComplaint", this.vComplaintDealReqVo).ok(json => {
            // 保存成功
            this.loading = false;
            this.closeWin.emit(true);
        }).fail(fail => {
            if (fail.error) {
                this.showSuccess("error", "提示", fail.error);
            } else {
                this.showSuccess("error", "提示", "保存失败!");
            }
            this.loading = false;
        })
    }
    /**
     * 根据责任方查询责任人
     */
    queryDutyName() {
        this.api.call("ComplaintController.listDutySubject", {
            complaintDuty: this.vComplaintDealReqVo.complaintDuty,
            complaintId: this.vComplaintDealReqVo.complaintId
        }).ok(json => {
            this.dutyNames = json.result;
            this.vComplaintDealReqVo.dutyName = this.dutyNames[0]['subject'];
        }).fail(fail => {
        });
    }
    onCatalogChange(event) {
        this.vComplaintDealReqVo.penaltyFee = '';
        if (event.level === 0) {
            this.vComplaintDealReqVo.complaintDuty = event.value;
            this.complaintDuty = event.label;
            this.queryDutyName();
        }
        if (event.level === 2 || event.level === undefined) {
            this.vComplaintDealReqVo.masterId = event.id;
            // 请求金额
            this.api.call("ComplaintController.getMaterial", {
                id: event.id
            }).ok(json => {
                this.vComplaintDealReqVo.penaltyFee = json.result.penaltyFee;
            }).fail(fail => {
            });
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
