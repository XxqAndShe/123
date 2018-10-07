import {Component, OnInit, AfterViewChecked, ViewChild} from '@angular/core';
import {SetTableStyleService} from '../../service/set-table-style.service';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service';
import {orderBtnAnimation} from "../../share/order-btn.animation";
import {API} from "../../../../share/lib/api/api";
import {ConfirmationService} from 'primeng/primeng';
import {Message} from 'primeng/primeng';
import {AdjustableModuleVoService} from "../../service/adjustable-module-vo.service";
import {AdjustableRequestVo} from "../../vo/adjustable-request.vo";
import {AdjustableResponseVo} from "../../vo/adjustable-response.vo";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {TimeAbnormalHeaderComponent}from"./time-abnormal-header.component";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";

@Component({
    templateUrl: './page-time-abnormal.componet.html',
    styleUrls: ['./page-time-abnormal.component.css', '../../share/common.css'],
    animations: [
        orderBtnAnimation,
        modalAnimation
    ]
})
export class PageTimeAbnormalComponent implements OnInit,AfterViewChecked {

    //选中列的运单号
    wayBill: string;

    selectionRow: any[] = [];
    selected: any[] = [];//用于显示选中数据条数
    //y绑定设置表格样式
    public controlAbnormalBox: string = 'hide';
    public btnState: string = 'show';//表格操作按扭状态
    abnormalIf: boolean = false;//异常登记
    constructor(public set: SetTableStyleService,
                public mask: ShowOrHideMaskService,
                public api: API,
                public adjustableVoService: AdjustableModuleVoService,
                public confirmationService: ConfirmationService,
                public RequestTokenService: RequestTokenService) {
    }

    public adjustableRequestVo: AdjustableRequestVo = new AdjustableRequestVo();
    public adjustableResponseVo: AdjustableResponseVo = new AdjustableResponseVo();

    // 提货成功提示框
    msgs: Message[] = [];
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    closeBtn() {
        // this.btnState='hide';
        this.selectionRow = [];
    }

    // 初始化列
    ngOnInit() {
        this.initColumns();
        this.RequestTokenService.createToken();
    }

    /*
     * 调用子组件的方法*/
    @ViewChild(TimeAbnormalHeaderComponent)
    public pageTime: TimeAbnormalHeaderComponent;
    /*
     * 刷新列表*/
    refTable() {
        this.pageTime.doSearch();
    }

    /**
     * 查询清空
     * @type {Array}
     */
    doSelect() {
        this.selectionRow = [];
    }

    rowSelect(row: any) {
        // ////console.log(row[0].waybill);
        this.selectLineInfo = row;
        this.taskId = this.selectLineInfo[0].id;
        ////console.log(this.taskId);
        this.wayBill = row[0].waybill;
        this.btnState = 'show';
        this.selectionRow.length = this.selectLineInfo.length;
        //过滤, 只要跟第一次选中的状态不一致就选不中
        let data = row.filter(item => {
            if (item.taskStatus != row[0].taskStatus) {
                this.showSuccess("warn", "提示", "只能选择相同任务状态的数据");
            }
            return item.taskStatus == row[0].taskStatus;
        });
        this.selectionRow = data;
    }

    columns: any[] = [];

    initColumns(): void {
        this.columns.push({
            field: "waybillId",
            header: "运单号",
            sortable: false,
            width: "140px",
            filter: true,
            link: true
        });
        this.columns.push({
            field: "master",
            header: "师傅/网点名称",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "masterPhoneNumber",
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
            field: "shipperPhoneNumber",
            header: "发货人电话",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "serviceType",
            header: "服务类型",
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
            field: "abnormalTimeHandelState",
            header: "处理状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "matchType",
            header: "匹配类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "assignTime",
            header: "分配时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "appointmentPrescription",
            header: "预约时效",
            sortable: false,
            filter: true,
            isNegative: true
        });
        this.columns.push({
            field: "installPrescription",
            header: "安装时效",
            sortable: false,
            filter: true,
            isNegative: true
        });
        this.columns.push({
            field: "branchFee",
            header: "支线费",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "installFee",
            header: "安装费",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "payWay",
            header: "付款方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "payAtDestination",
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
            field: "monthPay",
            header: "月结",
            sortable: false,
            filter: true
        });
    }

    // 右侧弹框
    modalState: string = 'out';
    showDetailModal: boolean = false;

