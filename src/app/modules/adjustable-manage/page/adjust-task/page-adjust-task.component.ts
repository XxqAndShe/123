import {Component, OnInit} from "@angular/core";
import {SetTableStyleService} from "../../service/set-table-style.service";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {AdjustableResponseVo} from "../../vo/adjustable-response.vo";
import {AdjustTaskService} from "../../service/adjust-task.service";
import {AdjustableModuleVoService} from "../../service/adjustable-module-vo.service";
import {AdjustableRequestVo} from "../../vo/adjustable-request.vo";
import {API} from "../../../../share/lib/api/api";
import {TaskNodeType} from "../../vo/task-node-type";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {orderBtnAnimation} from "../../share/order-btn.animation";
import {AreaService} from '../../../../share/app-service/area.service';
import {ConfirmationService} from 'primeng/primeng';
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {Message} from 'primeng/primeng';
import {DatePipe} from "@angular/common";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";
import {overlayPanelHide} from "../../../../share/utils/gridUtil";
@Component({
    templateUrl: './page-adjust-task.component.html',
    styleUrls: ['./page-adjust-task.component.css', '../../share/common.css'],
    animations: [
        orderBtnAnimation,
        modalAnimation
    ]
})
export class PageAdjustTaskComponent implements OnInit {
    //组件传参交互专用
    transfer: any;
    //点击表格数据
    selectionRow: any[] = [];
    selected: any[] = [];//用于显示选中数据条数
    //签收
    SignIf: boolean = false;
    // 货品展示
    goodsShow: any = [];
    // 跟踪信息
    trackInfo: any = [];
    // 预约信息明细
    appointmentDetails: any = [];
    // 货品明细统计功能
    loading: boolean;

    getProductInfo(proData: any) {
        let data;
        data = proData;
        let infoObj = {
            tInstallNum: 0,
            tPackNum: 0,
            tWeight: 0,
            tVolume: 0,
            tUnitPrice: 0,
            tInstallationFee: 0
        };
        for (let i = 0; i < data.length; i++) {
            infoObj.tInstallNum += data[i]['installItems'];
            infoObj.tPackNum += data[i]['packingItems'];
            infoObj.tWeight += data[i]['weight'];
            infoObj.tVolume += data[i]['volumes'];
            infoObj.tUnitPrice += data[i]['price'];
            infoObj.tInstallationFee += data[i]['installCharge'];
        }
        return infoObj;
    }

    data: any;


    /**
     * 初始化，导入服务
     */
        // public taskQueryResponseVo: TaskQueryResponseVo = new TaskQueryResponseVo();
    taskQueryResponseVo: any[] = [];
    /**
     * 调度任务节点数量
     */
    public taskNodeType: TaskNodeType = new TaskNodeType();
    public tasksStatus: any = '';//任务状态
    public adjustableResponseVo: AdjustableResponseVo = new AdjustableResponseVo();
    public controlAbnormalBox: string = 'hide';
    // public btnState: string = 'show';//表格操作按扭状态
    // @ViewChild(OrderDetailComponent)
    // public subOrder: OrderDetailComponent;

    public tabType: string = "waitDistribution";
    // public followCtrl: boolean;

    public adjustableRequestVo: AdjustableRequestVo = new AdjustableRequestVo();

    selectNum: number = 0; // 选中项数

    constructor(public api: API, public mask: ShowOrHideMaskService,
                public set: SetTableStyleService, public adjustableVoService: AdjustableModuleVoService,
                public datePipe: DatePipe,
                public adjustTaskService: AdjustTaskService,
                public datePickerService: DatepickerService,
                public areaService: AreaService,
                public confirmationService: ConfirmationService,
                public RequestTokenService: RequestTokenService) {
    }

    reset(formObj: any) {
        if (formObj) {
            formObj.reset();
        }
    }

    /**
     * 查询调度任务列表
     * @param $event
     */
    load($event) {
        //克隆新对象
        let requestVo = _.clone(this.adjustableRequestVo);
        //取出日期
        let beginDate = requestVo.beginDate;
        let endDate = requestVo.endDate;
        //转换格式
        requestVo.beginDate = this.datePipe.transform(beginDate, 'yyyy-MM-dd HH:mm:ss');
        requestVo.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');
        //console.log(requestVo);
        this.api.call('taskInstallController.findTaskInstall', $event, requestVo)
            .ok(data => {
                this.loading = false;
                this.data = data.result;
            })
            .fail(err => {
                this.showSuccess("error", "提示", "查询失败！");
                this.loading = false;
            });
    }

