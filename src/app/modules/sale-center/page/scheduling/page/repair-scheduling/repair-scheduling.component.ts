import {Component, OnInit} from "@angular/core";
import {API} from "../../../../../../share/lib/api/api";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {ConfirmationService} from "primeng/components/common/api";
import {DatePipe} from "@angular/common";
import {Message} from 'primeng/primeng';
import {modalAnimation} from "../../../../../../share/animation/modalAnimation.animation";
import {overlayPanelHide, overlayPanelShow} from "../../../../../../share/utils/gridUtil";

@Component({
    selector: 'repair-scheduling',
    templateUrl: './repair-scheduling.component.html',
    styleUrls: [
        './repair-scheduling.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class RepairSchedulingComponent implements OnInit {

    constructor(public api: API,
                public datePickerService: DatepickerService,
                public mask: ShowOrHideMaskService, public confirmationService: ConfirmationService,
                public datePipe: DatePipe) {
    }

    isShowCompleteWin: boolean = false;  //用于维修完成弹窗
    isShowCancelWin: boolean = false;    //用于取消分配弹窗
    repairAssignIf: boolean = false;
    repairAssignMaster: string = "out";
    addrSelectHidden = true;
    navNumber:number[]=[0,0,0,0,0,0,0,0];
    len: number = 0;//点击函数
    areaText = "";  //省市区选择文本
    /**
     * 表格列
     * @type {Array}
     */
    columns: any[] = [];

    //请求表单vo对象。双向绑定
    requestVo: any = {};
    //请求响应数据
    data: any;
    //发货人样式
    width:string="95px";
    // 鼠标移上数据
    cellOverEvent: any;
    //TODO 跟踪数据
    trackInfo: any;
    isRepair: boolean = false;//让弹框知道是维修调度
    loading: boolean;

    ngOnInit(): void {
        this.initColumns();
        for (let i = this.navList.length - 1; i >= 0; i--) {
            this.navListArr[i] = false;
        }
        this.navListArr[0] = true;

        this.isModuleDisplayArr[0] = false;
        this.isModuleDisplayArr1[0] = false;

        //初始化一些请求参数
        this.requestVo.taskType = "repair";
        this.requestVo.taskStatus = "All";
        this.requestVo.client = "yes";
        this.nodeRefresh();
    }

    changeExplane() {
        this.isSelect = !this.isSelect;

    }

    isSelect = false;
    tasksStatus: string;//选中数据的任务状态
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;

    navList = ['全部', '待分配', '待预约', '待签收', '已签收', '已作废'];
    navListArr: boolean[] = [true, false, false, false, false, false]
    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 97+'px',
        'height': 30 + 'px',
        'textAlign': 'center',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    waitDistribute: boolean = false;

    //点击导航栏
    changeBlock(cur) {
        // debugger;
        for (let i = 0, len = this.navList.length; i < len; i++) {
            if (this.navListArr[i]) {
                this.navListArr[i] = false;
                break;
            }
        }

        this.navListArr[cur] = true;

        let temp: string;
        switch (cur) {
            case 0:
                temp = "All";
                break;
            case 1:
                temp = "waitDistribution"; //待分配
                break;
            /*case 2:
                temp = "distributionWaitAccept";   //已分配,待受理
                break;*/
            case 2:
                temp = "accepted"; //已受理，待预约
                break;
            case 3:
                temp = "waitAppointment";  //已经预约，维修中
                break;
            case 4:
                temp = "doSign";  //维修完成
                break;
            case 5:
                temp = "invalid";  //作废
                break;
        }
        this.tasksStatus = temp;
        //设置未选定任何记录
        this.selectLineInfo.length = 0;
        this.selectedRowData = {};

        this.requestVo.taskStatus = temp;
        this.doSearch();
        this.nodeRefresh();
    }

    /**
     * 侧滑面板
     * @param index
     */
    displayModal(index) {
        if (index === 0) {   //查看详情
            if (this.selectLineInfo.length != 0) {
                var that = this;
                this.isModuleDisplayArr[index] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[index] = true;
                }, 0);
                this.curModalIndex = index;
            } else {
                this.showErroHint("请选择一条数据！");
            }
        } else if (index === 1) {  //分配师傅
            if (this.selectLineInfo.length != 0) {
                if (this.selectedRowData.taskStsTag != "waitDistribution") {
                    this.showErroHint("请选择待分配任务!");
                    return;
                }
                //判断不可处理
                for(let i = 0;i<this.selectLineInfo.length;i++){
                    if(this.selectLineInfo[i].client == "否"){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"不可处理");
                        return;
                    }
                }
                var that = this;
                that.repairAssignIf = true;
                setTimeout(function () {

                    this.repairAssignMaster = "in";
                }, 0);
                this.isRepair = true;//让弹框知道是维修调度
            } else {
                this.showErroHint(this.selectOneDataMsg);
            }
        } else if (index === 2) {
            if (this.selectLineInfo.length != 0) {
                var that = this;
                this.isModuleDisplayArr[index] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[index] = true;
                }, 0);
                this.curModalIndex = index;
            } else {
                this.showErroHint("请选择一条数据！");
            }
        }
    }

    closeModal(isClose: boolean) {
        var that = this;
        this.isModuleDisplayArr1[this.curModalIndex] = isClose;
        setTimeout(function () {
            that.isModuleDisplayArr[that.curModalIndex] = isClose;
        }, 200);
    }

    //确认分配师傅
    doSaveMaster() {
        this.showSuccess("success", "提示", "操作成功！");
        this.doSearch();
        this.nodeRefresh();
        this.selectLineInfo.length = 0;
        this.repairAssignMaster = "out";
        setTimeout(() => {
            this.repairAssignIf = false;
        })

    }

    //关闭分配师傅
    closeAssign() {
        this.repairAssignMaster = "out";
        setTimeout(() => {
            this.repairAssignIf = false;
        })
    }

    /**
     * 弹框显示
     * @param result
     */
    isshowVerify: boolean = false;//确认分配
    isshowAccept: boolean = false;//确认受理
    isreservation: boolean = false;//预约
    isoperationEnd: boolean = false;//终止订单
    istraceWin: boolean = false;

    selectOneDataMsg: string = "请选择一条数据！";

    /**
     * 错误提示
     * @param msg
     */
    showErroHint(msg) {
        this.showSuccess("warn", "错误提示", msg);
    }

    //确认分配师傅
    showWin() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length != 0) {
            if (this.selectedRowData.taskStsTag != "waitDistribution") {
                this.showErroHint("请选择待分配任务!");
                return;
            }
            if (!this.selectedRowData.vRepairTaskName) {
                this.showErroHint("请先分配师傅！");
                return;
            }
            this.isshowVerify = true;
            this.mask.show();
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /**
     * 确认确认分配后刷新页面
     */
    doVerify() {
        this.isshowVerify = false;
        this.mask.hide();
        this.selectLineInfo.length = 0;
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();
        this.nodeRefresh();
    }

    /**
     * 确认受理
     */
    showAccept() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length != 0) {
            if (this.selectedRowData.taskStsTag != "distributionWaitAccept") {
                this.showErroHint("请选择待受理任务!");
                return;
            }
            this.isshowAccept = true;
            this.mask.show();
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /**
     * 预约
     */
    showReservation() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length != 0) {
            if (this.selectedRowData.taskStsTag != "accepted") {
                this.showErroHint("请选择已受理任务");
                return;
            }
            if(this.selectedRowData.direct){
                this.showSuccess("warn", "提示", "不能操作网点的任务！");
                return;
            }
            this.isreservation = true;
            this.mask.show();
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /**
     * 二次预约
     */
    doOrder() {
        if (this.selectedRowData) {
            if (this.selectedRowData.taskStsTag != "waitAppointment") {
                this.showErroHint("请选择待签收任务");
                return;
            }
            if(this.selectedRowData.direct){
                this.showSuccess("warn", "提示", "不能操作网点的任务！");
                return;
            }
            this.isreservation = true;
            this.mask.show();
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /**
     * 终止订单
     */
    showOperation() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }

        if (this.selectLineInfo.length !== 0) {
            if (this.selectedRowData.taskStsTag === "invalid") {
                this.showErroHint("该订单已终止！");
                return;
            }
            this.isoperationEnd = true;
            this.mask.show();
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /**
     * 添加跟踪信息
     */
    showTrace() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length != 0) {
            this.selectLineInfo[0].whatType = "task";//跟踪判断
            this.istraceWin = true;
            this.mask.show();
            this.selectLineInfo[0].whatType = "task";
        } else {
            this.showErroHint(this.selectOneDataMsg);
        }
    }

    /*
     * 确认添加跟踪*/
    oSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();//刷新
        this.nodeRefresh();
        this.selectLineInfo.length = 0;
        this.istraceWin = false;//跟踪
        this.mask.hide();
        window['epInstance'].emit('update_submenu_info');
    }

    showDialog(who) {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        // debugger;
        if (this.selectLineInfo.length == 0) {
            this.showErroHint(this.selectOneDataMsg);
            return;
        }
        switch (who) {
            case 'complete-dialog':
                if(this.selectedRowData){
                    if(this.selectedRowData.direct){
                        this.showSuccess("warn", "提示", "不能操作网点的任务！");
                        return;
                    }
                }
                this.isShowCompleteWin = true;
                break;
            case 'cancel-allocation'://取消分配
                if (this.selectedRowData.taskStsTag === "distributionWaitAccept"
                    || this.selectedRowData.taskStsTag === "accepted"
                    || this.selectedRowData.taskStsTag === "waitAppointment") {
                    this.isShowCancelWin = true;
                } else {
                    this.showErroHint("该任务不在取消范围！");
                    return;
                }
                break;
        }
        this.mask.show();
    }

    /**
     * 关闭对话框
     * @param who
     */
    hideDialog(who) {
        switch (who) {
            case 'complete-dialog':
                this.isShowCompleteWin = false;
                break;
            case 'cancel-allocation':
                this.isShowCancelWin = false;
                break;
        }
        this.mask.hide();
    }

    /**
     * 维修完成保存*/
    repairSave() {
        this.showSuccess("success", "提示", "操作完成");
        this.isShowCompleteWin = false;
        this.mask.hide();
        this.doSearch();//刷新;
        this.nodeRefresh();
    }

    /**
     * 确认取消分配*/
    doCancelSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();
        this.nodeRefresh();
        this.selectLineInfo.length = 0;
        this.isShowCancelWin = false;
        this.mask.hide()
    }

    hideWin(isHide: boolean) {
        this.isshowVerify = isHide;//确认分配
        this.isshowAccept = isHide;//确认受理
        this.isreservation = isHide;	//预约
        this.istraceWin = isHide;//跟踪
        this.mask.hide();
    }

    /**
     * 关闭终止任务*/
    hideOperation(event) {
        if (event) {
            this.showSuccess("warn", "提示", event);
            return;
        }
        this.isoperationEnd = false;//终止订单
        this.mask.hide();
    }

    /**
     * 终止订单确认刷新*/
    doHideSave() {
        this.isoperationEnd = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
        this.selectLineInfo.length = 0;
        this.doSearch();//刷新
        this.nodeRefresh();
    }

    /**
     * 受理保存刷新
     */
    doAcceptSave() {
        this.isshowAccept = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
        this.selectLineInfo.length = 0;
        this.doSearch();//刷新
    }

    /**
     * 预约保存刷新
     */
    timeSave() {
        this.isreservation = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
        this.selectLineInfo.length = 0;
        this.doSearch();//刷新
        this.nodeRefresh();
    }

    /*公用弹框*/
    alert(msg: string, title?: string, cb?: any) {
        this.confirmationService.confirm({
            message: msg,
            header: title || '提示',
            accept: (e) => {
                if (cb) {
                    cb(e);
                }
            }
        });
    }

    msgs: Message[] = [];

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    changeAddrText(result: any) {
        debugger;
        ////console.log("-------area:" + result);
        this.areaText = result.areaText;
        this.addrSelectHidden = result.addrSelectHidden;
    }

    dateTimeFormat: string = "yyyy-MM-dd HH:mm:ss";

    load(page): any {

        //时间格式化再上传
        let taskTimeStart = this.requestVo.taskTimeStart;   //任务开始时间
        let taskTimeEnd = this.requestVo.taskTimeEnd;
        let trackTimeStart = this.requestVo.trackTimeStart;    //跟踪时间
        let trackTimeEnd = this.requestVo.trackTimeEnd;
        if (taskTimeStart) {
            let tStartTime = this.datePipe.transform(taskTimeStart, this.dateTimeFormat);
            this.requestVo.taskTimeStart = tStartTime;
        }
        if (taskTimeEnd) {
            let tEndTime = this.datePipe.transform(taskTimeEnd, this.dateTimeFormat);
            this.requestVo.taskTimeEnd = tEndTime;
        }
        if (trackTimeStart) {
            let tts = this.datePipe.transform(trackTimeStart, this.dateTimeFormat);
            this.requestVo.trackTimeStart = tts;
        }
        if (trackTimeEnd) {
            let tte = this.datePipe.transform(trackTimeEnd, this.dateTimeFormat);
            this.requestVo.trackTimeEnd = tte;
        }
        this.loading = true;
        this.api.call("AftermarketTaskController.repairDispatchList", page, this.requestVo).ok(json => {
            this.data = json.result;
            if (this.data && this.data.content.length === 0) {
                // this.showSuccess("warn", "提示", "没有数据！");
            }
            this.loading = false;
        }).fail(data => {
            this.showSuccess("error", "提示", "查询失败！");
            console.error(data);
            this.loading = false;
        });
    }
    /**
     * 导出
     */
    exportCSV($event){
        //时间格式化再上传
        let taskTimeStart = this.requestVo.taskTimeStart;   //任务开始时间
        let taskTimeEnd = this.requestVo.taskTimeEnd;
        let trackTimeStart = this.requestVo.trackTimeStart;    //跟踪时间
        let trackTimeEnd = this.requestVo.trackTimeEnd;
        if (taskTimeStart) {
            let tStartTime = this.datePipe.transform(taskTimeStart, this.dateTimeFormat);
            this.requestVo.taskTimeStart = tStartTime;
        }
        if (taskTimeEnd) {
            let tEndTime = this.datePipe.transform(taskTimeEnd, this.dateTimeFormat);
            this.requestVo.taskTimeEnd = tEndTime;
        }
        if (trackTimeStart) {
            let tts = this.datePipe.transform(trackTimeStart, this.dateTimeFormat);
            this.requestVo.trackTimeStart = tts;
        }
        if (trackTimeEnd) {
            let tte = this.datePipe.transform(trackTimeEnd, this.dateTimeFormat);
            this.requestVo.trackTimeEnd = tte;
        }
        this.api.call('AftermarketTaskController.repairDispatchList', {
            first:0,
            rows:99999999
        }, this.requestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    /**
     * 移入移出跟踪信息
     */
    cellMouseEnter($event, ...restObj: any[]): any {
        overlayPanelShow($event, restObj, ['vTaskTrackRemark']);
        this.api.call("AftermarketTaskController.getTaskTraceListNoPage", {
            taskID: $event.row.id
        }).ok(json => {
            // debugger;
            ////console.log("----" + json);
            this.trackInfo = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }

    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['vTaskTrackRemark']);
    }

    /**
     * 选定行数据
     */
    selectedRowData: any;
    selectsRowData: any;
    selectLineInfo: any[] = []; //用于共同调用添加跟踪接口
    rowSelect($event): any {
        this.selectedRowData = $event[0];
        this.selectsRowData = $event;
        this.len = $event.length;
        this.selectLineInfo = $event;
        this.tasksStatus = this.selectedRowData.taskStsTag;//切换按钮
        //过滤, 只要跟第一次选中的状态不一致就选不中
        let data = $event.filter(item => {
            if(item.taskSts != $event[0].taskSts){
                this.showSuccess("warn", "提示", "只能选择相同任务状态的数据");
            }
            return item.taskSts == $event[0].taskSts;
        });
        this.selectLineInfo = data;

    }

    /**
     * 执行查询操作
     */
    public doSearch(): any {
        // debugger;
        ////console.log("doSearch");
        this.load({
            first: 0,
            rows: 10
        });
        this.selectLineInfo.length = 0;
    }

    /*
     *隐藏按钮 */
    closeBtnX() {
        this.selectedRowData = [];
        this.selectLineInfo.length = 0;
    }

    /**
     * 文本下拉框临时数据
     */
    public temp: string;
    public suggestionResult: string[];//查询建议结果

    searchResult(event, type?) {
        if (type = 'receive') {
            //查询收货人
        }
        if (event.query.startsWith("a")) {
            this.suggestionResult = ["aaa", "aab", "aac"];
        }
        else if (event.query.startsWith("b")) {
            this.suggestionResult = ["bbb", "bba", "bbc"];
        }
    }

    cellClick(cell): void {
        // debugger;
        this.selectedRowData = cell.row;
        this.selectLineInfo = cell.row;
        if (cell.field === 'maintno') {
            let that = this;
            this.isModuleDisplayArr[0] = true;
            setTimeout(function () {
                that.isModuleDisplayArr1[0] = true;
            }, 0);
            this.curModalIndex = 0;
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

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "waybillId",
            header: "运单号",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "maintno",
            header: "任务单号",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "client",
            header: "可处理",
            sortable: false,
            width: "50px",
            filter: true
        });
        this.columns.push({
            field: "vTaskTrackRemark",
            header: "跟踪信息",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "trackedTime",
            header: "跟踪时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "nextTrackedTime",
            header: "下次跟踪时间",
            sortable: false,
            filter: true
        });
        //仅用于展示
        this.columns.push({
            field: "taskStatusShow",
            header: "任务状态",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "dateCreated",
            header: "任务生成时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "installDisTime",
            header: "安装分配时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "orderAcceptTime",
            header: "订单受理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "orderAppointmentCallTime",
            header: "预约时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "orderAppointmentTime",
            header: "预约上门时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "repairSignTime",
            header: "维修完成时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "installFee",
            header: "维修费（元）",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vRepairTaskName",
            header: "维修师傅",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vRepairTaskId",
            header: "师傅账号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "endCityName",
            header: "目的省",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "consigneeName",
            header: "收货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "consigneeMobile",
            header: "收货人电话",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vArea",
            header: "收货详细地址",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "shipperName",
            header: "发货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "shipperMobile",
            header: "发货人电话",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTaskTrackMan",
            header: "跟踪人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "cancelReason",
            header: "作废原因",
            sortable: false,
            filter: true
        });
    }
    /**
     * 节点刷新
     */
    // acceptedNum
    //     :
    //     2
    // allNum
    //     :
    //     126
    // doSignNum
    //     :
    //     0
    // invalidNum
    //     :
    //     122
    // waitAppointmentNum
    //     :
    //     2
    // waitDistributionNum
    //     :
    //     0
    nodeRefresh(){
        this.api.call("aftermarketTaskController.getAftermarketListTopNum").ok(data=>{

            this.navNumber[0] = data.result.reparNumOfStatus.allNum ;
            this.navNumber[1] = data.result.reparNumOfStatus.waitDistributionNum;
            this.navNumber[2] = data.result.reparNumOfStatus.acceptedNum;
            this.navNumber[3] = data.result.reparNumOfStatus.waitAppointmentNum;
            this.navNumber[4] = data.result.reparNumOfStatus.doSignNum;
            this.navNumber[5] = data.result.reparNumOfStatus.invalidNum;
        }).fail(err=>{

        })
    }
}
