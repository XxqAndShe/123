import {ExceptionDealService} from "../../service/exception-deal.service";
import {WaybillAbnormalRequestVo} from "../../vo/waybill-abnormal-request.vo";
import {AbnormalDutyRequestVo} from "../../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-duty-request.vo";
import {BasicSettingService} from "../../../../../base-set/page/basic-manage/service/basic-setting.service";
import {ExceptionDataService} from "../../../../../base-set/page/basic-manage/service/exception-data.service";
import {AbnormalTypeRequestVo} from "../../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
import {API} from "../../../../../../share/lib/api/api";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {OrderInfoComponent} from "../../share/order-info.component";
import {AreaService} from "../../../../../../share/app-service/area.service";
import {
    Component, trigger, state, style, transition, animate, OnInit, ViewChild,
    AfterViewInit
} from "@angular/core";
import {modalAnimation} from "../../../../../../share/animation/modalAnimation.animation";
import {DatePipe} from "@angular/common";
import {overlayPanelShow, overlayPanelHide} from "../../../../../../share/utils/gridUtil";
import {ActivatedRoute} from "@angular/router";

@Component({
    templateUrl: './exception-deal.component.html',
    styleUrls: ['./exception-deal.component.css'],
    animations: [
        modalAnimation,
        trigger('showSelect', [
            state('show', style({
                display: 'block'
            })),
            state('hide', style({
                display: 'none'
            })),
            transition('hide<=>show', animate('180ms ease-in'))
        ])
    ]
})

export class ExceptionDealComponent implements OnInit, AfterViewInit {
    loading: boolean;
    dateTimeFormat: string = "yyyy-MM-dd HH:mm:ss";
    waybill: any = {
        oldWayBillID: "",
        orderId: "",
        operator: {realName: ""},
        operatDate: "",
        customerId: "",
        endCity: "",
        orderSourceCode: "",
        serviceType: {label: ""},
        arriveId: "",
        salesName: "",
    };

    /**
     * 保存上次查询的event对象
     */
    lastTimeSearchEvent: any;
    @ViewChild(OrderInfoComponent)
    public subOrderInfo: OrderInfoComponent;
    /*点击表格显示订单号详细信息*/
    showOrderInfo() {
        this.requestData();
        let tar = document.getElementById('order_info_box');
        this.subOrderInfo.infoBox.clickTableItem('hide', tar)
    }

    //输入框组件
    public temp: string;
    public suggestionResult: string[];//查询建议结果
    selectLineInfo: any[] = [];//跟踪传参
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

    public selectNum = 0;
    //当前订单节点类型选项
    navCur: boolean[] = [true, false, false, false, false, false, false, false, false];
    navNum: number = 0;
    //地址插件
    addrSelectHidden = true;
    areaText = "";

    isLock = false;
    isSelect = false;
    public selectState: string = 'hide';
    len: number = 0;//选中列表的数量

    selectedWaybillAbnormal: any;
    selections: any;
    selected;//用于显示选中数据条数
    showExceptionRecord: boolean = false;//用于控制登记异常窗口显示隐藏

    // 异常处理
    public waybillAbnormalRequestVo: WaybillAbnormalRequestVo;
    public requestVo: WaybillAbnormalRequestVo;
    // 异常类型
    public abnormalTypeRequestVo: AbnormalTypeRequestVo;
    public abnormalBigType = [];
    public abnormalSmallType = [];
    // 责任方
    public abnormalDutyRequestVo: AbnormalDutyRequestVo;
    public abnormalDuty = [];
    public abnoDutyFlag = true; // 获取责任方标志

    // 总记录数
    public totalElements: string;
    // 未处理总数
    public nohandleTotal: number;
    // 已处理总数
    public hashandleTotal: number;
    // 已结束总数
    public hasendTotal: number;
    // 转理赔总数
    public turnclaimsTotal: number;
    // 处理中总数
    public handleingTotal: number;
    // 否决总数
    public vetoTotal: number;
    // 跟踪总数
    public trackTotal: number;