    /**
     * selectLineInfo暂存选中行相关信息
     */
    selectLineInfo: any[] = [];

    //选中行事件，获取选中行相关信息
    rowSelect($event): any {
        let rows = $event[0] ? $event[0] : $event;
        this.selectLineInfo = $event;
        this.selectNum = this.selectionRow.length;
        this.tasksStatus = rows.taskStatus;
        this.selectionRow.length = this.selectLineInfo.length;
        this.transfer = this.selectLineInfo[0] && this.selectLineInfo[0] || (this.selectLineInfo || {});
        //添加跟踪
        if (this.selectLineInfo[0]) {
            this.selectLineInfo[0].whatType = "task";
        } else {
            this.selectLineInfo["whatType"] = "task";
        }
        //过滤, 只要跟第一次选中的状态不一致就选不中
        let data = $event.filter(item => {
            if (item.taskStatus != $event[0].taskStatus) {
                this.showSuccess("warn", "提示", "只能选择相同任务状态的数据");
            }
            return item.taskStatus == $event[0].taskStatus;
        });
        this.selectionRow = data;
    }

    /**
     * 选中的单元格数据
     */
    cellOverEvent: any;

    // hover查询信息
    trackInfoDetails: any = {};
    goodsDetailsCount: any = {};
    goodsDetails: any = {};
    appointmentTimeDetails: any = {};

