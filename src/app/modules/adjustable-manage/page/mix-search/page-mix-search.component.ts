import {Component, AfterViewChecked, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SetTableStyleService} from '../../service/set-table-style.service';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service';
import {orderBtnAnimation} from "../../share/order-btn.animation";
import {ConfirmationService} from 'primeng/primeng';
import {Message} from 'primeng/primeng';
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {MixSearchHeaderComponent}from"./mix-search-header.component";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";
import {overlayPanelHide} from "../../../../share/utils/gridUtil";

@Component({
    templateUrl: './page-mix-search.component.html',
    styleUrls: ['./page-mix-search.component.css', '../../share/common.css'],
    animations: [
        orderBtnAnimation,
        modalAnimation
    ]
})
export class PageMixSearchComponent implements AfterViewChecked {
    //选中列的运单号
    wayBill: string;
    rowData;
    inputWaybill: string;

    data: any;
    selectionRow: any[] = [];
    selected: any[] = [];//用于显示选中数据条数
    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;

    constructor(public mask: ShowOrHideMaskService,
                public set: SetTableStyleService,
                public confirmationService: ConfirmationService,
                public api: API,
                public _activatedRoute: ActivatedRoute,
                public RequestTokenService: RequestTokenService) {
    }

    public controlAbnormalBox: string = 'hide';
    public btnState: string = 'show';//表格操作按扭状态

    public tasksType: any = '';
    public tasksStatus: any = '';
    /*
     * 调用子组件的方法*/
    @ViewChild(MixSearchHeaderComponent)
    public mixSearch: MixSearchHeaderComponent;

    ngAfterViewChecked() {

    }

    closeBtn() {
        this.selectionRow = [];
        this.tasksType = '';
        this.tasksStatus = '';
    }

    //时间

    collectInfo($event) {
        this.tasksType = $event.taskType;
        this.tasksStatus = $event.taskStatus;
    }

    /*
     * 刷新列表*/
    refTable() {
        this.mixSearch.doSearch();
    }

    /**
     * 更改提货信息
     * @type {boolean}
     */
    ChangeIf: boolean = false;//弹框默认隐藏
    changeTake() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.api.call('taskInstallController.isTrunkEnd', {
                    taskId: this.selectLineInfo[0].id
                }).ok(data => {
                    this.ChangeIf = true;
                    this.mask.show();
                }).fail(data => {
                    // this.alert(this.selectLineInfo[0].title+":"+data.error,"提示",null);
                    this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                });
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    }

    onChangeInformation() {
        this.ChangeIf = false;
        this.mask.hide();
    }

    /*确认*/
    onChangeInformationSure() {
        this.showSuccess("success", "提示", "操作成功！");
        this.refTable();//刷新列表
        this.ChangeIf = false;
        this.selectionRow = [];
        this.mask.hide();
    }

    /*干线结束*/
    TrunkEndIf: boolean = false;

    trunkEnd() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.api.call('taskInstallController.isTrunkEnd', {
                    taskId: this.selectLineInfo[0].id
                }).ok(data => {
                    this.showSuccess("warn", "提示", this.selectLineInfo[0].title + "已操作过干线结束！");
                }).fail(data => {
                    if (data.code == 156) {
                        this.TrunkEndIf = true;
                        this.mask.show();
                    } else {
                        // this.alert(this.selectLineInfo[0].title+":"+data.error,"提示",null);
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                    }
                });
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

//确认干线结束
    trunkEndOver() {
        this.showSuccess("success", "提示", "操作成功");
        this.refTable();//刷新列表
        ////console.log("shuax");
        this.selectionRow = [];
        this.TrunkEndIf = false;
        this.mask.hide();
    }