    cellOverEvent: any;
    trackInfo: any = [];
    columns: any[] = [];
    data: any;
    msgs: any//提示弹框

    public area: string;
    currentUser: any;
    dataHandler: Function = this.areaService.selectBoxHandler();

    constructor(public _activatedRoute: ActivatedRoute,
                public exceptionDealService: ExceptionDealService,
                public basicSettingService: BasicSettingService,
                public exceptionDataService: ExceptionDataService,
                public api: API,
                public datepickerService: DatepickerService,
                public mask: ShowOrHideMaskService,
                public areaService: AreaService,
                public datePipe: DatePipe) {
    }

    ngOnInit() {
        this.waybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
        this.requestVo = new WaybillAbnormalRequestVo();
        this.abnormalTypeRequestVo = new AbnormalTypeRequestVo();
        this.abnormalDutyRequestVo = new AbnormalDutyRequestVo();

        //设默认值
        this.waybillAbnormalRequestVo.abnoHandleSts = 'All';
        this.waybillAbnormalRequestVo.source = 'All';
        this.waybillAbnormalRequestVo.abnormalDutyId = 'All';
        this.waybillAbnormalRequestVo.ifTrack = 'All';
        this.waybillAbnormalRequestVo.ifReply = 'All';
        this.waybillAbnormalRequestVo.ifLock = 'All';
        this.waybillAbnormalRequestVo.ifUrgent = 'All';
        this.waybillAbnormalRequestVo.ifArbitrate = 'All';
        this.waybillAbnormalRequestVo.client = "yes";//可处理默认为是

        // this.getAbnormalBigType();
        // this.findAbnoHandleAmount();
        this.initColumns();
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        // this.findOrg();
        this.getAbnormalCount();
    }

    ngAfterViewInit(): void {
        //获取路由参数
        let index = this._activatedRoute.snapshot.params['id'] || 0;
        let num = Number(index);
        //首页路由跳转选中未处理tab
        if (!isNaN(num) && num !== 0) {
            this.selectCur(null, num);
        }
    }

    vTrack: any = {};
    selectionRow: any;
    public traceWinState: any = 'hide';
    public exceptionModify: string = 'hide';
    public controlException: string = 'hide';
    public acceptedState: any = 'hide';
    traceIf: boolean = false;//添加跟踪
    exceptionView: boolean = false;
    //显示对话框
    showDialog(who: any) {
        // if(this.selectedWaybillAbnormal == null){
        //     alert("请选择要操作的异常信息");
        //     return;
        // }
        //判断单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        switch (who) {
            case 'exception-handle':
                if (this.selectLineInfo.length == 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据");
                } else {
                    if ((this.selections.abnoHandleStsName === '未处理' || this.selections.abnoHandleStsName === '处理中') &&
                        (!this.selections.handlePersonId || this.selections.handlePersonId == this.currentUser.mobile)) {
                        this.controlException = 'show';
                    } else {
                        this.exceptionView = true;
                    }
                    this.mask.show();
                    //console.log(this.selections, ' this.selection');
                }
                break;
            case 'exception-modify':
                if (this.selectLineInfo.length == 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据");
                } else {
                    this.exceptionModify = 'show';
                    this.mask.show();
                }
                break;
            case 'trace-win':
                //添加跟踪任务类型
                if (this.selectLineInfo[0]) {
                    this.selectLineInfo[0].whatType = "abnormal";
                }
                if (this.selectLineInfo.length == 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据");

                } else {
                    this.selectionRow = [{
                        vAbnormal: {
                            id: this.selections.id
                        }
                    }];
                    this.traceIf = true;
                    this.traceWinState = 'show';
                    this.mask.show();
                }
                break;
            case 'accepted':
                this.acceptedState = 'show';
                this.mask.show();
                break;
            case 'exception-record':
                // if(this.selections == null){
                //     this.showSuccess("error","提示","请选择一条数据");
                // }else{
                this.showExceptionRecord = true;
                this.mask.show();
                // }
                break;
        }
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    hideDialog(who: any) {
        // this.showOrderInfo();
        // ////console.log(111);
        switch (who) {
            case 'exception-handle':
                this.controlException = 'hide';
                break;
            case 'exception-modify':
                this.exceptionModify = 'hide';
                this.doSearch({first: 0, rows: 10});
                break;
            case 'accepted':
                this.acceptedState = 'hide';
                break;
            case 'exception-record':
                this.showExceptionRecord = false;
                break;
            case 'exception-view':
                this.exceptionView = false;
                break;
            case false:
                this.traceWinState = 'hide';
                break;
        }
        this.mask.hide();
    }

