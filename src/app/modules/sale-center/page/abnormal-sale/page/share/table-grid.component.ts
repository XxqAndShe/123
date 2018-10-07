import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from "@angular/core";
import {API} from "../../../../../../share/lib/api/api";
import {AbnormalTaskRequestVo} from "../../vo/abnormal-task-request.vo";
import {modalAnimation} from "../../../../../../share/animation/modalAnimation.animation";
import {overlayPanelHide, overlayPanelShow} from "../../../../../../share/utils/gridUtil";

@Component({
    selector: "saleException-grid",
    templateUrl: "./table-grid.component.html",
    styles: [`
        .modal {
            position: fixed;
            height: 100%;
            width: 1020px;
            top: 50px;
            right: -1040px;
            z-index: 7000;
        }

        readonly-exception-info {
            position: fixed;
            top: 50%;
            left: 50%;
            margin-top: -310px;
            margin-left: -320px;
        }
    `],
    animations: [
        modalAnimation
    ]
})
export class TableGridComponent implements OnInit {
    // isSelect = false;
    columns: any[] = [];
    data: any[] = [];
    selectionRow: any[] = [];
    //用于右侧弹出窗口的变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    @Output() selected = new EventEmitter();//用于显示选择数据条数
    @Input()
    abnormalTaskRequestVo: AbnormalTaskRequestVo;
    @Input() selectLineInfo: any[] = [];//传给跟踪组件
    isshowExceptionWin: boolean = false;//是否显示异常处理结果弹窗
    abnormalSale: any;
    //TODO 跟踪数据
    trackInfo: any[];
    loading: boolean;
    /*公共弹窗提示*/
    msgs: any;

    @Output() loadEvent=new EventEmitter<any>();

    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /** 异常处理*/
    constructor(public api: API) {
    }