    cellMouseEnter($event, ...restObj: any[]): any {
        // getProductInfo 为计算货物明细各项总数的方法 已定义
        let op1 = restObj[0];
        let op2 = restObj[1];
        let op3 = restObj[2];
        // 如果是跟踪信息字段则显示浮动窗口op
        if ($event.field == "tracks") {
            this.cellOverEvent = JSON.stringify($event);
            op1.toggle($event.originalEvent);
            op2 && op2.hide();
            op3 && op3.hide();

            this.trackInfoDetails.taskID = $event.row.id;
            this.trackInfoDetails.trackType = 'task';

            this.api.call("TaskDetailContorller.findTrack", $event, this.trackInfoDetails).ok(json => {
                this.trackInfo = json.result.content;
            }).fail((err) => {

            });
        }
        //如果是货品字段则显示浮动窗口op2
        else if ($event.field == "goods") {
            this.cellOverEvent = JSON.stringify($event);
            op2.toggle($event.originalEvent);
            op1 && op1.hide();
            op3 && op3.hide();
            //
            this.goodsDetails.taskID = $event.row['id'];
            this.goodsDetails.waybillId = $event.row['waybillId'];
            this.api.call("taskDetailContorller.findWaybillGoods", {first: 0, rows: 10}, this.goodsDetails)
                .ok(returnInfo => {
                    this.goodsShow = returnInfo.result.content;
                    this.goodsDetailsCount = this.getProductInfo(this.goodsShow);
                })
                .fail(data => {
                    this.showSuccess("error", "提示", "查询失败！")
                });

        } else if ($event.field == "appointmentTime") {
            this.cellOverEvent = JSON.stringify($event);
            op3.toggle($event.originalEvent);
            op1 && op1.hide();
            op2 && op2.hide();

            this.appointmentTimeDetails.taskID = $event.row.id;
            this.appointmentTimeDetails.waybillId = $event.row.waybillId;
            this.api.call("taskDetailContorller.findAppointment", {first: 0, rows: 10}, this.appointmentTimeDetails)
                .ok(returnInfo => {
                    this.appointmentDetails = returnInfo.result.content || [];

                })
                .fail(data => {
                    //console.info("查询失败！{}", data);
                    this.showSuccess("error", "提示", "查询失败！")
                });

        } else {
            op1 && op1.hide();
            op2 && op2.hide();
            op3 && op3.hide();
        }
    }

    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['tracks', 'goods', 'appointmentTime']);
    }


    /**
     * 表格字段点击事件
     * 建议在对应的column字段下添加link:true属性，使得字段值加上下划线，明显区别哪些字段可点击
     */
    //表格点击事件
    cellClick(event): void {
        if (event.field === 'waybillId') {
            this.selectionRow.length = 1;
            this.selectLineInfo = event.row;
            this.selectionRow[0] = event.row;
            this.displayModal();
        }
        //console.log(event.field);
    }


    //输入框组件
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
     * 初始化
     */
    ngOnInit() {
        this.initColumns();
        this.adjustableRequestVo.taskStatus = 'waitDistribution';
        this.getNodeType();
        // 设置下拉框默认值
        if (this.tabType == 'waitDistribution') {
            this.adjustableRequestVo.dateType = 'All';
            this.adjustableRequestVo.trunkSts = 'Ended';
            this.RequestTokenService.createToken();
        }
    }

    /**
     * 选择不同的单类型
     * @param event
     */
    selectOrderType(event) {
        let tar = event.target, selectShow, allType;
        if (tar.nodeName.toLowerCase() === 'span') {
            tar = event.target.parentNode;
        }
        if (tar.classList.contains('cur-select') || tar.nodeName.toLowerCase() === 'ul') {
            return;
        }
        else {
            let allType = document.querySelectorAll('#all_state_list>.list-item');
            for (let i = 0, len = allType.length; i < len; i++) {
                allType[i].classList.remove('cur-select');
            }
            tar.classList.add('cur-select');
        }
        allType = document.querySelectorAll('.spec-type');
        //console.log(allType);
        for (let j = 0, len = allType.length; j < len; j++) {
            allType[j].style.display = 'none';
        }
        switch (tar.id) {
            case 'dai_fen':
                selectShow = document.querySelector('#form_dfp>.dai-fen');
                break;
            case 'dai_jie':
                selectShow = document.querySelector('#form_dsl>.dai-jie');
                break;
            case 'dai_yue':
                selectShow = document.querySelector('#form_dyy>.dai-yue');
                break;
            case 'dai_shou':
                selectShow = document.querySelector('#form_dqs>.dai-shou');
                break;
            case 'already_shou':
                selectShow = document.querySelector('#form_yqs>.already-shou');
                break;
            case 'already_fei':
                selectShow = document.querySelector('#form_yzf>.already-fei');
                break;
            case 'all_type':
                selectShow = document.querySelector('#form_all>.all-type');
                break;
        }
        selectShow.style.display = 'block';
    }

    /**
     * 日历组件
     * @type {any}
     */
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 78 + 'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    /**
     * 点击面签触发
     * @param nodeType
     */
    public changeNodeType(nodeType, clear?: boolean): any {
        this.tabType = nodeType;
        if (clear) {
            //
            this.adjustableRequestVo = new AdjustableRequestVo();
        }
        this.getNodeType();
        this.adjustableRequestVo.taskStatus = nodeType;
        this.adjustableRequestVo.trunkSts = 'All';
        this.adjustableRequestVo.isNormalSign = 'All';
        this.adjustableRequestVo.trunkSts = 'All';
        this.adjustableRequestVo.dateType = 'All';
        this.selectNum = 0;
        this.selectionRow = [];

        this.doSearch();
    }

    /**
     * 执行查询操作
     */
    public doSearch($event?: any): any {
        this.loading = true;
        if (this.adjustableRequestVo.taskStatus == "doSign") {
            this.adjustableRequestVo.dateType = "sign";
        } else if (this.adjustableRequestVo.taskStatus == "invalid") {
            this.adjustableRequestVo.dateType = "invalid";
        }
        this.load({first: 0, rows: 10});
        this.selectionRow = [];
    }

    /**
     * 获取任务节点数
     */
    public getNodeType(): any {

        this.api.call('taskInstallController.getNodeTypeCount').ok(data => {
            this.taskNodeType = data.result;
        });
    }

    /**
     * 查看详情
     */
    public selectInfo(): any {
        if (this.selectLineInfo != null) {
            //console.log("详细信息" + this.selectLineInfo);
            this.adjustableRequestVo = new AdjustableRequestVo();

            this.adjustableVoService.getOrderType(this.adjustableResponseVo.orderType, this.orderType);
            this.adjustableVoService.getOrderInfo(this.adjustableResponseVo.orderInfo, this.orderInfo);
            this.adjustableVoService.getOrderBaseInfo(this.adjustableResponseVo.orderBaseInfo, this.orderBaseInfo);
            this.adjustableVoService.getPickUpGoodInfo(this.adjustableResponseVo.pickUpGoodInfo, this.pickUpGoodInfo);
            this.adjustableVoService.getSignInfo(this.adjustableResponseVo.signInfo, this.signInfo);


        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    }

    /**
     * 表格信息
     * @type {Array}
     */
    columns: any[] = [];

    initColumns(): void {
        this.columns.push({
            field: 'waybillId',
            header: "运单号",
            width: "140px",
            sortable: false,
            filter: true,
            link: true,
        });

        this.columns.push({
            // field: "waybill.traceInfo",
            field: "tracks",
            header: "跟踪信息",
            sortable: false,
            width: "100px",
            filter: true
        });

        this.columns.push({
            field: "matchType",
            header: "匹配类型",
            sortable: false,
            width: "80px",
            filter: true
        });

        //仅用于展示
        this.columns.push({
            field: "taskStatusShow",
            header: "任务状态",
            sortable: false,
            width: "80px",
            filter: true
        });

        this.columns.push({
            field: "matchingFailureReason",
            header: "匹配失败原因",
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
            //手动控制拼接添加
            field: "goods",
            header: "货品",
            sortable: false,
            width: "200px",
            filter: true,
        });
        this.columns.push({
            //手动控制拼接添加
            field: "remark",
            header: "开单备注",
            sortable: false,
            filter: true,
        });
        this.columns.push({
            //需要拷贝相关值
            field: "worker",
            header: "师傅/网点名称",
            sortable: false,
            filter: true
        });

        this.columns.push({
            //需要拷贝相关值
            field: "workerTel",
            header: "师傅/网点手机",
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
            field: "consigneeTel",
            header: "收货人号码",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "receiveAddress",
            header: "收货地址",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "branchFee",
            header: "支线费",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "installFee",
            // field: "waybill.InstallCharge",
            header: "安装费",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "replaceCharge",
            header: "代收货款",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "payType",
            header: "付款方式",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "payArrive",
            header: "到付",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "payCash",
            header: "现付",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "payMonth",
            header: "月结",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "payReturn",
            header: "回单付",
            sortable: false,
            filter: true
        });

        /*        this.columns.push({
         field: "waybillOutGoingName",
         header: "承运商",
         sortable: false,
         filter: true
         });*/

        this.columns.push({
            //自行拷贝数据
            field: "orgName",
            header: "开单网点",
            sortable: false,
            filter: true
        });

        this.columns.push({
            //需要拷贝相关值
            field: "createDate",
            header: "创建日期",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "trunkEndDate",
            header: "干线结束时间",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "pickUpTime",
            header: "提货时间",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "pickUpTel",
            header: "提货电话",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "pickUpAddress",
            header: "提货地址",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "packingNumber",
            header: "包装件数",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "items",
            header: "安装件数",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "volumes",
            header: "体积",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "weights",
            header: "重量",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "disTime",
            header: "分配时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "disPerson",
            header: "分配人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "countdown",
            header: "倒计时",
            sortable: false,
            filter: true,
            isNegative: true
        });
        this.columns.push({
            field: "acceptTime",
            header: "受理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "appointmentTime",
            header: "预约上门时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "signTime",
            header: "签收时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            // field: "invalidTime",
            field: "cancelDate",
            header: "作废日期",
            sortable: false,
            filter: true
        });
    }

    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();
    /*模拟数据start*/
    /*此orderType 为服务端返回的数据模型*/
    orderType = {};
    /*服务端返回的订单数据模型*/
    orderInfo: any;
    /*返回的订单基础信息*/
    orderBaseInfo: any;
    /*订单提货信息*/
    pickUpGoodInfo: any;
    /*订单签收信息*/
    signInfo: any = {
        signMan: '曾小贤',//签收人
        signState: '已经签收',//签收状态
        signDes: '有一名大帅哥',//签收描述
        signPic: ''//签收图片
    };
    /*模拟数据end*/
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /*取消签收*/
    CancelSignIf: boolean = false;

    CancelSign() {
        if (this.selectionRow.length >= 1) {
            this.CancelSignIf = true;
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认
    changeAssignment() {
        //刷新
        this.doSearch();
        this.getNodeType();
        this.CancelSignIf = false;
        this.mask.hide();
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //删除表格选中数据
        this.selectionRow = [];
    }

    //取消
    cancelCancelSign() {
        this.CancelSignIf = false;
        this.mask.hide();
    }


    /*取消分配*/
    cancelAllocationIf: boolean = false;

    cancelAllocation() {
        if (this.selectionRow.length >= 1) {
            this.cancelAllocationIf = true;
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据")
        }
    }

    /*
     * 确认取消分配*/
    NoAllocation() {
        //刷新
        this.doSearch();
        this.getNodeType();

        //隐藏弹窗
        this.cancelAllocationIf = false;
        this.mask.hide();
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //删除数据选中
        this.selectionRow = [];
    }

    /*取消和退出取消分配*/
    changeAllocation() {
        this.cancelAllocationIf = false;
        this.mask.hide();
    }

    /*公用弹框*/
    alert(msg: string, title?: string, cb?: any, cd?: any) {
        this.confirmationService.confirm({
            message: msg,
            header: title || '提示',
            accept: (e) => {
                if (cb) {
                    cb(e);
                }
            },
            reject: (e) => {
                if (cd) {
                    cd(e);
                }
            }
        });
    }

    /*添加跟踪信息*/
    public traceWinState: any = 'hide';//添加跟踪信息状态；
    traceIf: boolean = false;

    closeBtn() {
        // this.btnState = 'hide';
        this.selectionRow = [];
        this.selectNum = 0;
        this.tasksStatus = '';
    }

    showDialog(who: any) {
        if (this.selectionRow.length >= 1) {
            //console.log(this.selectLineInfo.length > 1);
            if (this.selectLineInfo.length > 1) {
                this.showSuccess("warn", "提示", "只能选择一条任务信息");
                return;
            }
            this.traceIf = true;
            switch (who) {
                case 'trace-win':
                    this.traceWinState = 'show';
                    break;
            }
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    /*
     * 确定*/
    oSave() {
        this.traceIf = false;
        this.traceWinState = 'hide';
        this.mask.hide();
        this.doSearch();//刷新
        this.getNodeType();
        this.selectNum = 0;
        this.showSuccess("success", "提示", "操作成功");
        window['epInstance'].emit('update_submenu_info');
    }

    /*
     * 取消*/
    hideDialog(who: any) {
        this.traceIf = false;
        switch (who) {
            case false:
                this.traceWinState = 'hide';
                break;
        }
        this.mask.hide();
    }


    /**
     * 确认分配
     */
    cAssignment() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        /*判断是否选择数据*/
        let record = this.selectLineInfo[0] && this.selectLineInfo[0] || (this.selectLineInfo || {});
        if (this.selectionRow.length >= 1) {
            let that = this;
            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: record.id
            }).ok(data => {
                this.alert("请确认所选择的 " + record.waybillId + " 任务，是否指派给 " + record.worker + " 师傅，确认费用是否合理！是否确认分配？", "提示",
                    function () {
                        that.api.call('taskInstallController.disWorker', {
                            dis: false,
                            taskId: record.id
                        }).ok(data => {
                            that.getNodeType();
                            that.doSearch();//刷新
                            that.selectionRow = [];//删除选中
                            that.showSuccess("success", "提示", "操作成功");
                        }).fail(err => {
                            that.showSuccess("error", "提示", record.waybillId + ":" + "操作失败");
                        });
                    }, function () {
                    });
            }).fail(data => {
                this.showSuccess("error", "提示", record.waybillId + ":" + data.error);
            });
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    };

    /**
     * 分配师傅
     * @type {string}
     */
    modelAssignMaster: string = 'out';
    assignIf: boolean = false;

    displayAssignMaster() {
        for (let i = 0; i < this.selectionRow.length; i++) {
            if (this.selectionRow[0].trunkEndDate == "") {
                this.showSuccess("warn", "提示", this.selectionRow[i].waybillId + "干线未结束");
                return
            }
        }
        /*判断是否选择数据*/
        if (this.selectionRow.length >= 1) {
            let that = this;
            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: this.selectLineInfo[0].id
            }).ok(data => {
                this.assignIf = true;
                setTimeout(function () {
                    this.modelAssignMaster = 'in';
                }, 0)
            }).fail(data => {
                this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error)
            });
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //分配
    changeAssign() {
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //刷新列表和节点
        this.getNodeType();
        this.doSearch();
        //关闭弹窗
        this.modelAssignMaster = 'out';
        setTimeout(() => {
            this.assignIf = false;
        }, 200)

    }

    //关闭分配师傅弹框
    closeAssignMaster() {
        this.modelAssignMaster = 'out';
        setTimeout(() => {
            this.assignIf = false;
        }, 200)

    }

    /**
     * 更改提货信息
     */
    ChangeIf: boolean = false;//弹框默认隐藏
    changeTake() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        /*判断是否选择数据*/
        if (this.selectionRow.length >= 1) {
            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: this.selectLineInfo[0].id
            }).ok(data => {
                this.ChangeIf = true;
                this.mask.show();
            }).fail(data => {
                this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error);
            });
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    /*确认*/
    onChangeInformationSure() {
        this.showSuccess("success", "提示", "操作成功！");
        this.doSearch();
        this.getNodeType();
        this.ChangeIf = false;
        this.mask.hide();
        //删除数据选中
        this.selectionRow = [];
    }

    /*取消*/
    onChangeInformation(i: string) {
        this.ChangeIf = false;
        this.mask.hide();
    }

    /**
     * 干线是否结束
     */
    // isFinish:boolean;

    /**
     * 干线结束
     */
    TrunkEndIf: boolean = false;

    trunkEnd() {
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {

            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: this.selectLineInfo[0].id
            }).ok(data => {
                this.showSuccess("warn", "提示", this.selectLineInfo[0].waybillId + "已操作过干线结束！");
            }).fail(data => {
                if (data.code == 156) {
                    this.TrunkEndIf = true;
                    this.mask.show();
                } else {
                    this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error);
                }
            });

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    /*确认*/
    trunkEndOver() {
        this.doSearch();//刷新
        this.getNodeType();
        this.TrunkEndIf = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
        //删除数据选中
        this.selectionRow = [];
    }

    /*取消*/
    trunkEndCancel() {
        this.TrunkEndIf = false;
        this.mask.hide();
    }

    // 右侧弹框-详情页
    detailIf: boolean = false;
    modalState: string = 'out';
    showDetailModal: boolean = false;

    displayModal() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            let that = this;
            this.showDetailModal = true;
            setTimeout(function () {
                that.modalState = 'in';
            }, 0);
        }

    }

    closeModal() {

        let that = this;

        this.modalState = 'out';

        setTimeout(function () {
            that.showDetailModal = false;
        }, 200);

    }

    /**
     * 预约及二次预约
     * @type {boolean}
     */
    orderWin: boolean = false;

    doOrder() {
        if (this.selectionRow.length >= 1) {
            this.orderWin = true;
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认预约
    changeWin(info?) {
        if (info === 'fail') {
            this.showSuccess("error", "提示", "操作失败！");
        } else if (info) {
            this.showSuccess("error", "提示", info);
        } else {
            this.showSuccess("success", "提示", "操作成功！");
        }
        this.doSearch();
        this.getNodeType();
        this.orderWin = false;
        this.mask.hide();
        //删除数据选中
        this.selectionRow = [];
    }

    hideWin() {
        this.orderWin = false;
        this.mask.hide();
    }

    /**
     * 接单
     */
    accept() {
        if (this.selectionRow.length >= 1) {
            this.alert('确认受理此单吗？', '提示', () => {
                this.api.call('taskInstallController.accepte', {
                    taskId: this.selectLineInfo[0].id
                }).ok(data => {
                    this.msgs.push({severity: 'info', summary: '提示', detail: '接单成功!'});
                    this.getNodeType();
                    this.doSearch();//刷新
                    this.selectionRow = [];
                    this.showSuccess("success", "提示", "操作成功！");
                }).fail(data => {
                    this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error);
                });
            });
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    /**
     * 提货
     */
        // 提货成功提示框
    msgs: Message[] = [];

    /**
     * 获取当前选择记录对象
     * @returns {any|any[]|{}}
     */
    getRecord() {
        let record = this.selectLineInfo[0] && this.selectLineInfo[0] || (this.selectLineInfo || {});
        return record;
    }

    openTakeGoods() {
        let record = this.getRecord();
        if (this.selectionRow.length >= 1) {
            this.alert('确认提货此单吗？', '提示', () => {
                this.api.call('taskInstallController.pickUp', {
                    taskId: record.id
                }).ok((data) => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '操作成功!'});
                        this.getNodeType();
                        this.doSearch();//刷新
                        this.selectionRow = [];
                        this.showSuccess("success", "提示", "操作成功！");
                    }
                ).fail((err) => {
                    //console.log(err);
                    if (err.code == 100) {
                        this.showSuccess("error", "提示", record.waybillId + ":" + err.error);
                    } else {
                        this.showSuccess("error", "提示", record.waybillId + ":" + err.error);
                    }
                });
            })
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    };


    /**
     * 异常登记（无需点击列表）
     */
    public showNotData(): any {
        this.abnormalIf = true;
        this.controlAbnormalBox = 'show';
        this.mask.show();
    }

    /**
     * 显示异常反馈框
     */
    abnormalIf: boolean = false;

    showAbnormalBox() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            this.abnormalIf = true;
            this.controlAbnormalBox = 'show';
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认
    hideAbnormalBox() {
        this.showSuccess("success", "提示", "操作成功！");
        this.doSearch();//刷新列表
        this.getNodeType();
        this.abnormalIf = false;
        this.controlAbnormalBox = 'hide';
        this.mask.hide();
        //删除数据选中
        this.selectionRow = [];
    }

    //取消
    record() {
        this.abnormalIf = false;
        this.controlAbnormalBox = 'hide';
        this.mask.hide();
    }

    /**
     * 签收
     * @type {string}
     */

    Sign() {
        if (this.selectionRow.length >= 1) {
            this.SignIf = true;
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认
    changeSearch() {
        this.showSuccess("success", "提示", "操作成功！");
        this.getNodeType();
        this.doSearch();//刷新
        this.SignIf = false;
        this.mask.hide();
        //删除数据选中
        this.selectionRow = [];
    }

    //取消
    onSign() {
        this.SignIf = false;
        this.mask.hide();
    }

    exportCSV($event) {
        //克隆新对象
        let requestVo = _.clone(this.adjustableRequestVo);
        //取出日期
        let beginDate = requestVo.beginDate;
        let endDate = requestVo.endDate;
        //转换格式
        requestVo.beginDate = this.datePipe.transform(beginDate, 'yyyy-MM-dd HH:mm:ss');
        requestVo.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59');
        this.api.call('taskInstallController.findTaskInstall', {
            first: 0,
            rows: 99999999
        }, requestVo)
            .ok(data => {
                $event.done($event.grid, data.result.content);
            })
            .fail(err => {
                $event.done(null, null, true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    /**
     * 标记48小时单
     */
    batcompletionRate48(type?: string) {
        let text = '标记';
        let endpoint = 'taskInstallController.batcompletionRate48';
        if (type === 'cancel') {
            endpoint = 'taskInstallController.batcancelCompletionRate48';
            text = '取消标记';
        }
        let taskIds = [];
        let ids = _.map(this.selectLineInfo, 'id');
        for (let id of ids) {
            let obj = {
                taskId: id
            };
            taskIds.push(obj);
        }

        this.alert(`确认${text}所选的 ${this.selectLineInfo.length} 条记录为48小时单吗？`, '提示', () => {
            this.api.call(endpoint, {taskIds: taskIds})
                .ok(data => {
                    this.getNodeType();
                    this.doSearch();//刷新
                    this.selectionRow = [];
                    this.showSuccess("success", "提示", "操作成功！");
                })
                .fail(err => {
                    this.showSuccess("error", "提示", "操作失败！");
                });
        });

    }
}