//取消干线结束

    trunkEndCancel() {
        this.TrunkEndIf = false;
        this.mask.hide();
    }

    /**
     取消签收*/

    CancelSignIf: boolean = false;

    CancelSign() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.CancelSignIf = true;
                this.mask.show();
            }

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
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
     签收*/

    SignIf: boolean = false;

    Sign() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务 Todo 签收只有调度任务有
            // if(this.selectLineInfo[0].taskType=="调度任务"){
            this.SignIf = true;
            this.mask.show();
            // }

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

    /*取消分配*/
    cancelAllocationIf: boolean = false;

    cancelAllocation() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.cancelAllocationIf = true;
                this.mask.show();

            } else if (this.selectLineInfo[0].taskType == "维修任务") {//维修任务
                this.cancelAllocationIf = true;
                this.mask.show();

            } else if (this.selectLineInfo[0].taskType == "返货任务") {//返货任务
                this.cancelAllocationIf = true;
                this.mask.show();

            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    }

    /*取消或退出取消分配*/
    sureAllocation() {
        this.cancelAllocationIf = false;
        this.mask.hide();

    }

    NoAllocation() {
        this.refTable();
        this.selectionRow = [];
        this.cancelAllocationIf = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "取消成功！")
    }

    // 详情右侧弹框
    modalState: string = 'out';

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
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /*确认分配*/
    cAssignment() {
        var that = this;
        /*判断是否选择数据*/
        if (this.selectionRow.length >= 1) {
            let that = this;
            //调度任务确认分配
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.api.call('taskInstallController.isTrunkEnd', {
                    taskId: this.selectLineInfo[0].id
                }).ok(data => {
                    this.alert("请确认所选择的 " + this.selectLineInfo[0].title + " 任务，是否指派给 " + this.selectLineInfo[0].realName + " 师傅，确认费用是否合理！是否确认分配？", "提示",
                        function () {
                            ////console.log("确认分配");
                            that.api.call('taskInstallController.disWorker', {
                                dis: false,
                                taskId: that.selectLineInfo[0].id
                            }).ok(data => {
                                // 刷新页面
                                that.refTable();
                                that.showSuccess("success", "提示", "分配成功");
                            }).fail(data => {
                                that.showSuccess("error", "提示", that.selectLineInfo[0].title + ":" + data.error);
                            });
                        }, function () {
                            ////console.log("取消分配");
                        });
                }).fail(data => {
                    this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                });
            } else if (this.selectLineInfo[0].taskType == "维修任务") {

                this.alert("请确认所选择的 " + this.selectLineInfo[0].title + " 任务，是否指派给 " + this.selectLineInfo[0].realName + " 师傅，确认费用是否合理！是否确认分配？", "提示", function () {
                    that.api.call("AftermarketTaskController.affirmTaskMaster", {
                        taskId: that.selectLineInfo[0].id,
                        masterName: that.selectLineInfo[0].realName
                    }).ok(json => {
                        that.refTable();//刷新列表
                        that.selectionRow = [];
                        that.showSuccess("success", "提示", "分配成功");
                    }).fail((data) => {
                        ////console.log(data)
                        that.showSuccess("error", "提示", that.selectLineInfo[0].title + ":" + data.error);
                    });
                }, function () {
                    ////console.log("取消分配");
                });

            } else if (this.selectLineInfo[0].taskType == "返货任务") {

                this.alert("请确认所选择的 " + this.selectLineInfo[0].title + " 任务，是否指派给 " + this.selectLineInfo[0].realName + " 师傅，确认费用是否合理！是否确认分配？", "提示", function () {
                    that.api.call("AftermarketTaskController.affirmTaskMaster", {
                        taskId: that.selectLineInfo[0].id,
                        masterName: that.selectLineInfo[0].realName
                    }).ok(json => {
                        that.refTable();//刷新列表
                        that.selectionRow = [];
                        that.showSuccess("success", "提示", "分配成功");
                    }).fail((data) => {
                        that.showSuccess("error", "提示", that.selectLineInfo[0].title + ":" + data.error);
                    });
                }, function () {
                    ////console.log("取消分配");
                });

            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }

    };

    detailIf: boolean = false;
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
            if(!this.rowData.pickUP){
                let that = this;
                this.showDetailModal = true;
                setTimeout(function () {
                    that.modalState = 'in';
                }, 0);
            }else {
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


    // 终止订单
    terminationOrderIf: boolean = false;

    openTerminataion() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            if (this.selectLineInfo[0].taskType == "维修任务") {
                ////console.log("维修终止订单");
                this.terminationOrderIf = true;
                this.mask.show();

            } else if (this.selectLineInfo[0].taskType == "返货任务") {

                this.terminationOrderIf = true;
                this.mask.show();
            }

        }

    }

    /*
     * 确认终止订单*/
    terminationOrder() {
        this.refTable();//刷新列表
        this.selectionRow = [];
        this.terminationOrderIf = false;
        this.mask.hide();
        this.showSuccess("success", "提示", "操作成功！");
    }

    /*
     * 取消、退出终止订单*/
    cancelTerminationOrder() {
        this.terminationOrderIf = false;
        this.mask.hide();
    }

    /**
     * 提货
     */
    msgs: Message[] = [];

    openTakeGoods() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.alert('确认提货此单吗？', '提示', () => {
                    this.api.call('taskInstallController.pickUp', {
                        taskId: this.selectLineInfo[0].id
                    }).ok((data) => {
                            this.msgs.push({severity: 'success', summary: '提示', detail: '操作成功!'});
                            this.refTable();//刷新列表
                            this.selectionRow = [];
                        }
                    ).fail((data) => {
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                    });
                })
            } else if (this.selectLineInfo[0].taskType == "返货任务") { //Todo 返货任务
                this.alert('确认提货此单吗？', '提示', () => {
                    this.api.call('AftermarketTaskController.picUpGoods', {
                        taskId: this.selectLineInfo[0].id
                    }).ok((data) => {
                            this.msgs.push({severity: 'success', summary: '提示', detail: '操作成功!'});
                            this.refTable();//刷新列表
                            this.selectionRow = [];
                        }
                    ).fail((data) => {
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                    });
                })

            }

        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    };

    // 预约
    orderWin: boolean = false;

    doOrder() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务预约
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.orderWin = true;
                this.mask.show();
            } else if (this.selectLineInfo[0].taskType == "维修任务") {
                this.orderWin = true;
                this.mask.show();
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //二次预约
    // Todo 如果预约和二次预约接口可以写在同一函数里面（doOrder()），请将（secondOrder()）函数删掉
    secondOrder() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            //调度任务预约
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.orderWin = true;
                this.mask.show();
            } else if (this.selectLineInfo[0].taskType == "维修任务") {
                this.orderWin = true;
                this.mask.show();
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //确认
    changeWin() {
        this.showSuccess("success", "提示", "操作成功！");
        this.refTable();//刷新列表
        this.selectionRow = [];
        this.orderWin = false;
        this.mask.hide();
    }

    //取消
    hideWin() {
        this.orderWin = false;
        this.mask.hide();
    }

    // 调度任务接单
    accept() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {

            //调度任务受理
            if (this.selectLineInfo[0].taskType == "调度任务") {
                this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                    this.api.call('taskInstallController.accepte', {
                        taskId: this.selectLineInfo[0].id
                    }).ok(data => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '接单成功!'});
                        this.refTable();//刷新列表
                        this.selectionRow = [];
                    }).fail(data => {
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);

                    });
                });
            } else if (this.selectLineInfo[0].taskType == "维修任务") {
                this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                    this.api.call("AftermarketTaskController.acceptance", {taskId: this.selectLineInfo[0].id}).ok(json => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '接单成功!'});
                        this.refTable();//刷新列表
                        this.selectionRow = [];
                    }).fail((err) => {
                        this.showSuccess("error", "提示", err.error);
                    });
                })
            } else if (this.selectLineInfo[0].taskType == "返货任务") {
                this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                    this.api.call("AftermarketTaskController.acceptance", {taskId: this.selectLineInfo[0].id}).ok(json => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '接单成功!'});
                        this.refTable();//刷新列表
                        this.selectionRow = [];
                    }).fail((err) => {
                        this.showSuccess("error", "提示", err.error);
                    });
                })
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    // 维修受理
    acceptBill() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length >= 1) {
            if (this.selectLineInfo[0].taskType == "维修任务") {
                this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                    this.api.call("AftermarketTaskController.acceptance", {taskId: this.selectLineInfo[0].id}).ok(data => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '接单成功!'});
                        this.refTable();//刷新列表
                        this.selectionRow = [];
                    }).fail((data) => {
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                    });
                })
            } else if (this.selectLineInfo[0].taskType == "返货任务") {
                this.alert("是否确认受理此单：" + this.selectLineInfo[0].title + "？", "提示", () => {
                    this.api.call("AftermarketTaskController.acceptance", {taskId: this.selectLineInfo[0].id}).ok(data => {
                        this.msgs.push({severity: 'success', summary: '提示', detail: '接单成功!'});
                        this.refTable();//刷新列表
                        this.selectionRow = [];
                    }).fail((data) => {
                        this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                    });
                })
            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    }

    //分配师傅右侧弹框
    modelAssignMaster: string = 'out';//调度任务分配师傅
    repairAssignMaster: string = 'out';//维修、返货分配师傅
    assignIf: boolean = false;//调度任务分配师傅
    repairAssignIf: boolean = false;//维修、返货分配师傅
    isRepair: boolean = false;//让弹框知道是维修调度
    displayAssignMaster() {
        if (this.selectionRow.length >= 1) {
            //调度任务分配师傅
            let that = this;
            if (this.selectLineInfo[0].taskType == "调度任务") {
                for(let i = 0;i<this.selectLineInfo.length;i++){
                    if(this.selectLineInfo[i].taskType !== this.selectLineInfo[0].taskType){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"与前面任务类型不一致");
                        return;
                    }else if(!this.selectLineInfo[i].trunkEndDate){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"干线未结束");
                        return;
                    }
                }
                this.api.call('taskInstallController.isTrunkEnd', {
                    taskId: this.selectLineInfo[0].id
                }).ok(data => {
                    this.assignIf = true;
                    setTimeout(function () {
                        that.modelAssignMaster = 'in';
                    }, 0)
                }).fail(data => {
                    this.showSuccess("error", "提示", this.selectLineInfo[0].title + ":" + data.error);
                });
            } else if (this.selectLineInfo[0].taskType == "维修任务") {
                for(let i = 0;i<this.selectLineInfo.length;i++){
                    if(this.selectLineInfo[i].taskType !== this.selectLineInfo[0].taskType){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"与前面任务类型不一致");
                        return;
                    }
                }
                let that = this;
                this.repairAssignIf = true;
                this.isRepair = true;//让弹框知道是维修调度
                setTimeout(function () {
                    that.repairAssignMaster = 'in';
                }, 0)

            } else if (this.selectLineInfo[0].taskType == "返货任务") {
                for(let i = 0;i<this.selectLineInfo.length;i++){
                    if(this.selectLineInfo[i].taskType !== this.selectLineInfo[0].taskType){
                        this.showSuccess("warn","提示",this.selectLineInfo[i].waybillId+"与前面任务类型不一致");
                        return;
                    }
                }
                let that = this;
                this.repairAssignIf = true;
                this.isRepair = false;//让弹框知道是返货任务
                setTimeout(function () {
                    that.repairAssignMaster = 'in';
                }, 0)

            }
        } else {
            this.showSuccess("warn", "提示", "请选择一条数据");
        }
    };

    //调度任务分配师傅
    closeAssignMaster() {
        this.modelAssignMaster = 'out';
        var that = this;
        setTimeout(function () {

            that.assignIf = false;
        }, 200);
    }

    //调度确认分配师傅
    onAssignment() {
        this.showSuccess("success", "提示", "操作成功");
        this.refTable();
        this.selectionRow = [];
        this.modelAssignMaster = 'out';
        var that = this;
        setTimeout(function () {

            that.assignIf = false;
        }, 200);
    }

    //维修、返货确认
    doSaveMaster() {
        this.showSuccess("success", "提示", "操作成功！");
        this.refTable();//刷新列表
        this.selectionRow = [];
        this.repairAssignMaster = 'out';
        let that = this;
        setTimeout(function () {
            that.isRepair = false;
            that.repairAssignIf = false;

        }, 200);
    }

    //返货、维修任务分配师傅
    closeAssign($event) {
        this.repairAssignMaster = 'out';
        let that = this;
        setTimeout(function () {
            that.isRepair = false;
            that.repairAssignIf = false;

        }, 200);
    }

    // 维修完成
    maintenanceCompleteIf: boolean = false;

    openMaintenanceComplete() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.maintenanceCompleteIf = true;
            this.mask.show();
        }
    }

    maintenanceComplete() {
        this.showSuccess("success", "提示", '操作成功');
        this.refTable();
        this.maintenanceCompleteIf = false;
        this.mask.hide();
    }

    maintenanceCompleteCancle() {
        this.maintenanceCompleteIf = false;
        this.mask.hide();
    }

    // 提货完成
    pickGoodsFinishIf: boolean = false;

    openPickGoodsFinish() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        if (this.selectionRow.length === 0) {
            this.showSuccess("warn", "提示", "请选择一条数据");
            return;
        } else {
            this.pickGoodsFinishIf = true;
            this.mask.show();
        }
    }

    pickGoodsFinish() {
        this.refTable();
        this.pickGoodsFinishIf = false;
        this.mask.hide();
    }

    cancelPickGoodsFinish() {
        this.pickGoodsFinishIf = false;
        this.mask.hide();
    }

    /*添加跟踪信息*/
    public traceWinState: any = 'hide';//添加跟踪信息状态
    traceIf: boolean = false;
    //关闭、取消
    hideDialog(who: any) {
        switch (who) {
            case false:
                this.traceWinState = 'hide';
                break;
        }
        this.traceIf = false;
        this.mask.hide();
    }

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
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        let transfer = this.selectLineInfo[0] && this.selectLineInfo[0] || (this.selectLineInfo || {});
        transfer.whatType = "task";
        this.selectLineInfo[0].whatType = "task";
        this.traceIf = true;
        switch (who) {
            case 'trace-win':
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据！");
                    return;
                } else {
                    this.traceWinState = 'show';
                    this.mask.show();
                }
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

    //异常登记
    abnormalIf: boolean = false;

    showAbnormalBox() {
        //判断是否为单选
        if (this.selectLineInfo.length > 1) {
            this.showSuccess("warn", "提示", "只能选择一条任务信息");
            return;
        }
        this.abnormalIf = true;
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
        this.refTable();//刷新列表
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

    selectLineInfo: any[] = [];

    rowSelect(row: any) {
        let select = row[0] ? row[0] : row;

        this.selectLineInfo = row;
        this.rowData = row[0];
        this.wayBill = select.waybill;
        this.btnState = 'show';
        this.selectionRow.length = this.selectLineInfo.length;

        if(row[0]){
            this.tasksType = row[0].taskType;
            this.tasksStatus = row[0].taskStatus;
        }
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
    searchBillId: any;
    searchField: any;
    returnInfo: any;
    goodsDetails: any = {};
    goodsDetailsCount: any = {};
    trackInfoDetails: any = {};

    cellMouseEnter($event, ...restObj: any[]): any {

        let op1 = restObj[0];
        let op2 = restObj[1];
        //如果是跟踪信息字段则显示浮动窗口op
        if ($event.field == "remark") {
            this.cellOverEvent = JSON.stringify($event);
            op1.toggle($event.originalEvent);
            op2 && op2.hide();

            this.trackInfoDetails.taskID = $event.row.id;
            this.trackInfoDetails.trackType = 'task';
            this.api.call("TaskDetailContorller.findTrack", $event, this.trackInfoDetails).ok(json => {
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

    /**
     * 查询清空
     * @type {Array}
     */
    doSelect(){
        this.selectionRow = [];
    }
    // 货品展示
    goodsShow: any = [];
    // goodsShow:any=[
    //     {"product": "椅子", "package":"木架", "installNum": 1, "packNum": 0,"weight":0,"volume":0,"billingMode":'',"unitPrice":0,"serviceType":"","installationCost":229},
    //     {"product": "五斗柜", "package":"木架", "installNum": 1, "packNum": 0,"weight":0,"volume":0,"billingMode":'',"unitPrice":0,"serviceType":"","installationCost":0},
    //     {"product": "六斗柜", "package":"木架", "installNum": 1, "packNum": 0,"weight":0,"volume":0,"billingMode":'',"unitPrice":0,"serviceType":"","installationCost":0},
    //     {"product": "两门酒柜", "package":"木架", "installNum": 1, "packNum": 0,"weight":0,"volume":0,"billingMode":'',"unitPrice":0,"serviceType":"","installationCost":0},
    //     {"product": "单门酒柜", "package":"木架", "installNum": 1, "packNum": 6,"weight":0,"volume":4.1,"billingMode":'体积',"unitPrice":0,"serviceType":"","installationCost":0}
    // ];

    // 跟踪信息
    trackInfo: any = [];
    // trackInfo:any = [
    //     {"lastTrackingTime":'2016-1-14 14:00', "trackingPeople": '小倩', "remark": "叮嘱师傅上门安装", "nextTrackingTime": "2016-1-18 8:55"},
    //     {"lastTrackingTime":'2016-1-18 9:00', "trackingPeople": '小倩', "remark": "已打电话给师傅嘱咐安装", "nextTrackingTime": "2016-1-19 9:55"},
    //     {"lastTrackingTime":'2016-1-19 9:00', "trackingPeople": '小倩', "remark": "叮嘱师傅返货", "nextTrackingTime": "2016-1-19 10:55"}
    // ];

    //表格点击事件
    cellClick(event): void {
        if(event.row.taskType === '自提'){
            this.showSuccess("warn", "提示", "自提任务无详情！");
            return;
        }
        if (event.field === 'waybillId') {
            this.selectionRow.length = 1;
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
                // this.showSuccess("warn","提示","调度任务详情请点击运单号！");
                this.selectionRow.length = 1;
                this.selectLineInfo = event.row;
                this.rowData = event.row;
                this.displayModal();

            } else {
                this.showSuccess("warn", "提示", "该记录无法判断任务类型！");
            }
        }

    }
    /**
     * 标记48小时单
     */
    batcompletionRate48(type?:string) {
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
                    this.refTable();//刷新列表
                    this.ChangeIf = false;
                    this.selectionRow = [];
                    this.showSuccess("success", "提示", "操作成功！");
                })
                .fail(err => {
                    this.showSuccess("error", "提示", "操作失败！");
                });
        });

    }
    // 初始化列
    ngOnInit() {
        this.initColumns();
        this.inputWaybill = this._activatedRoute.snapshot.params['inputWaybill'];
        this.RequestTokenService.createToken()
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
            header: "收货号码",
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
    }
}
