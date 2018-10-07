import {Component, OnInit, Input} from "@angular/core";
import {API} from "../../../../../../share/lib/api/api";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {ConfirmationService} from "primeng/components/common/api";
import {DatePipe} from "@angular/common";
import {Message} from 'primeng/primeng';
import {modalAnimation} from "../../../../../../share/animation/modalAnimation.animation";
import {overlayPanelHide, overlayPanelShow} from "../../../../../../share/utils/gridUtil";

@Component({
    selector: 'return-scheduling',
    templateUrl: './return-scheduling.component.html',
    styleUrls: [
        './return-scheduling.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class ReturnSchedulingComponent implements OnInit {

    selectedRowData: any;//选中行数据
    selectsRowData:any;
    selectLineInfo: any[] = [];
    len: number = 0;
    // 鼠标移上数据
    cellOverEvent: any;
    //TODO 跟踪数据
    trackInfo: any[];
    navNumber:number[]=[0,0,0,0,0,0,0,0];

    /**
     * 表格列
     * @type {Array}
     */
    columns: any[] = [];

    //请求表单vo对象。双向绑定
    requestVo: any = {};
    //表格响应事件
    data: any = {};
    isReturn: boolean = false;//用于弹框判断是返货任务
    loading: boolean;

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 97+'px',
        'height': 30 + 'px',
        'textAlign': 'center',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    taskReturnDetailsList: any;//返货明细
    //分配师傅
    repairAssignIf: boolean = false;
    repairAssignMaster: string = "out";
    isRepair: boolean;
    //发货人样式
    width:string = "95px";
    showWhichWin: string;//显示哪个弹窗
    currentStatus: string;
    public navList = ['全部', '待分配', '待提货', '待签收', '已签收','待返回客户','已返回客户', '已作废'];

    @Input()
    public navListArr: boolean[] = [true, false, false, false, false, false, false, false];

    addrSelectHidden = true;
    areaText = "";

    constructor(public api: API,
                public datePickerService: DatepickerService,
                public mask: ShowOrHideMaskService, public confirmationService: ConfirmationService,
                public datePipe: DatePipe) {
    }

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "waybillId",
            header: "配装任务号",
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
            field: "vTaskTrackLastUpdated",
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
        this.columns.push({
            field: "serviceType",
            header: "服务类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "taskStatusShow",
            header: "返货任务状态",
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
            header: "分配时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "orderAcceptTime",
            header: "受理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "getGoodsTime",
            header: "提货时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "doSignTime",
            header: "签收时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "returnMoney",
            header: "返货费",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "goodsReturnOperator",
            header: "返货运营商",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "returnGoodsTotal",
            header: "返货总件数",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "returnGoodsVolumn",
            header: "总体积(方)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "returnDetails",
            header: "返货明细",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "selfAssignOperator",
            header: "直营分配人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "selfAssignTime",
            header: "直营分配时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vRepairTaskName",
            header: "提货师傅",
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
            field: "getGoodsArea",
            header: "提货地址",
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
            field: "endCityName",
            header: "目的省",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vArea",
            header: "收货人详细地址",
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
            field: "goodsArriveTime",
            header: "货物到达时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "returnCustomerTime",
            header: "返回客户时间",
            sortable: false,
            filter: true
        });
    }

    /**
     * 表格悬浮显示框。
     * @param $event
     * @param restObj
     */
    // cellOver($event, ...restObj: any[]): any {
    //   //console.log($event);
    //   debugger;
    //     let op1 = restObj[0];
    //     if ($event.field == "vTaskTrackRemark") {
    //         // this.cellOverEvent = JSON.stringify($event);
    //         op1.toggle($event.originalEvent);
    //     }
    // }
    /**
     * 跟踪悬浮
     * @param cur
     */
    /**
     * 移入移出跟踪信息
     */
    //进入
    cellMouseEnter($event, ...restObj: any[]): any {
        overlayPanelShow($event, restObj, ['vTaskTrackRemark']);
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

    //离开
    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['vTaskTrackRemark']);
    }

    //点击导航栏
    public changeBlock(cur) {
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
                temp = "accepted"; //已受理，待提货
                break;
            case 3:
                temp = "waitPickUp";  //已经提货，待返货
                break;
            case 4:
                temp = "doSign";  //签收，returnCompleted("返货完成");
                break;
            case 5:
                temp = "GoodsArrive";  //待返回
                break;
            case 6:
                temp = "ReturnCustomer";  //已返回
                break;
            case 7:
                temp = "invalid";  //作废
                break;
        }
        this.currentStatus = temp;

        this.tasksStatus = temp;
        //设置没选定任何记录
        this.selectLineInfo.length = 0;
        this.selectedRowData = {};

        this.requestVo.taskStatus = temp;
        this.doSearch();
        this.nodeRefresh();
    }

    ngOnInit(): void {
        /**
         * 初始化列
         */
        this.initColumns();
        for (let i = this.navList.length - 1; i >= 0; i--) {
            this.navListArr[i] = false;
        }
        this.navListArr[0] = true;

        this.isModuleDisplayArr[0] = false;
        this.isModuleDisplayArr1[0] = false;

        //初始化一些请求参数
        this.requestVo.taskType = "fhreturn";
        this.requestVo.taskStatus = "All";
        this.requestVo.client = "yes";
        this.nodeRefresh();
    }

    changeExplane() {
        // debugger;
        this.isSelect = !this.isSelect;

    }

    isSelect = false;

    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;

    displayModal(index) {
        if (this.selectLineInfo.length == 0) {
            this.showErroHint(this.selectOneDataMsg);
            return;
        }
        //判断不可处理
        for(let i = 0;i<this.selectLineInfo.length;i++){
            if(this.selectLineInfo[i].client == "否"){
                this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"不可处理");
                return;
            }
        }
        //分配师傅
        if (index == 1) {
            var that = this;
            that.repairAssignIf = true;
            setTimeout(function () {
                this.repairAssignMaster = "in";
            }, 0);
            this.isRepair = false;//让弹框知道是返货调度
        }
        if(index==0){
            //单选判断
            if (this.selectLineInfo.length > 1) {
                this.showSuccess("warn", "提示", "只能选择一条任务信息");
                return
            }
        }
        var that = this;
        this.isModuleDisplayArr[index] = true;
        setTimeout(function () {
            that.isModuleDisplayArr1[index] = true;
        }, 0);
        this.curModalIndex = index;
        this.isReturn = true;
    }

    /**
     * 取消分配*/
    showCancelAllow() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length == 0) {
            this.showErroHint(this.selectOneDataMsg);
            return;
        }
        this.isShowCancelWin = true;
        this.mask.show();
    }

    //取消、关闭
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
        this.doSearch();//刷新
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

    changeAddrText(result: any) {
        this.areaText = result.areaText;
        this.addrSelectHidden = result.addrSelectHidden;
    }

    msgs: Message[] = [];

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    dateTimeFormat: string = "yyyy-MM-dd HH:mm:ss";

    load(page): any {
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
        this.api.call("AftermarketTaskController.returnDispatchList", page, this.requestVo).ok(json => {
            // debugger;
            this.data = json.result;
            if (this.data && this.data.content.length === 0) {
                // this.showSuccess("warn", "提示", "没有数据！");
            }
            this.loading = false;
        }).fail(data => {
            this.showSuccess("error", "提示", "查询失败！");
            this.loading = false;
        });

    }
    /**
     * 导出
     */
    exportCSV($event){
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
        this.api.call('AftermarketTaskController.returnDispatchList', {
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
     * 执行查询操作
     */
    public doSearch(): any {
        ////console.log("doSearch");
        this.load({
            first: 0,
            rows: 10
        });
        this.selectLineInfo.length = 0;
    }

    /*隐藏按钮 */
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

    /**
     * 弹框显示
     * @param result
     */
    isshowVerify: boolean = false;//确认分配
    isshowAccept: boolean = false;//确认受理
    isreservation: boolean = false;//提货
    isoperationEnd: boolean = false;//终止订单
    istraceWin: boolean = false;
    isShowCancelWin: boolean = false;//取消分配
    isShowPickFinishWin: boolean = false;//返货完成

    selectOneDataMsg: string = "请选择一条数据！";


    /**
     * 错误提示
     * @param msg
     */
    showErroHint(msg) {
        this.showSuccess("warn", "错误提示", msg);
    }

    /**
     *
     * @param终止订单
     */
    showOperation() {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length == 0) {
            this.showErroHint(this.selectOneDataMsg);
            return;
        }
        this.isoperationEnd = true;
        this.mask.show();
    }

    //弹框
    showWin(who) {
        //单选判断
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return
        }
        if (this.selectLineInfo.length == 0) {
            this.showErroHint(this.selectOneDataMsg);
            return;
        }
        switch (who) {
            case 'confirm-allocation'://确认分配师傅
                if (this.selectedRowData.taskStsTag != "waitDistribution") {
                    // confirm("请选择待分配任务!");
                    this.showSuccess("warn", "提示", "请选择待分配任务");
                    return;
                }
                if (!this.selectedRowData.vRepairTaskName) {
                    // confirm("请先分配师傅！");
                    this.showSuccess("warn", "提示", "请先分配师傅！");
                    return;
                }
                this.isshowVerify = true;
                this.mask.show();
                break;
            case 'accept-win':  //受理
                if (this.selectedRowData.taskStsTag != "distributionWaitAccept") {
                    // confirm("请选择待受理任务!");
                    this.showSuccess("warn", "提示", "请选择待受理任务!");
                    return;
                }
                this.isshowAccept = true;
                this.mask.show();
                break;
            case 'cancel-allocation':   //取消分配
                //debugger;
                if (this.selectedRowData.taskStsTag === "distributionWaitAccept"
                    || this.selectedRowData.taskStsTag === "accepted"
                    || this.selectedRowData.taskStsTag === "waitPickUp") {
                    this.isShowCancelWin = true;
                } else {
                    // confirm("该任务不可取消!");
                    this.showSuccess("warn", "提示", "该任务不可取消!");
                    return;
                }
                break;
            case 'stop-bill':   //终止订单
                if (this.selectedRowData.taskStsTag === "doSign") {
                    // confirm("该任务不可终止哦!");
                    this.showSuccess("warn", "提示", "该任务不可终止哦!");
                    return;
                }
                if (this.selectedRowData.taskStsTag === "invalid") {
                    // confirm("该任务已终止!");
                    this.showSuccess("warn", "提示", "该任务已终止!");
                    return;
                }
                this.isoperationEnd = true;
                break;
            case 'trace-win':   //跟踪
                if (this.selectLineInfo[0]) {
                    this.selectLineInfo[0].whatType = "task";//添加跟踪信息
                }
                if (this.selectedRowData.taskStsTag === "invalid") {
                    // confirm("该任务已终止!");
                    this.showSuccess("warn", "提示", "该任务已终止！");
                    return;
                }
                // this.selectLineInfo[0].whatType = "task";
                this.istraceWin = true;
                this.mask.show();
                break;
            case 'pick-good':   //确认提货
                if (this.selectedRowData.taskStsTag != "accepted") {
                    // confirm("请选择待提货任务!");
                    this.showSuccess("warn", "提示", "请选择待提货任务!");
                    return;
                }
                if (this.selectedRowData.direct) {
                    this.showSuccess("warn", "提示", "不能操作网点的任务!");
                    return;
                }
                this.isreservation = true;
                this.mask.show();
                break;
            case 'pick-good-finish':    //返货完成
                //debugger;
                if (this.selectedRowData.taskStsTag != "waitPickUp") {
                    // confirm("请选择已提货任务!");
                    this.showSuccess("warn", "提示", "请选择已提货任务！");
                    return;
                }
                if (this.selectedRowData.direct) {
                    this.showSuccess("warn", "提示", "不能操作网点的任务!");
                    return;
                }
                this.isShowPickFinishWin = true;
                this.mask.show();
                break;
        }
    }

    /*公用弹框*/
    /*alert(msg: string, title?: string, cb?: any) {
     this.confirmationService.confirm({
     message: msg,
     header: title || '提示',
     accept: (e) => {
     if (cb) {
     cb(e);
     }
     }
     });
     }*/

    /*
     * 确认添加跟踪*/
    oSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();//刷新
        this.selectLineInfo.length = 0;
        this.istraceWin = false;//跟踪
        this.mask.hide();
        window['epInstance'].emit('update_submenu_info');
    }

    /**
     * 刷新页面
     * @param isRefresh
     */
    refreshtable(isRefresh: boolean) {
        ////console.log(isRefresh);
        this.doSearch();
    }

    hideWin(isHide: boolean) {
        this.isshowVerify = isHide;//确认分配
        this.isshowAccept = isHide;//确认受理
        this.isreservation = isHide;	//提货
        this.istraceWin = isHide;//跟踪
        this.isShowCancelWin = false;//取消分配
        this.isShowPickFinishWin = false;//返货完成
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
     * 受理保存*/
    acceptSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.isshowAccept = false;
        this.mask.hide();
        this.doSearch();//刷新
        this.nodeRefresh();
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
     * 提货确认*/
    pickGoods() {
        this.isreservation = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();
        this.nodeRefresh();
        this.selectLineInfo.length = 0;
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
     * 返货完成确定刷新
     */
    doGoodsFinish() {
        this.isShowPickFinishWin = false;
        this.mask.hide();
        this.selectLineInfo.length = 0;
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch();
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

    /**
     * 选定行
     * @param row
     */
    tasksStatus: string;//任务状态
    rowSelect(row) {
        this.selectedRowData = row[0];
        this.selectsRowData = row;
        this.len = row.length;
        this.selectLineInfo = row;
        this.tasksStatus = this.selectedRowData.taskStsTag;//按钮切换
        //过滤, 只要跟第一次选中的状态不一致就选不中
        let data = row.filter(item => {
            if(item.taskSts != row[0].taskSts){
                this.showSuccess("warn", "提示", "只能选择相同任务状态的数据");
            }
            return item.taskSts == row[0].taskSts;
        });
        this.selectLineInfo = data;
    }

    cellClick(cell): void {
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
    nodeRefresh(){
        this.api.call("aftermarketTaskController.getAftermarketListTopNum").ok(data=>{

            this.navNumber[0] = data.result.backNumOfStatus.allNum || 0;
            this.navNumber[1] = data.result.backNumOfStatus.waitDistributionNum || 0;
            this.navNumber[2] = data.result.backNumOfStatus.acceptedNum || 0;
            this.navNumber[3] = data.result.backNumOfStatus.waitPickUpNum || 0;
            this.navNumber[4] = data.result.backNumOfStatus.doSignNum || 0;
            this.navNumber[5] = data.result.backNumOfStatus.goodsArrive || 0;
            this.navNumber[6] = data.result.backNumOfStatus.returnCustomer || 0;
            this.navNumber[7] = data.result.backNumOfStatus.invalidNum || 0;
        }).fail(err=>{

        })
    }

    /**
     * 显示隐藏货物外发、货物到达、返回客户弹窗
     * @param which
     */
    showModal(which){
        if(this.selectedRowData){
            this.showWhichWin = which;
            this.mask.show();
        }else {
            this.showSuccess('warn','提示','请选择一条数据！');
        }
    }
    closeWin(e){
        this.showWhichWin = '';
        this.mask.hide();
        if(e){
            this.showSuccess('success','提示','操作成功！');
            this.doSearch();
            this.nodeRefresh();
        }
    }
}