    ngOnInit(): void {
        this.abnormalSale = 'abnormalSale';
        this.initColumns();
    }

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "abnormalNum",
            header: "异常编号",
            sortable: false,
            filter: true,
            link: true,
            width: "200px"
        });
        /*this.columns.push({
            field: "waybillId",
            header: "运单号",
            sortable: false,
            filter: true,
            link: true
        });*/
        this.columns.push({
            field: "taskId",
            header: "任务单号",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "traceMark",
            header: "跟踪信息",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "taskType",
            header: "任务类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "shipper",
            header: "发货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "consignee",
            header: "收货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "receivePhoneNum",
            header: "收货手机号码",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "serviceType",
            header: "服务类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "pictures",
            header: "图片",
            sortable: false,
            filter: true,
            thumbnail: true
        });
        this.columns.push({
            field: "abnormalType",
            header: "异常类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalChildType",
            header: "异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnoHandleSts",
            header: "异常状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "handleWay",
            header: "处理方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "taskstatus",
            header: "售后状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "taskReturnOperator",
            header: "返货运营商",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "registerPerson",
            header: "登记人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "registerTime",
            header: "登记时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "feedbackMan",
            header: "反馈人",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "handlePerson",
            header: "处理人",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "handleTime",
            header: "处理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "feedBackPhone",
            header: "反馈人联系方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDutys",
            header: "责任方",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "writeDate",
            header: "创建时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "source",
            header: "来源",
            sortable: false,
            filter: true
        });
    }

    /** 异常售后列表*/
    load(page): any {
        this.loadEvent.emit(true);
        this.api.call("AbnormalAfterSaleController.findAbnormalAfterSale", page, this.abnormalTaskRequestVo).ok(json => {
            this.data = json.result;
            this.loadEvent.emit(false);
        });
    }
    /**
     * 导出
     */
    exportCSV($event){
        this.api.call('AbnormalAfterSaleController.findAbnormalAfterSale', {
            first:0,
            rows:99999999
        }, this.abnormalTaskRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    @Output() rowInfo = new EventEmitter();
    rowData;

    rowSelect($event): any {
        this.rowData = $event[0];
        this.selectLineInfo = $event;
        // this.selectLineInfo[0].whatType = "task";//跟踪判断
        this.rowInfo.emit(this.selectLineInfo);
        this.selected.emit($event);
    }

    /**
     * 仲裁处理查询
     * @param vm
     */
    // cmSearch(vm) {
    //     this.arbqueryRequst.dateStart = vm.dateStart;
    //     this.arbqueryRequst.dateEnd = vm.dateEnd;
    //     this.arbqueryRequst.abID = vm.abID;
    //     this.arbqueryRequst.waybillID = vm.waybillID;
    //     this.arbqueryRequst.isArbState = vm.isArbState;
    //     this.arbqueryRequst.trackTime = vm.trackTime;
    //     this.arbqueryRequst.pageNum = vm.pageNum;
    //     this.arbqueryRequst.pageSize = vm.pageSize;
    //     this.arbqueryRequst.bigType = vm.bigType;
    //     this.arbqueryRequst.smallType = vm.smallType;
    //     this.arbqueryRequst.handleStartDate = vm.handleStartDate;
    //     this.arbqueryRequst.handleEndDate = vm.handleEndDate;
    //     this.arbqueryRequst.arbDate = vm.arbDate;
    //     this.arbqueryRequst.source = vm.source;
    //     this.arbqueryRequst.isTrack = vm.isTrack;
    //     this.arbqueryRequst.trackTime = vm.trackTime;
    //     vm.first = 0;
    //     vm.rows = 10;
    //     this.load(vm);
    // }
    // rowSelect($event):any{
    //     this.selectionRow=$event;
    // }
    /**
     * 移入移出跟踪信息
     */
    cellMouseEnter($event, ...restObj: any[]): any {
        overlayPanelShow($event, restObj, ['traceMark']);
        this.api.call("AftermarketTaskController.getTaskTraceListNoPage", {
            taskID: $event.row.id
        }).ok(json => {
            // debugger;
            //console.log("----" + json);
            this.trackInfo = json.result;
        }).fail((err) => {
            //console.log(err);
        });
    }

    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['traceMark']);
    }

    cellClick(cell): void {
        this.rowData = cell.row;
        if (cell.field === 'taskId') {
            if (cell.row.taskType === '维修任务') {
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if (cell.row.taskType === '返货任务') {
                if(cell.row.taskReturnOperator === '服务商'){
                    let that = this;
                    this.isModuleDisplayArr[1] = true;
                    setTimeout(function () {
                        that.isModuleDisplayArr1[1] = true;
                    }, 0);
                    this.curModalIndex = 1;
                }else{
                    let that = this;
                    this.isModuleDisplayArr[5] = true;
                    setTimeout(function () {
                        that.isModuleDisplayArr1[5] = true;
                    }, 0);
                    this.curModalIndex = 5;
                }
            } else if (cell.row.taskType === '补件任务') {
                let that = this;
                this.isModuleDisplayArr[3] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[3] = true;
                }, 0);
                this.curModalIndex = 3;
            } else if (cell.row.taskType === '其他') {
                let that = this;
                this.isModuleDisplayArr[4] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[4] = true;
                }, 0);
                this.curModalIndex = 4;
            } else {
                this.showSuccess("info", "提示", "请点击维修/返货任务！");
            }
        }
        if (cell.field === 'waybillId') {
            let that = this;
            this.isModuleDisplayArr[2] = true;
            setTimeout(function () {
                that.isModuleDisplayArr1[2] = true;
            }, 0);
            this.curModalIndex = 2;
        }
        if (cell.field === 'abnormalNum') {
            this.isshowExceptionWin = true;
        }
    }

    closeModal(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
    }

    /**
     * 刷新保存
     */
    saveModal() {
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();//刷新
        this.selectLineInfo = [];//取消表格选中
        this.closeModal(3);
    }

    doSearch() {
        this.load({"first": 0, "rows": 10});
        this.selected.emit([]);
        this.selectLineInfo = [];
    }

    //表格取消选择
    cancelSelect() {
        this.rowData = [];
        this.selected.emit([]);
        this.selectLineInfo = [];
    }

    hideWin() {
        this.isshowExceptionWin = false;
    }

}