    /*
     * 登记异常确认*/
    saveDialog() {
        this.showExceptionRecord = false;
        this.controlException = 'hide';
        this.mask.hide();
        this.doSearch({first: 0, rows: 10});
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.showSuccess("success", "提示", "操作成功");
    }

    /**
     * 异常登记（无需点击列表）
     */
    public showAbnormalBox(): any {
        this.showExceptionRecord = true;
        this.mask.show();
    }


    /*
     * 确认添加跟踪*/
    oSave() {
        this.showSuccess("success", "提示", "操作成功");
        this.doSearch({first: 0, rows: 10});//刷新
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.traceIf = false;
        this.traceWinState = 'hide';
        this.mask.hide();
    }


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

    //选择当前nav操作
    selectCur($event, cur) {
        if (!$event) {
            $event = {
                first: 0,
                rows: 10
            }
        }
        this.navNum = cur;
        for (let i = 0, len = this.navCur.length; i < len; i++) {
            this.navCur[i] = false
        }
        this.navCur[cur] = true;

        switch (cur) {
            case 0:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'All';
                this.load($event);
                break;
            case 1:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'nohandle';
                this.load($event);
                break;
            case 2:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'handleing';
                this.load($event);
                break;
            case 3:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'hashandle';
                this.load($event);
                break;
            case 4:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'veto';
                this.load($event);
                break;
            case 5:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'hasend';
                this.load($event);
                break;
            case 6:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'turnclaims';
                this.load($event);
                break;
            case 7:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'All';
                this.load($event);
                break;
            case 8:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'nohandle';
                this.load($event);
                break;
            case 9:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'nohandle';
                this.load($event);
                break;
            default:
                this.waybillAbnormalRequestVo.abnoHandleSts = 'All';
                this.load($event);
        }
    }

    //点击nav操作
    clickNav($event, cur) {
        //console.log($event, 'clickNav');
        this.selectCur($event, cur);
    }

    //点击筛选框操作
    changeSelect() {
        this.selectState = this.selectState === 'hide' ? 'show' : 'hide';
        this.isSelect = !this.isSelect;
        if (this.abnoDutyFlag) {
            // this.findAbnormalDuty();
            this.abnoDutyFlag = false;
        }
    }

    // 日历插件 START
    zh: any = this.datepickerService.locale();
    yearRange: string = "2000:2020";
    inputStyle: any = { // 输入框样式
        'width': 98 +'px',
        'height': 30 + 'px',
        'textAlign': 'center',
        'cursor': 'default'
    };
    // 日历插件 END

    changeAddrText(result: any) {
        this.areaText = result.areaText;
        this.addrSelectHidden = result.addrSelectHidden;
    }

    /**
     * 查询
     * @param $event
     */
    doSearch($event) {
        this.load($event);
    }

