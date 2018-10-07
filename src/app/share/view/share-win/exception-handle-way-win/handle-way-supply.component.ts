import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { API } from "../../../../share/lib/api/api";
import { TaskSupplyDetail } from "./vo/taskSupplyDetail.vo";
import { WaybillAbnormalRequestVo } from "../../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import { ConfirmationService } from 'primeng/primeng';
import { DragBoxService } from "../../../app-service/drag-box.service";

@Component({
    selector: 'handle-way-supply',
    templateUrl: './handle-way-supply.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class HandleWaySupplyComponent implements OnInit {
    constructor(public api: API, public confirmationService: ConfirmationService
        , public drag: DragBoxService) { }
    //taskPartType:string;
    @Output() closeWin = new EventEmitter();
    @Output() saveDialog = new EventEmitter();
    //goodArr=[0];
    //goodArr:TaskSupplyDetail[]=[];//任务补件明细
    @Input() selectedAbnormal: any;
    @Input() selectRow;
    abnormal: WaybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
    //assumeFee:any;
    //abnormalDuty:any;
    //remark:any;
    msgs: any[] = [];

    i = 0;
    //临时存储货物数量与体积
    suplyNum=[];
    suplyVol=[];

    ngOnInit(): void {
        this.supplyResult.taskPartType = 'GAN_ZHI_BU_JIAN';
        ////console.log("1");
        ////console.log(this.selectedAbnormal);
        Object.assign(this.abnormal, this.selectedAbnormal);
        ////console.log("2");
        //console.log(this.selectedAbnormal.supplyData);
        if (this.selectedAbnormal.supplyData) {
            //console.log("get");
            Object.assign(this.supplyResult, this.selectedAbnormal.supplyData);
        }
        if (this.supplyResult.goodArr.length < 1) {
            //console.log("push");
            let taskSupplyDetail = new TaskSupplyDetail();
            this.supplyResult.goodArr.push(taskSupplyDetail);
        }
        let box = document.getElementById("supply_tank");
        let moveArea = document.getElementById("supply_top");
        this.drag.dragEle(moveArea, box);
    }

    save() {
        // this.api.call("AbnormalController.addTaskPart",{
        //     id : this.abnormal.id,
        //     taskPartType : this.supplyResult.taskPartType,
        //     taskPartDetails : this.supplyResult.goodArr,
        //     assumeFee : this.supplyResult.assumeFee,
        //     responsiber :this.supplyResult.abnormalDuty,
        //     remark : this.supplyResult.remark
        // }).ok(json=>{
        //     ////console.log(json.result);
        //     this.confirmationService.confirm({
        //         message: '补件任务添加成功!',
        //         header: '提示',
        //         accept: () => {
        //             this.closeWin.emit();
        //         }
        //     });
        //     //alert("补件任务添加成功!");
        //     this.saveDialog.emit();
        //
        // }).fail(err=>{
        //
        // });
        //
        // if(window.sessionStorage){
        //     sessionStorage.setItem("supplyData",JSON.stringify(this.supplyResult));
        // }
        // let obj={
        //     responsiber : this.supplyResult.abnormalDuty.split(',')[1] + '(补件)',
        //     handleWay:'补件'
        // }
        let reg1=/[\-.]/;
        let reg2=/[\-]/;
        for (let i = 0; i < this.supplyResult.goodArr.length; ++i) {
            let good = this.supplyResult.goodArr;
            if (!good[i].partsName) {
                this.showSuccess("warn", "提示", "请填写补件品名");
                return;
            }
            if (!good[i].pieces) {
                this.showSuccess("warn", "提示", "请填写补件数量");
                return;
            }
            if (!good[i].volume) {
                this.showSuccess("warn", "提示", "请填写补件体积");
                return;
            }
            if (+good[i].pieces > 10000 || +good[i].volume > 10000) {
                this.showSuccess("warn", "提示", "补件数量或体积不能大于10000！");
                return;
            }
        }
        for(let i=0; i<this.suplyNum.length; i++){
            if(reg1.test(this.suplyNum[i])){
                this.showSuccess("warn", "提示", "补件数量必须是正整数！");
                return;
            }
        }
        for(let i=0; i<this.suplyVol.length; i++){
            if(reg2.test(this.suplyVol[i])){
                this.showSuccess("warn", "提示", "货物体积不能为负！");
                return;
            }
        }
        if (!this.supplyResult.taskPartType) {
            this.showSuccess("warn", "提示", "请选择补件类型！");
            return;
        }
        if (!this.supplyResult.abnormalDuty) {
            this.showSuccess("warn", "提示", "请选择责任方");
            return;
        }
        this.supplyResult.id = this.selectedAbnormal.abnormal.id;
        let beforeFee: number = this.selectedAbnormal.supplyData.assumeFee || 0;
        Object.assign(this.selectedAbnormal.supplyData, this.supplyResult);
        this.selectedAbnormal.supplyData.taskPartDetails = this.supplyResult.goodArr;
        this.selectedAbnormal.supplyData.responsiber = this.supplyResult.abnormalDuty;

        let handleWays: string[] = [];
        if (this.selectedAbnormal.abnormal.handleWay) {
            handleWays = this.selectedAbnormal.abnormal.handleWay.split(',');
        }
        if (_.indexOf(handleWays, "补件") == -1) {
            handleWays.push("补件");
            this.selectedAbnormal.abnormal.handleWay = handleWays.join(',');
        }

        // if(this.selectedAbnormal.abnormal.handleWay) {
        //     this.selectedAbnormal.abnormal.handleWay = this.selectedAbnormal.abnormal.handleWay.replace("补件,", "");
        // }
        // this.selectedAbnormal.abnormal.handleWay = (this.selectedAbnormal.abnormal.handleWay || "") + "补件,";

       if (this.dutyLabel) {
            this.selectedAbnormal.supplyData.dutyLabel=this.dutyLabel;
            this.selectedAbnormal.abnormal.abnormalDutyName = (this.selectedAbnormal.abnormal.abnormalDutyName || "") + this.dutyLabel + ",";
        }
        this.selectedAbnormal.abnormal.assumeFee = Number(this.selectedAbnormal.abnormal.assumeFee || 0) + Number(this.supplyResult.assumeFee || 0) - Number(beforeFee);
        this.saveDialog.emit();
    }

    close() {
        this.closeWin.emit();
    }

    addGood() {
        let taskSupplyDetail = new TaskSupplyDetail();
        this.supplyResult.goodArr.push(taskSupplyDetail);
    }

    removeGood(i) {
        if (this.supplyResult.goodArr.length > 1) {
            this.supplyResult.goodArr.splice(i, 1);
        }
    }

    showMsg(msg) {
        this.msgs.push({ severity: 'success', summary: '提示', detail: (msg ? msg : '测试！') });
    }

    onChangeHandler(event) {
        //console.info('onChangeHandler',event)
        this.showMsg('你选中了：' + event.value);
        this.supplyResult.abnormalDuty = event.value;
        setTimeout(() => {
            this.msgs = [];
        }, 3000)
    }

    //用于存到sessionStorage的对象
    supplyResult: any = {
        id: '',
        taskPartType: '',
        goodArr: [],
        assumeFee: '',
        abnormalDuty: '',
        responsiber: '',
        remark: '',
        LStorageHandleWay: "supply"
    }
    dutyLabel: string = "";
    onDutyChange(event: any) {
        let selected = event['selected'][0];
        if(this.selectRow.taskType === '自提' && selected['label'] === '服务商'){
            this.showSuccess("warn", "提示", "自提任务不能选择服务商！");
            this.supplyResult.abnormalDuty = '';
            return;
        }
        this.dutyLabel = _.map(event.selected, 'label').toString();
    }

    /*公共弹窗提示*/
    // msgs:any;
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({ severity: severity, summary: summary, detail: detail });
    }
    validateHandle(who,event,i){
        switch (who){
            case 'vol':
                this.suplyVol[i]=event.target.value;
                break;
            case 'num':
                this.suplyNum[i]=event.target.value;
                break;
        }
    }

    /**
     * 限制正数并小于10000
     * @param val
     */
    onlyPositive(val){
        if(val){
            this.supplyResult.assumeFee = val.toString().replace(/[^\d.]/g,'');
            if(val > 10000){
                this.supplyResult.assumeFee = 10000;
            }
        }
    }
}
