import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../../share/app-service/show-or-hide-mask.service';
import {DragBoxService} from '../../../../../share/app-service/drag-box.service';
import {WaybillAbnormalRequestVo} from "../vo/waybill-abnormal-request.vo";
import {AbnormalDutyRequestVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-duty-request.vo";
import {BasicSettingService} from "../../../../base-set/page/basic-manage/service/basic-setting.service";
import {ExceptionDataService} from "../../../../base-set/page/basic-manage/service/exception-data.service";
import {AbnormalTypeRequestVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
import {API} from "../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../share/app-service/request-token.service";
@Component({
    selector: 'accepted',
    templateUrl: './accepted.component.html',
    styleUrls: [
        './accepted.component.css'
    ]
})

export class AcceptedComponent implements OnInit {
    @Input() boxState: string;//控制弹框盒显示隐藏
    msgs: any;//公共提示
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService,
                public basicSettingService: BasicSettingService,
                public exceptionDataService: ExceptionDataService,
                public api: API,
                public requestTokenService: RequestTokenService) {
    }

    ngOnInit() {
        // let depositArea01 = document.getElementById('deposit_apply_title01');
        // let depositBox01= document.getElementById('deposit_apply01');
        // this.drag.dragEle(depositArea01, depositBox01);
        // let depositArea = document.getElementById('deposit_apply_title');
        // let depositBox = document.getElementById('deposit_apply');
        // this.drag.dragEle(depositArea, depositBox);
        this.requestTokenService.createToken();
    }

    @Input()
    selectedWaybillAbnormal: any;
    @Output() hideWin = new EventEmitter<boolean>();
    @Output() confirm = new EventEmitter();

    hideWindow() {
        this.hideWin.emit(false);
    }

    showSuccess(success, dialog) {
        success.style.display = "block";
        dialog.style.display = "none";
    }

    hideSuccess(success, dialog) {
        success.style.display = "none";
        dialog.style.display = "block";
        this.hideWin.emit(false);
    }

    // @Output() closeModal = new EventEmitter<boolean>();
    //
    // close() {
    //     this.closeModal.emit(false);
    // }
    public waybillAbnormalRequestVo: WaybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
    // 异常类型
    public abnormalTypeRequestVo: AbnormalTypeRequestVo;
    data: any[] = [];

    accepted() {
        ////console.log(this.selectedWaybillAbnormal);
        if (this.selectedWaybillAbnormal == null) {
            this.showItems("warn", "提示", "请选择要受理的异常");
            return;
        }
        // this.waybillAbnormalRequestVo.id=this.selectedWaybillAbnormal.id;
        if (this.selectedWaybillAbnormal.accepted) {
            this.showItems("warn", "提示", "请勿重复受理异常");
        } else {
            // ////console.log(this.waybillAbnormalRequestVo);
            this.waybillAbnormalRequestVo.id = this.selectedWaybillAbnormal.id;
            this.api.call("AbnormalController.abnormalAccepted", this.waybillAbnormalRequestVo).ok(data => {
                // this.data = data.result;
                // ////console.log(data)
                this.selectedWaybillAbnormal.accepted = true;
                this.confirm.emit();
                // alert("异常受理成功");
            })
                .fail(data => {
                    this.showItems("error", "提示", data.error)
                });
        }
    }

    /*公共弹窗提示*/
    showItems(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}

