import {Component, Input, OnInit} from '@angular/core';
import {AbnormalTaskRequestVo} from "../../vo/abnormal-task-request.vo";
import {API} from "../../../../../../share/lib/api/api";
import {AbnormalTaskService} from "../../service/abnormal-task.service";
import {TrackRequestVo} from "../../vo/track-request.vo";

import {ShowOrHideMaskService} from '../../../../../../share/app-service/show-or-hide-mask.service';

import {modalAnimation} from "../../../../../../share/animation/modalAnimation.animation";
import {overlayPanelHide, overlayPanelShow} from "../../../../../../share/utils/gridUtil";


@Component({
    templateUrl: './all-abnormal.component.html',
    styleUrls: [
        '../share/abnormal-sale.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class AllAbnormalComponent implements OnInit {

    public abnormalTaskRequestVo: AbnormalTaskRequestVo;
    public trackRequestVo: TrackRequestVo;

    columns: any[] = [];
    data: any[] = [] //获取任务列表,包括全部、维修、补件、返货、其他
    selections: any[] = [];
    //TODO 跟踪数据
    trackInfo: any[];

    selected: any = 0;//用于显示选择数据条数
    isshowExceptionWin: boolean = false;//用于控制异常信息窗口显示隐藏
    //用于右侧弹出窗口的变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    loading: boolean;

    constructor(public api: API,
                public abnormalTaskService: AbnormalTaskService,
                public mask: ShowOrHideMaskService) {
    }

    ngOnInit(): void {

        this.abnormalSale = 'abnormalSale';
        this.abnormalTaskRequestVo = new AbnormalTaskRequestVo();
        this.trackRequestVo = new TrackRequestVo();

        this.abnormalTaskRequestVo.taskType = "All";

        this.initColumns();
        this.nodeRefresh();
    }

    navs = ["全部", "维修任务", "返货任务", "补件任务", "其他任务", "待跟踪"];
    navHrefs = [
        '/modules/sale-center/abnormal-sale/all-abnormal',
        '/modules/sale-center/abnormal-sale/abnormal-repair',
        '/modules/sale-center/abnormal-sale/abnormal-returgood',
        '/modules/sale-center/abnormal-sale/abnormal-supgood',
        '/modules/sale-center/abnormal-sale/abnormal-other',
        '/modules/sale-center/abnormal-sale/abnormal-trace'
    ];
    nodeNumber:number[]=[0,0,0,0,0,0,0,0];
    curIndex = 0;
    isExplane = false;

    changeExplane(isExplane: boolean) {
        this.isExplane = isExplane;

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

    // @Input() arbitrationFlag : string;
    abnormalSale: any;
    rowData: any;
    selectLineInfo: any[] = [];

    rowSelect($event): any {
        this.rowData = $event[0];
        this.selections = $event[0];
        this.selectLineInfo = $event;
        this.selected = $event;
        let id = this.rowData.id;
        //console.log(this.rowData);
        this.abnormalTaskService.rowData = this.rowData;
    }

    /*公共弹窗提示*/
    msgs: any;

    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    //由子组件传递过来参数--Z追踪弹框显示
    isshowTraceWin = false;

    showOrHideTraceWin(isshow: boolean) {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length != 0) {
            this.selectLineInfo[0].whatType = "task";//跟踪判断
            this.isshowTraceWin = isshow;
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    }

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

    /**
     * 执行查询操作
     */
    public doSearch(): any {
        this.load({"first": 0, "rows": 10})
        this.selectLineInfo = [];
        this.selected = [];
    }

    public load(page) {
        this.loading = true;
        this.api.call("AbnormalAfterSaleController.findAbnormalAfterSale", page, this.abnormalTaskRequestVo).ok(json => {
            this.data = json.result;
            this.loading = false;
            ////console.log(json.result);
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


    /**
     * 执行跟踪操作
     */
    public doSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.isshowTraceWin = false;
        this.mask.hide();
        this.doSearch();
        this.selected = [];
    }

    //隐藏异常信息窗口
    hideDialog() {
        this.isshowExceptionWin = false;
    }

    cellClick(cell): void {
        this.rowData = cell.row;
        if (cell.field === 'abnormalNum') {
            this.isshowExceptionWin = true;
        }
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
                let that = this;
                this.isModuleDisplayArr[1] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[1] = true;
                }, 0);
                this.curModalIndex = 1;

            } else if (cell.row.taskType === '补件任务') {
                let that = this;
                this.isModuleDisplayArr[3] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[3] = true;
                }, 0);
                this.curModalIndex = 3;
            }
            else if (cell.row.taskType === '其他') {
                let that = this;
                this.isModuleDisplayArr[4] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[4] = true;
                }, 0);
                this.curModalIndex = 4;
            } else {
                //console.log(cell.row.taskType, 'cell.row.taskType')
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

    //取消选择
    cancelSelect() {
        this.rowData = [];
        this.selected = [];
    }
    /**
     * 节点数量
     */
    nodeRefresh(){
        this.api.call("abnormalAfterSaleController.abnormalAfterSaleTopNum").ok(data=>{
            this.nodeNumber[0] = data.result['allNumber'] || 0;
            this.nodeNumber[1] = data.result['repairNumber'] || 0;
            this.nodeNumber[2] = data.result['fhreturnNumber'] || 0;
            this.nodeNumber[3] = data.result['partNumber'] || 0;
            this.nodeNumber[4] = data.result['otherNumber'] || 0;
            this.nodeNumber[5] = data.result['trackNumber'] || 0;
        }).fail(err=>{

        })
    }

}