    /**
     * 加载异常列表
     * @param $event
     * @param abnoHandleSts
     *          异常状态
     */
    load($event): any {
        let registerTimeBegin = this.waybillAbnormalRequestVo.registerTimeBegin;
        let registerTimeEnd = this.waybillAbnormalRequestVo.registerTimeEnd;
        let trackTimeStart = this.waybillAbnormalRequestVo.trackDateStart;
        let trackTimeEnd = this.waybillAbnormalRequestVo.trackDateEnd;
        let hanTimeBegin = this.waybillAbnormalRequestVo.hanTimeBegin;
        let hanTimeEnd = this.waybillAbnormalRequestVo.hanTimeEnd;
        if (registerTimeBegin) {
            let rStartTime = this.datePipe.transform(registerTimeBegin, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.registerTimeBegin = rStartTime;
        }
        if (registerTimeEnd) {
            let rEndTime = this.datePipe.transform(registerTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.registerTimeEnd = rEndTime;
        }
        if (trackTimeStart) {
            let tts = this.datePipe.transform(trackTimeStart, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.trackDateStart = tts;
        }
        if (trackTimeEnd) {
            let tte = this.datePipe.transform(trackTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.trackDateEnd = tte;
        }
        if (hanTimeBegin) {
            let hts = this.datePipe.transform(hanTimeBegin, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.hanTimeBegin = hts;
        }
        if (hanTimeEnd) {
            let hte = this.datePipe.transform(hanTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.hanTimeEnd = hte;
        }
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.lastTimeSearchEvent = $event;
        if (this.waybillAbnormalRequestVo) {
            Object.assign(this.requestVo, this.waybillAbnormalRequestVo);
        }
        if (this.navNum == 7) {
            this.requestVo.ifTrack = 'track';
        }
        if (this.navNum == 8) {
            this.requestVo.overTime = 'handle';
        } else if (this.navNum == 9) {
            this.requestVo.overTime = 'remind';
        } else {
            this.requestVo.overTime = null;
        }
        this.loading = true;
        this.api.call("AbnormalController.abnormalSearch", this.requestVo, $event).ok(data => {
            this.data = data.result;
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
        let registerTimeBegin = this.waybillAbnormalRequestVo.registerTimeBegin;
        let registerTimeEnd = this.waybillAbnormalRequestVo.registerTimeEnd;
        let trackTimeStart = this.waybillAbnormalRequestVo.trackDateStart;
        let trackTimeEnd = this.waybillAbnormalRequestVo.trackDateEnd;
        let hanTimeBegin = this.waybillAbnormalRequestVo.hanTimeBegin;
        let hanTimeEnd = this.waybillAbnormalRequestVo.hanTimeEnd;
        if (registerTimeBegin) {
            let rStartTime = this.datePipe.transform(registerTimeBegin, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.registerTimeBegin = rStartTime;
        }
        if (registerTimeEnd) {
            let rEndTime = this.datePipe.transform(registerTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.registerTimeEnd = rEndTime;
        }
        if (trackTimeStart) {
            let tts = this.datePipe.transform(trackTimeStart, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.trackDateStart = tts;
        }
        if (trackTimeEnd) {
            let tte = this.datePipe.transform(trackTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.trackDateEnd = tte;
        }
        if (hanTimeBegin) {
            let hts = this.datePipe.transform(hanTimeBegin, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.hanTimeBegin = hts;
        }
        if (hanTimeEnd) {
            let hte = this.datePipe.transform(hanTimeEnd, this.dateTimeFormat);
            this.waybillAbnormalRequestVo.hanTimeEnd = hte;
        }
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.lastTimeSearchEvent = $event;
        if (this.waybillAbnormalRequestVo) {
            Object.assign(this.requestVo, this.waybillAbnormalRequestVo);
        }
        if (this.navNum == 7) {
            this.requestVo.ifTrack = 'track';
        }
        if (this.navNum == 8) {
            this.requestVo.overTime = 'handle';
        } else if (this.navNum == 9) {
            this.requestVo.overTime = 'remind';
        } else {
            this.requestVo.overTime = null;
        }
        this.api.call('AbnormalController.abnormalSearch', this.requestVo, {
            first:0,
            rows:99999999
        })
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    /**
     * 获取责任方
     */
    // findAbnormalDuty(): void {
    //     this.abnormalDutyRequestVo.rows = '99';
    //     this.basicSettingService.getBasicSetting(data => {
    //         this.abnormalDuty = data.content;
    //         ////console.log(this.abnormalDuty);
    //     }, this.abnormalDutyRequestVo, 'baseConfigApiController.getAbnormalDuty', 'abnormalDuty')
    // }

    /**
     * 获取开单网点
     */
    // findOrg(): void{
    //     this.org = [];
    //     this.org.push({label:"请选择", value:""});
    //     // //console.info("orgbegin");
    //     this.api.call("OrganizationApiController.queryOrganizations",{
    //     }).ok(json => {
    //         for(let i of json.result){
    //             this.org.push({label:i.orgName, value:i.id});
    //         }
    //     }).fail(json => {
    //         console.error(json)
    //     })
    // }

    onRowSelect($event) {
        this.selections = $event[0];
        this.selected = $event;
        this.selectLineInfo = $event;
        this.len = $event.length;
        this.selectNum = this.selectLineInfo.length;
        this.selectLineInfo.length = this.selected.length;
        this.isLock = this.selections.lock;
    }

    //锁定/解锁
    lock(locked: boolean) {
        //判断是否单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectLineInfo.length == 0) {
            this.showSuccess("warn", "提示", "请选择要锁定/解锁的异常");
            return;
        }
        // ////console.log(this.selectedWaybillAbnormal);
        this.waybillAbnormalRequestVo.id = this.selections.id;
        this.waybillAbnormalRequestVo.lock = locked;
        ////console.log(this.waybillAbnormalRequestVo);
        this.api.call("AbnormalController.abnormalLockChang", this.waybillAbnormalRequestVo).ok(data => {
            // this.data = data.result;
            ////console.log(data);
            this.isLock = !this.isLock;
            this.selections.lock = locked;
            // alert(data.result.message);
            this.showSuccess("success", "提示", data.result.message);
        }).fail(data => {
            ////console.log(data);
            // alert(data.error);
            this.showSuccess("error", "提示", data.error);

        });
    }

    isAcept: string = 'hide';

    showaWin() {
        if (this.selections == null) {
            this.showSuccess("warn", "提示", "请选择要受理的异常");
            return;
        }
        if (this.selections.accepted) {
            this.showSuccess("error", "提示", "请勿重复受理");
            return;
        } else {
            this.isAcept = 'show';
            this.mask.show();
        }
    }

    closeAWin() {
        this.isAcept = 'hide';
        this.mask.hide();
    }

    confirmAccepted() {
        this.showSuccess("success", "提示", "操作成功");
        this.isAcept = 'hide';
        this.mask.hide();
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.doSearch(this.lastTimeSearchEvent);//刷新表格数据
        this.getAbnormalCount();//刷新节点数据

    }

    //各异常状态的数量
    abnormalCount: any = {};

    getAbnormalCount() {
        this.api.call("AbnormalController.abnormalCount").ok(data => {
            this.abnormalCount = data.result;
            ////console.log(data);
        }).fail(data => {
            ////console.log(data);
            // alert(data.error);
            this.showSuccess("error", "提示", data.error);

        });
    }

    //点运单号弹框
    modalState: string = 'out';
    showWaybillDetail: boolean = false;
    showReturnDetail: boolean = false;
    showRepairDetail: boolean = false;

    displayModal(which) {
        let that = this;
        switch (which){
            case 'waybill':
                this.showWaybillDetail = true;
                break;
            case 'return':
                this.showReturnDetail = true;
                break;
            case 'repair':
                this.showRepairDetail = true;
                break;
        }
        setTimeout(function () {
            that.modalState = 'in';
        }, 0);
    }

    closeModal() {
        let that = this;
        this.modalState = 'in';
        setTimeout(function () {
            that.showWaybillDetail = false;
            that.showReturnDetail = false;
            that.showRepairDetail = false;
        }, 200);
    }

    cellClick(cell) {
        this.selections = cell.row;
        if (cell.field == 'waybillId') {
            if(cell.row.taskType === '调度任务'){
                this.displayModal('waybill');
            }
            if(cell.row.taskType === '返货任务'){
                this.displayModal('return');
            }
            if(cell.row.taskType === '维修任务'){
                this.displayModal('repair');
            }
            if(cell.row.taskType === '自提'){
                this.showSuccess("warn", "提示", "自提任务无法查看详情！");
            }
        }
        if (cell.field == 'abnormalNum') {
            if (cell.row.abnoHandleStsName === '未处理' || cell.row.abnoHandleStsName === '处理中') {
                this.showSuccess("info", "提示", "当前记录未进行异常处理，无法查看处理信息！");
                return;
            }
            else if (cell.row.abnoHandleStsName === '已处理' || cell.row.abnoHandleStsName === '否决' || cell.row.abnoHandleStsName === '转理赔' || cell.row.abnoHandleStsName === '已结束') {
                this.exceptionView = true;
            }
        }
    }

    //取消选中表格数据
    cancelSelect() {
        this.selectLineInfo = [];
        this.selectNum = 0;
    }

    //记载订单信息

    //查询运单基础信息
    requestData() {
        ////console.log(this.selected);
        let abnormal = this.selected[0].waybillId;

        // // waybillId
        this.api.call("AbnormalRegistController.queryWaybillInfo", {
            id: abnormal
        }).ok(json => {
            // //console.log(json.result)
            this.waybill = json.result;
        }).fail(fail => {
            //console.log(fail)
        })

        let goods = this.waybill.waybillGoods;

    }

    //弹窗确认的回调
    confirm() {
        this.controlException = 'hide';
        this.isAcept = 'hide';
        this.mask.hide();
        this.selectLineInfo = [];
        this.selectNum = 0;
        this.doSearch(this.lastTimeSearchEvent);//刷新表格数据
        this.getAbnormalCount();//刷新节点数据
    }

    /**
     * 接收异常信息是否点击订单号触发订单详情信息
     * @param e
     */
    receiveWaybill(e: any) {
        if(e){
            this.displayModal('waybill');
        }
    }
    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: 'taskType',
            header: '类型'
        });
        this.columns.push({
            field: "abnormalNum",
            header: "异常编号",
            sortable: false,
            filter: true,
            width: "200px",
            link: true
        });

        this.columns.push({
            field: "waybillId",
            header: "任务号",
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
            // field: "waybill.waybillId",     // ?
            field: "trackContent",
            header: "跟踪信息",
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
            field: "consigneeMobile",
            header: "收货手机号码",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "sourceLabel",
            header: "来源",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalTypeName",
            header: "异常类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalTypeChildren",
            header: "异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "describe",
            header: "异常描述",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "picUrl",
            header: "描述图片",
            sortable: false,
            filter: true,
            thumbnail: true
        });
        this.columns.push({
            field: "shipper",
            header: "发货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "billDepart",
            header: "开单网点",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "endCity",
            header: "目的地",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnoHandleStsName",
            header: "异常状态",
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
            field: "registerDept",
            header: "登记部门",
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
            field: "feedBackPhone",
            header: "联系方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDutyName",
            header: "责任方",
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
            field: "title",
            header: "任务单号",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "urgentLabel",
            header: "是否紧急",
            sortable: false,
            width: "70px",
            filter: true
        });
        this.columns.push({
            field: "replyLabel",
            header: "是否回复",
            sortable: false,
            width: "70px",
            filter: true
        });
        this.columns.push({
            field: "arbitratedLabel",
            header: "是否仲裁",
            sortable: false,
            width: "70px",
            filter: true
        });
        this.columns.push({
            field: "acceptedLabel",
            header: "是否受理",
            sortable: false,
            width: "70px",
            filter: true
        });
        this.columns.push({
            field: "trackStatus",
            header: "跟踪状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "trackTime",
            header: "跟踪时间",
            sortable: false,
            filter: true,
        });
    }

}
