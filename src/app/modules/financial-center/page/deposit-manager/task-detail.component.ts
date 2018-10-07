import {Component, EventEmitter, Output,OnInit, Input} from '@angular/core';
import {WithdrawAuditResponseVo} from "../../vo/withdraw-audit-response.vo";
import { AreaService } from "../../../../share/app-service/area.service";
import { DatepickerService } from "../../../../share/app-service/datepicker.service";
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";

@Component({
    selector: 'task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.css'],
    animations: [
        modalAnimation
    ]
})
export class TaskDetailComponent implements OnInit {
    goodsShow:any;
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    selections;
    columns: any[] = [];
    data:any;
    selectionRow:any[] = [];
    isSelect:boolean;
    cellOverEvent: any;
    taskAmountDetail: any=[
        {"trackNumber": "1zt2321312", "costType": "安装费", "amount": "50", "operator": "张三"},
        {"trackNumber": "1zt2321312", "costType": "支线费", "amount": "100", "operator": "张三"},
        {"trackNumber": "1zt2321312-qt", "costType": "空跑费", "amount": "50", "operator": "李四"},
        {"trackNumber": "1zt2321312-qt", "costType": "服务商扣款", "amount": "-50", "operator": "李四"},
    ];
    /*公共弹窗提示*/
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    @Output() closeModal = new EventEmitter<boolean>();

    @Input() withdrawAuditResponseVo:WithdrawAuditResponseVo[];

    @Input() withdrawAuditRequestVo:WithdrawAuditResponseVo;

    constructor(public datePickerService: DatepickerService,
                public areaService: AreaService,public api:API){}

    ngOnInit() {
        this.initColumns();
        this.doQuery();
    }
    initColumns(): void {
        this.columns.push(
            {
                field: "id",
                header: "ID",
                sortable: true,
                filter: true,
                hidden: true
            },
            {
                field: "waybillId",
                header: "运单号",
                sortable: true,
                filter: true,
                link: true
            },
            {
                field: "taskType",
                header: "任务类型",
                sortable: true,
                filter: true
            },
            {
                field: "productNames",
                header: "品名",
                sortable: true,
                filter: true
            },
            {
                field: "consignee",
                header: "收货人",
                sortable: true,
                filter: true
            },
            {
                field: "consigneeAddr",
                header: "收货地址",
                sortable: true,
                filter: true
            },
            {
                field: "taskAmount",
                header: "金额",
                sortable: true,
                filter: true
            },
            {
                field: "feeDetail",
                header: "费用明细",
                sortable: true,
                filter: true
            },
            {
                field: "referCost",
                header: "参考成本",
                sortable: true,
                filter: true
            },
            {
                field: "differential",
                header: "差价",
                sortable: true,
                filter: true,
                isWarn: true
            },
            {
                field: "signTime",
                header: "签收时间",
                sortable: true,
                filter: true
            }
        );
    }

    hideModal(){
        this.closeModal.emit(false);
    }

    data1:any;
    public load(page): void {
        this.api.call("FinancialCenterController.withdrawalAuditQuery", page, this.withdrawAuditRequestVo).ok(json => {
            if(json.result.content==null || json.result.content.length==0){
                this.initWtihdrawAuditResponse();
                this.withdrawAuditResponseVo;
            }else{
                this.withdrawAuditResponseVo = json.result.content;
            }
            this.data=json.result;
        }).fail((err)=>{
        });
    }
    exportCSV($event){

        this.api.call('FinancialCenterController.withdrawalAuditQuery', {
            first:0,
            rows:99999999
        }, this.withdrawAuditRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }


    //日历插件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        // 'width': 95+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";

    dataHandler:Function = this.areaService.selectBoxHandler();

    initWtihdrawAuditResponse():any {
        this.withdrawAuditResponseVo = [
            {
                realName: "",
                mobile: "",
                withdrawAmount: "",
                applyTime: "",
                userAccount: "",
                bankAccount: "",
                accountName: "",
                bankName: "",
                subBranchName: "",
                waybillId: "",
                serviceType: "",
                productNames: "",
                consignee: "",
                consigneeAddr: "",
                taskAmount: "",
                standardCost: "",
                signTime: "",
                wdNo:"",
                auditState:"",
                withdrowType:"",
                taskType:""
            }
        ];
    }

    public doQuery(){
        this.load({first:0,rows:10})
    }

    /**
     * 表格字段鼠标浮动事件触发回调方法
     * @param $event
     * @param restObj 浮动窗口对象，根据窗口数量传参自己定义
     */
    cellOver($event,...restObj:any[]): any {
/*
        let op=restObj[0];

        //如果是taskAmount字段则显示浮动窗口op
        if ($event.field == "taskAmount") {
            this.cellOverEvent = JSON.stringify($event);
            op.toggle($event.originalEvent);
        }*/
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
