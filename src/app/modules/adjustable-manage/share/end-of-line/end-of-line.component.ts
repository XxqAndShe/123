/**
 * Created by Administrator on 2017/3/29.
 */
import {Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";
import {AreaService} from '../../../../share/app-service/area.service';
@Component({
    selector: 'manage-EndOfLine',
    templateUrl: './end-of-line.component.html',
    styleUrls: [
        './end-of-line.component.css'
    ]
})
export class endOfLineComponent implements OnInit {
    @Output() TrunkEndSure = new EventEmitter();
    @Output() TrunkEndCancl = new EventEmitter();
    @Input() selectLineInfo;//所有的数据
    @Input() taskId: any;
    pickUpTel: string;//提货人电话
    pickUpAddress: string;//提货地址
    pickUpCode: string;//提货验证码
    msgs: any//公共提示
    loading: boolean;
    /*判断提货人电话*/
    itemTelephone: string = '请输入提货人电话';
    areaCode: any;
    logistics: any;
    address: boolean = false;
    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

    constructor(public api: API,
                public RequestTokenService: RequestTokenService,
                public areaService: AreaService,
                private changeDetectorRef: ChangeDetectorRef,) {
    }

    ngOnInit() {
        this.RequestTokenService.createToken();

    }

    /*判断提货验证码*/
    itemsVerificationCode: string = "请输入提货验证码";
    verificationCode: boolean = false;

    VerificationCode(value: string) {
        if (value.length > 0 && value.length <= 40) {
            this.verificationCode = true;
        } else {
            this.showSuccess("warn", "提示", "提货验证码不能为空");
        }
    }

    //确认
    changeSure() {
        this.changeDetectorRef.detectChanges();
        if (!this.logistics) {
            this.showSuccess("warn", "提示", "物流单号不能为空");
            return;
        }
        if (this.pickUpCode == undefined || this.pickUpCode == "") {
            this.showSuccess("warn", "提示", "提货验证码不能为空");
            return
        }
        if (!this.pickUpTel) {
            this.showSuccess("warn", "提示", "提货电话不能为空");
            return;
        }
        if (!this.areaCode) {
            this.showSuccess("warn", "提示", "提货区域不能为空");
            return;
        }
        if (!this.pickUpAddress) {
            this.showSuccess("warn", "提示", "详细地址不能为空");
            return;
        }
        this.loading = true;
        this.api.call('taskInstallController.trunkEnd', {
            taskId: this.taskId,
            pickUpTel: this.pickUpTel,
            pickUpCode: this.pickUpCode,
            pickUpAddress: this.pickUpAddress,
            logisticsBill: this.logistics,
            addrCode: this.areaCode,
            abnoSource: "ips"
        }).ok(data => {
            this.TrunkEndSure.emit();
            this.loading = false;
            // // 干线结束后自动分配师傅
            // this.autoDistributionMaster(this.taskId);

        }).fail(data => {
            this.showSuccess("error", "提示", data.error);
            this.loading = false;
        });
    }

    // /**
    //  * 自动分配师傅
    //  */
    // autoDistributionMaster(taskId){
    //     let endpoint=window['baseUrl']+'/auto-distribution-master';
    //     let params={
    //         "id":taskId
    //     }
    //     this.api.get(endpoint,params).then(()=>{
    //
    //     });
    // }
    //取消
    changeCancle() {
        this.TrunkEndCancl.emit();
        this.pickUpTel = null;
        this.pickUpAddress = null;
        this.pickUpCode = null;
    }

    DeleteSymbol() {
        this.TrunkEndCancl.emit();
        this.pickUpTel = null;
        this.pickUpAddress = null;
        this.pickUpCode = null;
    }

    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
}
