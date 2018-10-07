import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "../../../lib/api/api";
import {WaybillAbnormalRequestVo} from "../../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import {DragBoxService} from "../../../app-service/drag-box.service";

@Component({
    selector: 'handle-way-veto',
    templateUrl: './handle-way-veto.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class HandleWayVetoComponent implements OnInit{
    @Output() closeWin = new EventEmitter();
    @Output() saveDialog = new EventEmitter();
    @Input() selectedAbnormal: any;
    abnormal: WaybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
    constructor(public api: API,public drag: DragBoxService){
    }
    ngOnInit(): void {
        // console.debug(this.selectedAbnormal);
        // Object.assign(this.abnormal, this.selectedAbnormal);
        if(this.selectedAbnormal.vetoData) {
            // //console.log('get');
            Object.assign(this.vetoResult, this.selectedAbnormal.vetoData);
        }
        let box = document.getElementById("veto_tank");
        let moveArea = document.getElementById("veto_top");
        this.drag.dragEle(moveArea, box);
    }
    save(){
        // this.abnormal.id = this.selectedAbnormal.id;
        // this.abnormal.rejected = true;
        // this.abnormal.rejectReason = this.vetoResult.rejectReason;
        // this.api.call("AbnormalController.abnormalReject", this.abnormal).ok(data => {
        //     this.selectedAbnormal.rejected = true;
        //     this.selectedAbnormal.rejectReason = this.vetoResult.rejectReason;
        //     alert(data.result.message);
        // }).fail(data => {
        //     alert(data.error);
        // });

        //保存数据到会话
        // if(window.sessionStorage){
        //     sessionStorage.setItem("vetoData", JSON.stringify(this.vetoResult));
        // }
        if(!this.vetoResult.rejectReason){
            this.showSuccess("warn","提示","请填写驳回原因！");
            return;
        }
        this.vetoResult.id = this.selectedAbnormal.abnormal.id;
        Object.assign(this.selectedAbnormal.vetoData, this.vetoResult);
        this.selectedAbnormal.abnormal.handleWay = "否决,";
        this.selectedAbnormal.abnormal.abnormalDutyName = "";
        this.selectedAbnormal.abnormal.assumeFee = "";
        this.saveDialog.emit();//用于处理过后按钮变色，勿删勿改
    }
    close(){
        this.closeWin.emit();
    }

    vetoResult={
        id:'',
        rejectReason: '',
        LStorageHandleWay: "veto"
    }
    /*公共弹窗提示*/
    msgs: any;
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }

}
