/**
 * Created by jia on 2017-03-22.
 */
import {Component, Input, OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {AllArbitrationRequestVo} from "./vo/all-arbitration-request.vo";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {overlayPanelHide, overlayPanelShow} from "../../../../share/utils/gridUtil";

@Component({
    templateUrl: './arbitration-handle.component.html',
    styleUrls: ['./arbitration-handle.component.css'],
    animations: [
        modalAnimation
    ]
})
export class ArbitrationHandleComponent implements OnInit {
    // nav插件引用设置
    nodeNumber: any;
    navs = ["全部", "未仲裁", "已仲裁", "待跟踪"];
    navNumArr: number[] = [0, 0, 0, 0];
    nav = ["allNumber", "hasArbitrationNumber", "noArbitrationNumber", "toTrackNumber"];
    curIndex = 0;
    rowData: any;
    isSelect = false;
    columns: any[] = [];
    data: any[] = [];
    selectionRow: any[] = [];
    selectedNum: number = 0;
    testName: any[] = [];
    selectLineInfo: any[] = [];//跟踪传参
    trackInfo: any = []; //跟踪信息
    // 鼠标移上数据
    cellOverEvent: any;
    // 异常处理

    public arbqueryRequst: AllArbitrationRequestVo;
    isshowExceptionWin: boolean = false;//控制异常信息窗口显示隐藏
    loading: boolean;

    constructor(public api: API, public mask: ShowOrHideMaskService) {
    }

    ngOnInit(): void {
        this.arbqueryRequst = new AllArbitrationRequestVo();
        this.initColumns();
        this.nodeRefresh();
    }

    /**
     * 节点刷新
     */
    nodeRefresh() {
        this.api.call("arbitrationController.queryAbortionTopNum").ok(data => {
            this.navNumArr[0]=data.result['allNumber'] || 0;
            this.navNumArr[1]=data.result['noArbitrationNumber'] || 0;
            this.navNumArr[2]=data.result['hasArbitrationNumber'] || 0;
            this.navNumArr[3]=data.result['toTrackNumber'] || 0;
        }).fail(err => {

        });
    }

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "vAbnormal.abnormalNum",
            header: "异常编号",
            sortable: false,
            filter: true,
            link: true,
            width: "200px"
        });
        this.columns.push({
            field: "waybillId",
            header: "任务号",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "trackContent",
            header: "跟踪信息",
            sortable: false,
            filter: true,
        });
        this.columns.push({
            field: "arbStatus",
            header: "仲裁状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "wayAbnoBigType",
            header: "异常大类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "wayAbnoSmallType",
            header: "异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vAbnormal.strDescribe",
            header: "异常描述",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abDeptname",
            header: "登记部门",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vAbnormal.strHandleWay",
            header: "处理方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnoBigType",
            header: "仲裁异常大类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnoSmallType",
            header: "仲裁异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "arbResponsible",
            header: "仲裁责任方",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "arbSubject",
            header: "仲裁责任主体",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "arbitrationTime",
            header: "仲裁日期",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "arborMan",
            header: "仲裁人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "arbitrationOpinions",
            header: "仲裁意见",
            sortable: false,
            filter: true,
            textLength: 20
        });
        this.columns.push({
            field: "deptName",
            header: "开单网点",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "clientName",
            header: "发货人",
            sortable: false,
            filter: true
        });
        // this.columns.push({
        //     field: "handlePersonName",
        //     header: "处理人",
        //     sortable: false,
        //     filter: true
        // });
        this.columns.push({
            field: "carrier",
            header: "承运商",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vAbnormal.strDateCreated",
            header: "登记时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vAbnormal.strHandleTime",
            header: "处理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vAbnormal.strSource",
            header: "来源",
            sortable: false,
            filter: true
        });
    }

    chanCurIndex(index: number) {
        this.nodeRefresh();//刷新节点
        this.arbqueryRequst = new AllArbitrationRequestVo();
        this.curIndex = index;
        this.arbqueryRequst.source = "All";
        switch (index) {
            case 0:  //全部
                this.arbqueryRequst.arbStatus = "全部";
                this.arbqueryRequst.isTrack = "";
                break;
            case 1:
                this.arbqueryRequst.arbStatus = "未仲裁";
                this.arbqueryRequst.isTrack = "";
                break;
            case 2:
                this.arbqueryRequst.arbStatus = "已仲裁";
                this.arbqueryRequst.isTrack = "";
                break;
            case 3:
                this.arbqueryRequst.arbStatus = "待跟踪";
                this.arbqueryRequst.isTrack = "是";
                break;
        }
        this.cmSearch();
    }

    /**
     *
     * 加载仲裁处理数据列表
     * @param $event
     */
    load($event): any {
        this.loading = true;
        this.api.call("ArbitrationController.queryAbortion", $event, this.arbqueryRequst).ok(json => {
            this.data = json.result;
            this.loading = false;
        });
    }

    /**
     * 导出
     */
    exportCSV($event) {
        this.api.call('ArbitrationController.queryAbortion', {
            first: 0,
            rows: 99999999
        }, this.arbqueryRequst)
            .ok(data => {
                $event.done($event.grid, data.result.content);
            })
            .fail(err => {
                $event.done(null, null, true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    msgs: any;
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /**
     * 仲裁处理查询
     * @param vm
     */
    cmSearch(vm?: any) {
        if (vm) {
            Object.assign(this.arbqueryRequst, vm);
        }
        // vm.first = 0;
        // vm.rows = 10;
        this.load(this.arbqueryRequst);

        if (this.selectionRow.length) {

            this.selectionRow.length = 0;
        }

    }

    isExplane = false;

    changeExplane(isExplane: boolean) {
        this.isExplane = isExplane;
    }

    //由子组件传递过来参数--弹框显示
    isshowWin = false;

    showOrHideWin(isshow: boolean) {
        //单选判断
        if (this.selectionRow.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length == 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        }
        // if (this.selectionRow[0]['ArbStatus'] == "已仲裁")
        // {
        //     alert("此运单已经仲裁，不能再操作");
        //     return;
        // }else{
        this.isshowWin = isshow;
        //this.mask.show();
        // }
    }

    //由子组件传递过来参数--Z追踪弹框显示
    isshowTraceWin = false;

    showOrHideTraceWin(isshow: boolean) {
        //单选判断
        if (this.selectionRow.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }

        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        }
        this.isshowTraceWin = isshow;
        this.selectLineInfo[0].whatType = "abnormal";
        if (isshow) {
            this.mask.show();
        } else {
            this.mask.hide();
        }
    }

    rowSelect($event): any {
        this.selectionRow = $event;
        this.selectLineInfo = $event;
        this.selectedNum = this.selectionRow.length;
    }

    //点运单号弹框
    modalState: string = 'out';
    showWaybillDetail: boolean = false;

    displayModal() {
        let that = this;
        this.showWaybillDetail = true;
        setTimeout(function () {
            that.modalState = 'in';
        }, 0);
    }

    closeModal() {
        let that = this;
        this.modalState = 'in';
        setTimeout(function () {
            that.showWaybillDetail = false;
        }, 200);
    }

    cellClick(cell) {
        if (cell.field === 'waybillId') {
            this.selectionRow[0] = cell.row;
            this.displayModal();
        }
        if (cell.field === 'vAbnormal.abnormalNum') {
            this.rowData = cell.row;
            this.isshowExceptionWin = true;
            //this.mask.show();
        }
    }

    //隐藏异常信息窗口
    hideWin() {
        this.isshowExceptionWin = false;
        //this.mask.hide();
    }

    //取消选中数据
    cancelSelect() {
        this.selectionRow = [];
        this.selectedNum = 0;
    }

    /**
     * 表格字段鼠标浮动事件触发回调方法
     * @param $event
     * @param restObj 浮动窗口对象，根据窗口数量传参自己定义，因为此处举例三个弹窗
     */

    cellOver($event, ...restObj: any[]): any {
        let op = restObj[0];

        ////console.log($event);
        //如果是id字段则显示浮动窗口op
        if ($event.field == "vAbnormal.strDescribe") {
            this.cellOverEvent = JSON.stringify($event.value);
            op.toggle($event.originalEvent);
        }
    }

    /**
     * 用于弹窗确定后回调刷新表格
     */
    confirmCallback() {
        this.isshowWin = false;
        this.showSuccess("success", "提示", "操作成功！");
        this.selectionRow = [];
        this.selectedNum = 0;
        this.isshowTraceWin = false;
        this.mask.hide();
        this.cmSearch();
        this.nodeRefresh();
    }

    vTrack: any = {};

    cellMouseEnter($event, ...restObj: any[]): any {
        overlayPanelShow($event, restObj, ['trackContent']);
        this.vTrack.abnormalId = $event.row.id;
        this.api.call("TrackController.findAbnormalTrackInfo", $event, this.vTrack)
            .ok(returnInfo => {
                let result = returnInfo.result || [];
                this.trackInfo = result;
            })
            .fail(data => {
            });
    }

    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['trackContent']);
    }
}
