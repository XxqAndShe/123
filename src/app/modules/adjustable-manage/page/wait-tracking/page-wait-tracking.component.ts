import {Component, EventEmitter, Output, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {SetTableStyleService} from '../../service/set-table-style.service';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service';
import {orderBtnAnimation} from "../../share/order-btn.animation";
import {ConfirmationService} from 'primeng/primeng';
import {API} from "../../../../share/lib/api/api";
import {Message} from 'primeng/primeng';
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {WaitTrackHeaderComponent} from"./watit-track-header.component"
import {overlayPanelHide} from "../../../../share/utils/gridUtil";

@Component({
    templateUrl: './page-wait-tracking.component.html',
    styleUrls: ['./page-wait-tracking.component.css', '../../share/common.css'],
    animations: [
        orderBtnAnimation,
        modalAnimation
    ]
})

export class PageWaitTrackingComponet implements OnInit,AfterViewInit {
    @Output() refreshTable = new EventEmitter();
    public controlAbnormalBox: string = 'hide';
    public btnState: string = 'show';//表格操作按扭状态
    public traceWinState: any = 'hide';//添加跟踪信息状态
    traceIf: boolean = false;

    public tasksType: any = '';
    public tasksStatus: any = '';
    @ViewChild(WaitTrackHeaderComponent)
    public timerComponent: WaitTrackHeaderComponent;
    len: number;//选中列表的条数
    rowData;
    ngAfterViewInit() {

    }

    //选中列的运单号
    public wayBill: string;
    //选中列的师傅姓名
    public masterName: string;
    selectionRow: any[] = [];
    abnormalIf: boolean = false;//异常登记

    public isTrunkEnd: boolean = true; // 干线是否结束
    // 初始化列
    columns: any[] = [];
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;

    /**
     * 分配师傅
     */
    modelAssignMaster: string = 'out';
    assignIf: boolean = false;
    repairAssignIf: boolean = false;//维修、返货分配师傅
    isRepair: boolean = false;//让弹框知道是维修调度
    repairAssignMaster: string = 'out';//维修、返货分配师傅

    constructor(public api: API,
                public set: SetTableStyleService,
                public mask: ShowOrHideMaskService,
                public confirmationService: ConfirmationService) {
    }

    closeBtn() {
        // this.btnState='hide';
        this.selectionRow = [];
        this.tasksType = '';
        this.tasksStatus = '';
    }

    /*
     * 添加跟踪*/
    //取消
    hideDialog(who: any) {
        this.traceIf = false;
        switch (who) {
            case false:
                this.traceWinState = 'hide';
                break;
        }
        this.mask.hide();
    }

//保存
    /*
     * 确定*/
    oSave() {
        this.traceIf = false;
        this.traceWinState = 'hide';
        this.selectionRow = [];
        this.mask.hide();
        this.refTable();//刷新列表
        this.showSuccess("success", "提示", "操作成功");
        window['epInstance'].emit('update_submenu_info');
    }

    showDialog(who: any) {
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len >= 1) {
            this.traceIf = true;
            switch (who) {
                case 'trace-win':
                    this.traceWinState = 'show';
                    this.selectLineInfo[0].whatType = "task";
                    break;
            }

            this.mask.show();

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    collectInfo($event) {
        this.tasksType = $event.taskType;
        this.tasksStatus = $event.taskStatus;
    }

    /**
     * 表格字段点击事件
     * 建议在对应的column字段下添加link:true属性，使得字段值加上下划线，明显区别哪些字段可点击
     */
    //表格点击事件
    cellClick(event): void {
        if(event.row.taskType === '自提'){
            this.showSuccess("warn", "提示", "自提任务无详情！");
            return;
        }
        if (event.field === 'waybillId') {
            this.len = 1;
            this.selectLineInfo = event.row;
            this.rowData = event.row;
            this.displayModal();
        }
        if (event.field === 'title') {
            this.selectLineInfo = event.row;
            if (event.row.taskType === '维修任务') {
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if (event.row.taskType === '返货任务') {
                let that = this;
                this.isModuleDisplayArr[1] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[1] = true;
                }, 0);
                this.curModalIndex = 1;
            }
            else if (event.row.taskType === '调度任务') {
                this.len = 1;
                this.selectLineInfo = event.row;
                this.rowData = event.row;
                this.displayModal();
            } else {
                this.showSuccess("warn", "提示", "该记录无法判断任务类型！");
            }
        }
    }

    /**
     * 维修返货任务详情关闭
     *
     */
    closeTaskDetailModal(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
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

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    // 右侧弹框
    modalState: string = 'out';
    showDetailModal: boolean = false;

    displayModal() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据！");
            return;
        } else {
            if(!this.rowData.pickUP){
                let that = this;
                this.showDetailModal = true;
                setTimeout(function () {
                    that.modalState = 'in';
                }, 0);
            }else{
                this.showSuccess("warn","提示","自提任务无法查看详情！");
            }
        }
    }


    closeModal() {
        let that = this;

        this.modalState = 'out';

        setTimeout(function () {
            that.showDetailModal = false;
        }, 200);

    }

    ngOnInit() {
        this.initColumns();
    }


    /**
     * 刷新表格数据
     */
    refTable() {
        this.timerComponent.doSearch();
        ////console.log(this.timerComponent);
    }

    /**
     * 查询清空
     * @type {Array}
     */
    doSelect(){
        this.selectionRow = [];
    }

    //确认
    changeSearch() {
        this.showSuccess("success", "提示", "操作成功！");
        //刷新数据
        this.refTable();
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
     * 取消分配
     */
    cancelAllocationIf: boolean = false;

    cancelAllocation() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据！");
            return;
        } else {
            this.cancelAllocationIf = true;
            this.mask.show();
        }
    }

    /**
     * 确认取消分配
     */
    NoAllocation() {
        //刷新页面
        this.refTable();
        this.selectionRow = [];
        this.cancelAllocationIf = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
    }

    /*取消或退出取消分配*/
    sureAllocation() {
        this.cancelAllocationIf = false;
        this.mask.hide();
    }

    /**
     * 确认分配(调度、维修、返货)
     */

    cAssignment() {
        let selectedRow = this.selectLineInfo[0] || {};
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        /*判断是否选择数据*/
        if (this.len >= 1) {
            let that = this;
            //判断任务类型
            if (selectedRow.taskType == "调度任务") {
                this.api.call('taskInstallController.isTrunkEnd', {
                    taskId: selectedRow.id
                }).ok(data => {
                    this.alert("请确认所选择的 " + selectedRow.title + " 任务，是否指派给 " + selectedRow.realName + " 师傅，确认费用是否合理！是否确认分配？", "提示",
                        function () {
                            that.api.call('taskInstallController.disWorker', {
                                dis: false,
                                taskId: that.selectLineInfo[0].id
                            }).ok(data => {
                                that.showSuccess("success", "提示", "操作成功！");
                                //刷新页面
                                that.refTable();
                                that.len = 0;

                            }).fail(data => {
                                // that.alert(that.selectLineInfo[0].title + ":" + data.error, "提示", null);
                                that.showSuccess("error", "提示", that.selectLineInfo[0].title + ":" + data.error);
                            });
                        }, function () {
                        });
                }).fail(data => {
                    this.showSuccess("error", "提示", selectedRow.title + ":" + data.error);
                });
            } else if (selectedRow.taskType == "维修任务" || selectedRow.taskType == "返货任务") {
                this.alert("请确认所选择的 " + selectedRow.title + " 任务，是否指派给 " + selectedRow.realName + " 师傅，确认费用是否合理！是否确认分配？", "提示",
                    function () {
                        //参照售后调度中的维修调度中的确认分配师傅
                        that.api.call("AftermarketTaskController.affirmTaskMaster", {
                            taskId: selectedRow.id,
                            masterName: selectedRow.realName
                        }).ok(json => {
                            that.showSuccess("success", "提示", "操作成功！");
                            that.refTable();//刷新页面
                            that.len = 0;

                        }).fail((data) => {
                            that.showSuccess("error", "提示", that.selectLineInfo[0].title + ":" + data.error)
                        });
                    }, function () {
                    });
            }
        } else {
            this.showSuccess("error", "提示", "请选择一条数据");
        }
    };

    /**
     * 分配师傅
     */
    displayAssignMaster() {
        let selectedRow = this.selectLineInfo[0] || {};
        let that = this;
        /*判断是否选择数据*/
        if (this.len >= 1) {
            if(this.selectLineInfo[0].tasksType == "调度任务"){
                for(let i = 0;i<this.selectLineInfo.length;i++){
                    if(this.selectLineInfo[i].taskType !== this.selectLineInfo[0].taskType){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"与前面任务类型不一致");
                        return;
                    }else if(!this.selectLineInfo[i].trunkEndDate){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"干线未结束");
                        return;
                    }
                }
            }else {
                for(let i = 0;i<this.selectLineInfo.length;i++) {
                    if (this.selectLineInfo[i].taskType !== this.selectLineInfo[0].taskType) {
                        this.showSuccess("warn", "提示", this.selectLineInfo[i].waybillId + "与前面任务类型不一致");
                        return;
                    }
                }
            }
            switch (selectedRow.taskType) {
                case "调度任务":
                    this.api.call('taskInstallController.isTrunkEnd', {
                        taskId: selectedRow.id
                    }).ok(data => {
                        this.assignIf = true;
                        setTimeout(function () {
                            that.modelAssignMaster = 'in';
                        }, 0)
                    }).fail(data => {
                        this.showSuccess("error", "提示", selectedRow.waybillId + ":" + data.error);
                    });
                    break;

                case "维修任务":
                    this.repairAssignIf = true;
                    this.isRepair = true;//让弹框知道是维修调度
                    setTimeout(function () {
                        that.repairAssignMaster = 'in';
                    }, 0)
                    break;

                case "返货任务":
                    this.repairAssignIf = true;
                    this.isRepair = false;//让弹框知道是返货任务
                    setTimeout(function () {
                        that.repairAssignMaster = 'in';
                    }, 0)

                default:
                    break;
            }
        } else {
            this.showSuccess("error", "提示", "请选择一条数据");
        }
    }

    //关闭调度任务分配师傅弹框
    closeAssignMaster() {
        this.repairAssignMaster = 'out';
        setTimeout(() => {
            this.assignIf = false;
        }, 200)

    }