    displayModal() {
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

    // 弹框
    abnormalWin: boolean = false;// 时效异常处理弹框

    /*取消签收*/
    CancelSignIf: boolean = false;

    CancelSign() {
        this.CancelSignIf = true;
        this.mask.show();
    }

    cancelCancelSign() {
        this.CancelSignIf = false;
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
                    cd(e)
                }
            },
        });
    }


    /*取消分配（移到人工调度）*/
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
        this.refTable();
        //隐藏弹窗
        this.cancelAllocationIf = false;
        this.mask.hide();
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //删除数据选中
        this.selectionRow = [];
    }

    /*取消或退出取消分配*/
    sureAllocation() {
        this.cancelAllocationIf = false;
        this.mask.hide();
    }

    //表格点击事件
    cellClick($event): void {
        if ($event.field === 'waybillId') {
            this.selectionRow.length = 1;
            this.selectLineInfo = $event.row;
            this.displayModal();
        }
    }

    /*更改提货信息*/
    ChangeIf: boolean = false;//弹框默认隐藏
    onChangeInformation() {
        this.ChangeIf = false;
        this.mask.hide();
    }

    /*干线结束*/
    TrunkEndIf: boolean = false;

    trunkEnd() {
        //console.info("trunkEnd");
        if (this.selectionRow.length >= 1) {
            //console.info(this.selectLineInfo);
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

    /*取消*/
    trunkEndCancel() {
        this.TrunkEndIf = false;
        this.mask.hide();
    }

    //已结束
    TrunkEndOver() {

        this.TrunkEndIf = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
        this.refTable();
        this.selectionRow = [];


    }

    //时效异常处理
    abnormalHandle() {
        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.abnormalWin = true;
            this.mask.show();
        }
    }

    //确定
    doWin() {
        this.abnormalWin = false;
        this.showSuccess("success", "提示", "操作成功");
        this.mask.hide();
        this.selectionRow = [];
        this.refTable()//刷新列表
    }

    selectLineInfo: any[] = [];
    taskId;
    any;

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

    hideWin(who) {
        switch (who) {
            case 'order':
                this.orderWin = false;
                break;
            case 'abnormal':
                this.abnormalWin = false;
                break;
        }
        this.mask.hide();
    }

    /*
     * 预约确认*/
    changeWin() {
        this.showSuccess("success", "提示", "操作成功！");
        this.orderWin = false;
        this.mask.hide();
        this.selectionRow = [];
        this.refTable()//刷新列表

    }

    /**
     * 签收
     * @type {string}
     */
    detailsInfo: any = 'waitDistribution';
    SignIf: boolean = false;

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
        this.refTable();//刷新列表
        this.selectionRow = [];
        this.SignIf = false;
        this.mask.hide();
    }

    //取消
    onSign() {
        this.SignIf = false;
        this.mask.hide();
    }

    /**
     * 查看详情
     */
    public selectInfo(): any {
        if (this.selectLineInfo != null) {
            ////console.log("详细信息" + this.selectLineInfo);
            this.adjustableRequestVo = new AdjustableRequestVo();

            this.adjustableVoService.getOrderType(this.adjustableResponseVo.orderType, this.orderType);
            this.adjustableVoService.getOrderInfo(this.adjustableResponseVo.orderInfo, this.orderInfo);
            this.adjustableVoService.getOrderBaseInfo(this.adjustableResponseVo.orderBaseInfo, this.orderBaseInfo);
            this.adjustableVoService.getPickUpGoodInfo(this.adjustableResponseVo.pickUpGoodInfo, this.pickUpGoodInfo);
            this.adjustableVoService.getSignInfo(this.adjustableResponseVo.signInfo, this.signInfo);

            // let tar = document.getElementById('order_detail');
            // this.subOrder.infoBox.clickTableItem('hide', tar)

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    }

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

    /**
     * 异常登记
     */
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
    showAbnormalBox() {
        if (this.selectionRow.length >= 1) {
            this.controlAbnormalBox = 'show';
            this.mask.show();
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认
    hideAbnormalBox() {
        this.showSuccess("success", "提示", "操作成功！");
        this.abnormalIf = false;
        this.controlAbnormalBox = 'hide';
        this.mask.hide();
    }

    //取消
    record() {
        this.abnormalIf = false;
        this.controlAbnormalBox = 'hide';
        this.mask.hide();
    }

    ngAfterViewChecked() {

    }
}
