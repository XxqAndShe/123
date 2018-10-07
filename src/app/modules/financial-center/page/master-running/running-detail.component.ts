import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {  ShowOrHideMaskService } from '../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../share/app-service/drag-box.service';
import {MasterFlowDetailRequestVo} from "../../vo/master-flow-detail-request.vo";
import {MasterFlowDetailResponseVo} from "../../vo/master-flow-detail-response.vo";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {DatePipe} from "@angular/common";
import {getDate} from "../../../../share/utils/DateUtil";

@Component({
    selector: 'running-detail',
    templateUrl: './running-detail.component.html',
    styleUrls: ['./running-detail.component.css'],
    animations: [
        modalAnimation
    ]
})
export class RunningDetailComponent implements OnInit{
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    pageRow=8;
    pageRows=[5,10];
    /*公共弹窗提示*/
    msgs:any;
    loading:boolean;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    //弹框拖拽
    constructor(
        public mask:ShowOrHideMaskService,
        public drag:DragBoxService,
        public datePickerService: DatepickerService,
        public api:API,
        public  datePipe:DatePipe
    ){

    }

    //师傅流水详情requestVo
     masterFlowDetailRequestVo:MasterFlowDetailRequestVo;

    //师傅流水详情responseVo
    masterFlowDetailResponseVo:MasterFlowDetailResponseVo[];

    //接受师傅账号
    @Input() masterAccount:string;

    ngOnInit(){
        let depositArea=document.getElementById('deposit_apply_title');
        let depositBox=document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea,depositBox);

        this.masterFlowDetailRequestVo = new MasterFlowDetailRequestVo();
        // this.masterFlowDetailRequestVo.signTime = this.dateText1;
        // this.masterFlowDetailRequestVo.endTime = this.dateText2;
        this.masterFlowDetailResponseVo = [];
        this.initColumns();
        this.masterFlowDetailRequestVo.withdrawStatus = 'All';
        this.masterFlowDetailRequestVo.dateType = 'ALL';
        this.doQuery();
    }
    //表单组件
    columns:any[]=[];
    data:any;
    selections:any;

    initColumns(): void {
        this.columns.push({
            field: "id",
            header: "ID",
            sortable: true,
            filter: true,
            hidden: true
        });
        this.columns.push({
            field: "masterName",
            header: "师傅姓名",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "masterAccount",
            header: "师傅账号",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "waybillId",
            header: "任务号",
            sortable: true,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "taskType",
            header: "任务类型",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "taskMoney",
            header: "任务金额",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "feeDetail",
            header: "费用明细",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "referCost",
            header: "参考成本",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "differential",
            header: "差价",
            sortable: true,
            filter: true,
            isWarn: true,
        });
        this.columns.push({
          field:"flowCreateDate",
          header:"流水生成时间",
          sortable:false,
          filter:true
        });
        this.columns.push({
            field: "signTime",
            header: "签收时间",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "withdrawStatus",
            header: "提现状态",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "applyTime",
            header: "申请时间",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "auditTime",
            header: "审批时间",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "auditPerson",
            header: "审批人",
            sortable: true,
            filter: true
        });
       /* this.columns.push({
            field: "",
            header: "打款人",
            sortable: true,
            filter: true
        });*/
        this.columns.push({
            field: "wdno",
            header: "提现流水号",
            sortable: true,
            filter: true
        });



    }

    // 日历组件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        'width': 130+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";

    //隐藏该弹框
    @Output() closeWin = new EventEmitter<boolean>();
    // 隐藏提现申请弹框
    hideWin(){
        this.mask.hide();
        this.closeWin.emit(false);//暴露值给父组件
    }

    // 师傅流水详情查询
    load(page):any{
        this.masterFlowDetailRequestVo.masterAccount=this.masterAccount;
        if (this.masterFlowDetailRequestVo.endTime != null && this.masterFlowDetailRequestVo.endTime != "") {
            let endTime = this.datePipe.transform(this.masterFlowDetailRequestVo.endTime, 'yyyy-MM-dd 23:59:59');
            this.masterFlowDetailRequestVo.endTime = getDate(endTime);
        }
        this.api.call("FinancialCenterController.masterFlowDetail", page, this.masterFlowDetailRequestVo).ok(json => {
            this.data = json.result;
            this.loading = false;
        }).fail((err)=>{
            this.loading = false;
        });
    }
    /**
     * 导出
     */
    exportCSV($event){
        this.api.call('FinancialCenterController.masterFlowDetail', {
            first:0,
            rows:99999999
        }, this.masterFlowDetailRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    doQuery():any{
        this.loading = true;
        this.load({
            first: 0,
            rows: 10
        });
    }

    reset():any{
        this.masterFlowDetailRequestVo=new MasterFlowDetailRequestVo();
        this.masterFlowDetailRequestVo.withdrawStatus = 'All';
        this.masterFlowDetailRequestVo.dateType = 'ALL';
    }

    cellClick(cell){
        if (cell.field === 'waybillId'){
            this.selections = cell.row;
            if(cell.row.taskType === '维修任务'){
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if(cell.row.taskType === '返货任务'){
                let that = this;
                this.isModuleDisplayArr[1] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[1] = true;
                }, 0);
                this.curModalIndex = 1;
            }
            else if(cell.row.taskType === '调度任务'){
                let that = this;
                this.isModuleDisplayArr[2] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[2] = true;
                }, 0);
                this.curModalIndex = 2;
            }else {
                this.showSuccess("warn","提示","该记录无法判断任务类型！");
            }
        }
    }
    closeDetailModal(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
    }
}