//维修、返货中确认
    //维修、返货确认
    doSaveMaster() {
        this.showSuccess("success", "提示", "操作成功！");
        this.refTable();//刷新页面
        this.repairAssignMaster = 'out';
        let that = this;
        setTimeout(function () {
            that.isRepair = false;
            that.repairAssignIf = false;

        }, 200);
    }

//关闭维修任务、返货任务分配师傅
    closeAssign($event) {
        this.repairAssignMaster = 'out';
        setTimeout(() => {
            this.isRepair = false;
            this.repairAssignIf = false;
        }, 200);
    }

    //分配确认
    changeAssign() {
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //刷新列表和节点
        this.refTable();//刷新页面
        this.selectionRow = [];
        //关闭弹窗
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
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        /*判断是否选择数据*/
        if (this.len >= 1) {
            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: this.selectLineInfo[0].id
            }).ok(data => {
                this.ChangeIf = true;
                this.mask.show();
            }).fail(data => {
                this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error)
            });
        } else {
            this.showSuccess("error", "提示", "请选择一条数据");
        }
    }

    /*确认*/
    onChangeInformationSure() {
        this.showSuccess("success", "提示", "操作成功！");
        //刷新数据
        this.refTable();
        this.selectionRow = [];
        this.ChangeIf = false;
        this.mask.hide();
    }

    /*取消*/
    onChangeInformation(i: string) {
        this.ChangeIf = false;
        this.mask.hide();
    }


    /**
     * 干线结束
     */
    TrunkEndIf: boolean = false;

    trunkEnd() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len >= 1) {

            this.api.call('taskInstallController.isTrunkEnd', {
                taskId: this.selectLineInfo[0].id
            }).ok(data => {
                this.showSuccess("warn", "提示", this.selectLineInfo[0].waybillId + "已操作过干线结束！");
            }).fail(data => {
                if (data.code == 156) {
                    this.TrunkEndIf = true;
                    this.mask.show();
                } else {
                    // this.alert(this.selectLineInfo[0].waybillId + ":" + data.error, "提示", null);
                    this.showSuccess("error", "提示", this.selectLineInfo[0].waybillId + ":" + data.error);
                }
            });

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    /*确认*/
    TrunkEndOver() {
        this.TrunkEndIf = false;
        //刷新数据
        this.refTable();
        this.selectionRow = [];
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
    }

    /*取消*/
    TrunkEndCancel() {
        this.TrunkEndIf = false;
        this.mask.hide();
    }

    /**
     * 接单（受理）
     */
    acceptBill() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        // let that = this;
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            switch (this.selectLineInfo[0].taskType) {
                case "调度任务":
                    this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                        this.api.call("taskInstallController.accepte", {
                            taskId: this.selectLineInfo[0].id
                        }).ok(data => {
                            this.msgs.push({severity: "info", summary: "提示", detail: "提货成功！"});
                            // this.len = 0;
                            this.showSuccess("success", "提示", "操作成功！");
                            //刷新数据
                            this.refTable();
                            this.len = 0;
                        }).fail(data => {
                            // this.alert(this.selectLineInfo[0].id+":"+data.error,"提示",null);
                            this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                        });
                    });
                    break;

                case "维修任务":
                    this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                        this.api.call("AftermarketTaskController.acceptance", {
                            taskId: this.selectLineInfo[0].id
                        }).ok(data => {
                            this.len = 0;
                            //刷新数据
                            this.refTable();
                            this.showSuccess("success", "提示", "操作成功！");
                        }).fail(data => {
                            this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                        });
                    });
                    break;


                case "返货任务":
                    this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                        this.api.call("AftermarketTaskController.acceptance", {
                            taskId: this.selectLineInfo[0].id
                        }).ok(data => {
                            this.len = 0;
                            //刷新数据
                            this.refTable();
                            this.showSuccess("success", "提示", "操作成功！");
                        }).fail(data => {
                            this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                        });
                    });
                    break;
            }
        }
    }

    /**
     * 预约/二次预约(调度+ 维修)
     */
    reservation() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            if (this.selectLineInfo[0].taskType == "调度任务" || this.selectLineInfo[0].taskType == "维修任务") {
                this.orderWin = true;
                this.mask.show();
            }
        }
    }

    //确认
    changeWin() {
        this.showSuccess("success", "提示", "操作成功！");
        this.selectionRow = [];
        //刷新数据
        this.refTable();
        this.orderWin = false;
        this.mask.hide();
    }

    //取消
    hideWin() {
        this.orderWin = false;
        this.mask.hide();
    }

    /**
     * 提货(调度+ 返货)
     */
    msgs: Message[] = [];
    orderWin: boolean = false;

    picUpGoods() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            switch (this.selectLineInfo[0].taskType) {
                case "调度任务":
                    this.alert("是否确认提货此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                        this.api.call("taskInstallController.pickUp", {
                            taskId: this.selectLineInfo[0].id
                        }).ok(data => {
                            //刷新数据
                            this.refTable();
                            this.len = 0;
                            this.showSuccess("success", "提示", "操作成功！");
                        }).fail(data => {
                            this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                        });
                    });
                    break;

                case "返货任务":
                    this.alert("是否确认提货此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                        this.api.call("AftermarketTaskController.picUpGoods", {
                            taskId: this.selectLineInfo[0].id
                        }).ok(data => {
                            this.len = 0;
                            this.showSuccess("success", "提示", "操作成功！");
                            //刷新数据
                            this.refTable();
                        }).fail(data => {
                            // this.alert(this.selectLineInfo[0].id+":"+data.error,"提示",null);
                            this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                        });
                    });
                    break;
            }
        }
    }

    /**
     * 签收
     */
    detailsInfo: any = 'waitDistribution';
    SignIf: boolean = false;

    Sign() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.SignIf = true;
            this.mask.show();
        }
    }

    /**
     * 取消签收
     */
    CancelSignIf: boolean = false;

    CancelSign() {
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.CancelSignIf = true;
            this.mask.show();
        }
    }

    //确认
    changeAssignment() {
        //刷新
        this.CancelSignIf = false;
        this.mask.hide();
        //成功提示
        this.showSuccess("success", "提示", "操作成功！");
        //删除表格选中数据
        this.refTable();//刷新列表
        this.selectionRow = [];

    }

    //取消
    cancelCancelSign() {
        this.CancelSignIf = false;
        this.mask.hide();
    }


    /**
     * 维修完成
     */
    maintenanceCompleteIf: boolean = false;

    openMaintenanceComplete() {
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.maintenanceCompleteIf = true;
            this.mask.show();
        }
    }

    /**
     * 返货完成
     */
    pickGoodsFinishIf: boolean = false;

    openPickGoodsFinish() {
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.pickGoodsFinishIf = true;
            this.mask.show();
        }
    }


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
        //判断是否为单选
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.len >= 1) {
            this.abnormalIf = true;
            this.controlAbnormalBox = 'show';
            this.mask.show();
        } else {
            this.showSuccess("error", "提示", "请选择一条数据");
        }
    }

    //确认
    hideAbnormalBox() {
        this.showSuccess("success", "提示", "操作成功！");
        //刷新数据
        this.refTable();
        this.selectionRow = [];
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

    /**
     * 终止订单
     */
    public terminationOrderIf: boolean = false;

    openTerminataion() {
        if (this.len === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            if (this.selectLineInfo[0].taskType == "维修任务") {
                this.terminationOrderIf = true;
                this.mask.show();
            } else if (this.selectLineInfo[0].taskType == "返货任务") {
                this.terminationOrderIf = true;
                this.mask.show();
            }
        }
    };

    /**
     * 确认终止订单
     */
    terminationOrder() {
        this.showSuccess('success', '提示', '操作成功');
        //刷新数据
        this.refTable();
        this.selectionRow = [];
        this.terminationOrderIf = false;
        this.mask.hide();
    };

    /**
     * 取消、退出终止订单
     */
    cancelTerminationOrder() {
        this.terminationOrderIf = false;
        this.mask.hide();
    }

    maintenanceComplete() {
        this.showSuccess('success', '提示', '操作成功');
        //刷新数据
        this.refTable();
        this.selectionRow = [];
        this.maintenanceCompleteIf = false;
        this.mask.hide();
    }

    maintenanceCompleteCancel() {
        this.maintenanceCompleteIf = false;
        this.mask.hide();
    }

    pickGoodsFinish() {
        ////console.log('tttttt');
        this.pickGoodsFinishIf = false;
        this.mask.hide();
    }

    selectLineInfo: any[] = [];
    taskId;
    any;

    rowSelect(row: any) {
        let select=row[0]?row[0]:row;
        this.selectLineInfo = row;
        this.rowData = row[0];
        if(row[0]){
            this.taskId = this.selectLineInfo[0].id;
        }
        this.wayBill = select.waybill;
        this.masterName = select.masterName;
        this.btnState = 'show';
        this.len = row.length;
        this.selectionRow.length = this.selectLineInfo.length;
        this.tasksType = select.taskType;
        this.tasksStatus = select.taskStatus;
        //过滤, 只要跟第一次选中的状态不一致就选不中
        let data = row.filter(item => {
            if(item.taskStatus != row[0].taskStatus){
                this.showSuccess("warn", "提示", "只能选择相同任务状态的数据");
            }
            return item.taskStatus == row[0].taskStatus;
        });
        this.selectionRow = data;
    }

    /**
     * 选中的单元格数据
     */
    cellOverEvent: any;

    // hover查询信息
    vTrack: any = {};
    vTaskDetaiReq: any = {};
    //页面绑定
    trackInfo: any = [];
    goodsDetailsCount: any = {};
    goodsShow: any = [];

    cellMouseEnter($event, ...restObj: any[]): any {
        let op1 = restObj[0];
        let op2 = restObj[1];
        //如果是跟踪信息字段则显示浮动窗口op
        if ($event.field == "remark") {
            this.cellOverEvent = JSON.stringify($event);
            op1.toggle($event.originalEvent);
            op2 && op2.hide();

            this.vTrack.taskID = $event.row.id;
            this.vTrack.trackType = 'task';
            this.api.call("TaskDetailContorller.findTrack", $event, this.vTrack).ok(json => {
                this.trackInfo = json.result.content;
            }).fail((err) => {
            });
        }
        /*
         * 如果是货品字段则显示浮动窗口op2
         * */
        else if ($event.field == "goods") {
            this.cellOverEvent = JSON.stringify($event);
            op2.toggle($event.originalEvent);
            op1 && op1.hide();

            this.vTaskDetaiReq.taskID = $event.row.id;
            this.vTaskDetaiReq.waybillId = $event.row.waybillId;
            this.api.call("taskDetailContorller.findWaybillGoods", {first: 0, rows: 10}, this.vTaskDetaiReq)
                .ok(returnInfo => {
                    this.goodsShow = returnInfo.result.content;
                    this.goodsDetailsCount = this.getProductInfo(this.goodsShow);
                })
                .fail(data => {
                    this.showSuccess("error", "提示", "查询失败！")
                });
        }
    }

    cellMouseLeave($event, ...restObj: any[]) {
        overlayPanelHide($event, restObj, ['remark', 'goods']);
    }

    productSum: any = {};
    //计算总量
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
        if (data) {
            for (let i = 0; i < data.length; i++) {
                infoObj.tInstallNum += data[i]['installItems'];
                infoObj.tPackNum += data[i]['packingItems'];
                infoObj.tWeight += data[i]['weight'];
                infoObj.tVolume += data[i]['volumes'];
                infoObj.tUnitPrice += data[i]['price'];
                infoObj.tInstallationFee += data[i]['installCharge'];
            }
        }
        return infoObj;
    }

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
            field: "title",
            header: "任务单号",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "remark",
            header: "跟踪信息",
            sortable: false,
            filter: true
        });
        this.columns.push({
            // field: "vWaybill.vShipper.mobile",
            field: "taskType",
            header: "任务类型",
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
            field: "goods",
            header: "货品",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "realName",
            header: "师傅/网点名称",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "account",
            header: "师傅/网点手机",
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
            field: "operator",
            header: "分配人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "billDepart",
            header: "开单网点",
            sortable: false,
            filter: true
        });
    }
}
