import {Component, OnInit} from "@angular/core";
import {BasicSettingService} from "../../service/basic-setting.service";
import {AbnormalDutyRequestVo} from "../../vo/basic-setting/abnormal-duty-request.vo";
import {RepairTypeRequestVo} from "../../vo/basic-setting/repair-type-request.vo";
import {PartTypeRequestVo} from "../../vo/basic-setting/part-type-request.vo";
import {LogisticsSupplierRequestVo} from "../../vo/basic-setting/logistics-supplier-request.vo";
import {DamageReasonRequestVo} from "../../vo/basic-setting/damage-reason-request.vo";
import {AbnormalTypeRequestVo} from "../../vo/basic-setting/abnormal-type-request.vo";
import {ExceptionDataService} from "../../service/exception-data.service";
import {AbnormalDutyAddVo} from "../../vo/basic-setting/abnormal-duty-add.vo";
import {RepairTypeAddVo}   from "../../vo/basic-setting/repair-type-add.vo";
import {RiskReasonAddVo} from "../../vo/basic-setting/risk-reason-add.vo";
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService} from 'primeng/primeng';

@Component({
    templateUrl: './basic-setting.component.html',
    styleUrls: [
        './basic-setting.component.css'
    ]
})

export class BasicSettingComponent implements OnInit {

    // 出险原因
    public damageReasonRequestVo: DamageReasonRequestVo;
    //出险原因新增VO
    public riskReasonAddVo: RiskReasonAddVo;
    // 责任方
    public abnormalDutyRequestVo: AbnormalDutyRequestVo;
    public abnormalDutyAddVo: AbnormalDutyAddVo;
    public abnormalDutyFindVo: any;
    // 维修任务类型
    public repairTypeRequestVo: RepairTypeRequestVo;
    public repairTypeAddVo: RepairTypeAddVo;

    // 补件任务类型
    public partTypeRequestVo: PartTypeRequestVo;
    vMetaComplementAddOrUpdate: any = {};
    vMetaComplementFind: any = {};
    // 物流供应商
    public logisticsSupplierRequestVo: LogisticsSupplierRequestVo;
    // 异常类型
    public abnormalBigTypeRequestVo: AbnormalTypeRequestVo;
    public abnormalSmallTypeRequestVo: AbnormalTypeRequestVo;
    vAbnormalTypeAddOrUpdate: any = {};
    vAbnormalTypeFind: any = {};
    // 父类id
    public parentId: string;
    public oldId: string;
    // 是否仲裁
    public ifArbitrate: boolean;

    //出险原因查询响应VO
    vRiskReasonFindResponse: any = {};
    //出险原因查询请求VO
    vRiskReasonFindRequest: any = {};
    //指定物流响应VO
    vSpecifyLogisticsResponse: any = {};
    //指定物流请求VO
    vSpecifyLogisticsRequest: any = {};
    //维修类型查询请求VO
    public repairTypeFindRequestVo: any = {};
    //维修类型查询响应VO
    public repairTypeFindResponseVo: any = {};


    //页面page
    gridRequest: any = {}

    constructor(public basicSettingService: BasicSettingService,
                public exceptionDataService: ExceptionDataService,
                public api: API,
                public confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.damageReasonRequestVo = new DamageReasonRequestVo();
        this.abnormalDutyRequestVo = new AbnormalDutyRequestVo();
        this.repairTypeRequestVo = new RepairTypeRequestVo();
        this.partTypeRequestVo = new PartTypeRequestVo();
        this.logisticsSupplierRequestVo = new LogisticsSupplierRequestVo();
        this.abnormalBigTypeRequestVo = new AbnormalTypeRequestVo();
        this.abnormalSmallTypeRequestVo = new AbnormalTypeRequestVo();
        this.abnormalDutyAddVo = new AbnormalDutyAddVo();
        this.riskReasonAddVo = new RiskReasonAddVo();
        this.abnormalDutyFindVo = {};
        this.repairTypeAddVo = new RepairTypeAddVo();

        this.ifArbitrate = false;

        for (let i = this.navList.length - 1; i >= 0; i--) {
            this.navListArr[i] = false;
        }
        this.navListArr[0] = true;

        for (let i = 0; i < 7; i++) {
            this.footerInputArr[i] = '';
        }

        // 获取出险原因
        this.riskReasonFind();

        //获取维修类型
        //this.getRepairType();
    }

    // nav插件引用设置
    navs = ["基础设置表", "异常基础资料", "提醒设置"];
    navHrefs = [
        'modules/base-set/basic-manage/basic-setting',
        'modules/base-set/basic-manage/exception-data',
        'modules/base-set/basic-manage/remind-setting'
    ];
    curIndex = 0;
    curLiIndex = -1;
    curSubLiIndex = -1;

    isFooterInputShow1 = false;
    isFooterInputShow2 = false;

    navList = ['出险原因', '责任方', '维修任务类型', '补件任务类型', '指定物流', '异常类型'];
    curContentIndex = 0;
    navListArr = [];
    footerInputArr = [];

    subList = [];

    riskReason = []; // 出险原因
    abnormalDuty = []; // 责任方
    repairType = []; // 维修任务类型
    partType = []; // 补件任务类型
    specifyLogistics = []; // 物流供应商
    abnormalBigType = []; // 异常大类
    abnormalSmallType = []; // 异常小类
    msgs: any;

    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    changeBlock(index): void {
        let oldIndex = this.curContentIndex;
        this.navListArr[oldIndex] = false;
        this.footerInputArr[oldIndex] = '';
        if (oldIndex === 5) {  // 异常类型
            this.footerInputArr[6] = '';
        }

        this.curContentIndex = index;
        this.navListArr[index] = true;
        this.curLiIndex = -1;
        this.isFooterInputShow1 = false;
        this.isFooterInputShow2 = false;

        if (index === 5) {
            this.subList = [];
        }

        // 获取责任方列表
        if (index == 1 && this.abnormalDuty.length == 0) {
            this.getAbnormalDuty();
        }

        // 获取维修任务列表
        if (index == 2 && this.repairType.length == 0) {
            this.getRepairType();
        }

        // 获取补件任务列表
        if (index == 3 && this.partType.length == 0) {
            this.getPartType();
        }

        // 获取物流供应商列表
        if (index == 4 && this.specifyLogistics.length == 0) {
            this.getSpecifyLogistics();
        }

        // 获取异常大类
        if (index == 5 && this.abnormalBigType.length == 0) {
            this.getAbnormalBigType();
        }

    }

    setLiClass(index) {
        if (index === this.curLiIndex) {
            return {
                selected: true
            };
        } else {
            return {
                selected: false
            };
        }
    }

    setLiClass2(index) {
        if (index === this.curSubLiIndex) {
            return {
                selected: true
            };
        } else {
            return {
                selected: false
            };
        }
    }

    selectLi(index): void {
        this.curLiIndex = index;
    }

    selectLi1(index, id): void {
        this.curLiIndex = index;
        this.curSubLiIndex = -1;
        this.isFooterInputShow2 = false;
        this.footerInputArr[6] = '';
        // 获取异常小类
        this.parentId = id;
        this.getAbnormalSmallType(id);

        //console.log(index);
    }

    selectLi2(index): void {
        this.curSubLiIndex = index;
    }

    changeFooterStatus1(): void {
        this.isFooterInputShow1 = !this.isFooterInputShow1;
    }

    changeFooterStatus2(): void {
        this.isFooterInputShow2 = !this.isFooterInputShow2;
        this.ifArbitrate = false; // 初始化仲裁状态
    }

    /**
     * 修改异常小类仲裁状态
     *
     * @param ifArbitrate
     *          仲裁状态
     * @returns {{checked: boolean}}
     */
    updateCheckbox(ifArbitrate: boolean): any {
        if (ifArbitrate == false || ifArbitrate == undefined) {
            return {
                'checked': false
            };
        } else {
            return {
                'checked': true
            };
        }
    }

    /**
     * 设置异常小类仲裁状态
     */
    setArbitrate(): void {
        if (this.ifArbitrate === true) {
            this.ifArbitrate = false;
        } else {
            this.ifArbitrate = true;
        }
    }

    /**
     * 删除
     * @param tableIndex
     *          选项框索引
     * @param index
     *          列表索引
     * @param id
     */
    delLi(tableIndex, index, id): void {
        let that = this;
        this.alert("是否确认删除？", "提示", function () {
            if (tableIndex === 0) {
                // 出险原因
                that.api.call("riskReasonController.riskReasonDelete", {
                    "id": id
                })
                    .ok(data => {
                        that.riskReason.splice(index, 1);
                    })
                    .fail(data => {
                        if (data.code) {
                            that.items(data.error);
                        } else {
                            that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                        }
                    })

            } else if (tableIndex === 1) {
                // 责任方
                that.api.call('abnormalDutyController.abnormalDutyDelete', {"id": id})
                    .ok(data => {
                        ////console.log('异常责任方删除结果: %s', data);
                        if (data.result.disabled === true) {
                            that.abnormalDuty.splice(index, 1);
                        }
                    })
                    .fail(data => {
                        console.error(data);
                        if (data.code) {
                            that.items(data.error);
                        } else {
                            that.showSuccess("error", "提示", "添加失败，请联系管理员！");
                        }
                    })
            } else if (tableIndex === 2) {
                // 维修任务类型
                that.api.call("repairTypeController.repairDelete", {
                    "id": id
                })
                    .ok(data => {
                        that.repairType.splice(index, 1);
                    })
                    .fail(data => {
                        ////console.log(data);
                        if (data.code) {
                            that.items(data.error);
                        } else {
                            that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                        }
                    })
            } else if (tableIndex === 3) {
                // 补件任务类型
                that.api.call("metaComplementController.metaComplementDelete", {"id": id})
                    .ok(data => {
                        that.partType.splice(index, 1);
                        that.showSuccess("success", "提示", "删除成功！");
                    })
                    .fail(data => {
                        ////console.log(data);
                        that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                    })
            } else if (tableIndex === 4) {
                // 物流供应商

                that.api.call("specifyLogisticsController.specifyLogisticsDelete", {
                    "id": id
                })
                    .ok(data => {
                        that.specifyLogistics.splice(index, 1);
                    })
                    .fail(data => {
                        ////console.log(data);
                        if (data.code) {
                            that.items(data.error);
                        } else {
                            that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                        }
                    })
            } else if (tableIndex === 5) {
                // 异常大类
                that.api.call("abnormalTypeController.abnormalTypeDelete", {"id": id})
                    .ok(data => {
                        that.abnormalBigType.splice(index, 1);
                        that.showSuccess("success", "提示", "删除成功");
                    })
                    .fail(data => {
                        that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                    })
            } else if (tableIndex === 6) {
                // 异常小类
                that.api.call("abnormalTypeController.abnormalTypeDelete", {"id": id})
                    .ok(data => {
                        that.abnormalSmallType.splice(index, 1);
                        that.showSuccess("success", "提示", "删除成功！");
                    })
                    .fail(data => {
                        that.showSuccess("error", "提示", "删除失败，请联系管理员！");
                    })
            }
            if (index === that.curLiIndex) {
                that.curLiIndex = -1;
            }
        }, function () {
            return;
        })
    }

    /*公用弹框*/
    items(msg: string, title?: string) {
        this.confirmationService.confirm({
            message: msg,
            header: title || '提示',
        });
    }

    /**
     * 添加
     * @param index
     */
    addItem(index): void {
        let name = this.footerInputArr[index];

        if (index === 0) {
            // 出险原因
            if (name != '') {
                //如果用户输入中文格式冒号：，用英文形式冒号代替
                name = name.replace(/：/g, ":");
                let [first, last] = name.split(':');
                let reg1= /^[A-Za-z]+$/;
                 let reg2 = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if (!reg1.test(first) || !reg2.test(last)) {
                    this.showSuccess("warn","提示","格式错误，正确格式为：英文名称:中文名称");
                    return;
                }
                this.riskReasonAddVo.name = first;
                this.riskReasonAddVo.label = last;
                this.api.call("riskReasonController.riskReasonAddOrUpdate", this.riskReasonAddVo)
                    .ok(data => {
                        ////console.log('添加或修改成功返回数据: %o', data);
                        this.showSuccess("success", "提示", "添加成功！");
                        this.riskReason.unshift({name: name, hasDel: true, id: data.result.id});
                    })
                    .fail(data => {
                        console.error(data);
                        if (data.code) {
                            this.items(data.error);
                        } else {
                            this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                        }
                    })
            }
        } else if (index === 1) {
            // 责任方
            if (name != '') {
                //如果用户输入中文格式冒号：，用英文形式冒号代替
                name = name.replace(/：/g, ":");
                let [first, last] = name.split(':');
                let reg1= /^[A-Za-z]+$/;
                let reg2 = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if (!reg1.test(first) || !reg2.test(last)) {
                    this.showSuccess("warn","提示","格式错误，正确格式为：英文名称:中文名称");
                    return;
                }
                this.abnormalDutyAddVo.name = first;
                this.abnormalDutyAddVo.label = last;
                this.api.call("abnormalDutyController.abnormalDutyAddOrUpdate", this.abnormalDutyAddVo)
                    .ok(data => {
                        ////console.log('添加或修改成功返回数据: %o', data);
                        this.showSuccess("success", "提示", "添加成功！");
                        this.abnormalDuty.unshift({name: name, hasDel: true, id: data.result.id});
                    })
                    .fail(data => {
                        console.error(data);
                        if (data.code) {
                            this.items(data.error);
                        } else {
                            this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                        }
                    });
            }
        } else if (index === 2) {
            //维修任务类型
            if (name != '') {
                //如果用户输入中文格式冒号：，用英文形式冒号代替
                name = name.replace(/：/g, ":");
                let [first, last] = name.split(':');
                let reg1= /^[A-Za-z]+$/;
                let reg2 = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if (!reg1.test(first) || !reg2.test(last)) {
                    this.showSuccess("warn","提示","格式错误，正确格式为：英文名称:中文名称");
                    return;
                }
                //去除2边空格
                this.repairTypeAddVo.name = first.replace(/(^\s*)|(\s*$)/g, "");
                this.repairTypeAddVo.label = last.replace(/(^\s*)|(\s*$)/g, "");
                this.api.call("repairTypeController.repairAddOrUpdate",
                    this.repairTypeAddVo
                )
                    .ok(data => {
                        ////console.log('添加或修改成功返回数据: %o', data);
                        this.showSuccess("succes", "提示", "添加成功！");
                        this.repairType.push({name: name, hasDel: true, id: data.result.id});
                    })
                    .fail(data => {
                        console.error(data);
                        if (data.code) {
                            this.items(data.error);
                        } else {
                            this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                        }
                    })
            }
        } else if (index === 3) {
            // 补件任务类型
            if (name != '') {
                //如果用户输入中文格式冒号：，用英文形式冒号代替
                name = name.replace(/：/g, ":");
                let [first, last] = name.split(':');
                let reg1= /^[A-Za-z]+$/;
                let reg2 = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if (!reg1.test(first) || !reg2.test(last)) {
                    this.showSuccess("warn","提示","格式错误，正确格式为：英文名称:中文名称");
                    return;
                }
                this.vMetaComplementAddOrUpdate.name = first;
                this.vMetaComplementAddOrUpdate.label = last;
                this.api.call("metaComplementController.metaComplementAdd", this.vMetaComplementAddOrUpdate)
                    .ok(data => {
                        ////console.log('添加或修改成功返回数据: %o', data);
                        this.showSuccess("success", "提示", "添加成功！");
                        this.partType.push({name: name, hasDel: true, id: data.result.id});
                    })
                    .fail(data => {
                        console.error(data);
                        if (data.code) {
                            this.items(data.error);
                        } else {
                            this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                        }
                    })
            }
        } else if (index === 4) {
            // 物流供应商
            if (name != '') {
                if (name != '') {
                    //如果用户输入中文格式冒号：，用英文形式冒号代替
                    name = name.replace(/：/g, ":");
                    let [first, last] = name.split(':');
                    let reg1= /^[A-Za-z]+$/;
                    let reg2 = new RegExp("[\\u4E00-\\u9FFF]+","g");
                    if (!reg1.test(first) || !reg2.test(last)) {
                        this.showSuccess("warn","提示","格式错误，正确格式为：英文名称:中文名称");
                        return;
                    }
                    this.api.call("specifyLogisticsController.specifyLogisticsAddOrUpdate", {
                        "name": first,
                        "label": last
                    })
                        .ok(data => {
                            ////console.log('添加或修改成功返回数据: %o', data);
                            this.showSuccess("success", "提示", "添加成功！");
                            this.specifyLogistics.unshift({name: name, hasDel: true, id: data.result.id});
                        })
                        .fail(data => {
                            console.error(data);
                            if (data.code) {
                                this.items(data.error);
                            } else {
                                this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                            }
                        })
                }
            }
        } else if (index === 5) {
            if (name != '') {
                // 异常大类
                this.api.call("abnormalTypeController.abnormalTypeAddOrUpdate", {
                    "name": name,
                    "oldId": this.oldId
                })
                    .ok(data => {
                        ////console.log('添加或修改成功返回数据: %o', data);
                        this.showSuccess("success", "提示", "添加成功！");
                        this.abnormalBigType.push({
                            name: name,
                            hasDel: true,
                            id: data.result.id,
                            parentId: data.result.parentId
                        });
                    })
                    .fail(data => {
                        ////console.log(data);
                        this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                    })
            }
        } else if (index === 6) {
            if (name != '' && this.curLiIndex != -1) {
                // 异常小类
                this.api.call("abnormalTypeController.abnormalTypeAddOrUpdate", {
                    "name": name,
                    "ifArbitrate": this.ifArbitrate,
                    "parentId": this.parentId,
                    "oldId": this.oldId
                })
                    .ok(data => {
                        this.showSuccess("success", "提示", "添加成功！");
                        this.abnormalSmallType.push({
                            name: name,
                            hasDel: true,
                            id: data.result.id,
                            ifArbitrate: data.result.arbitrate,
                            parentId: data.result.parentId,
                            grade: "select" + index.id
                        });
                    })
                    .fail(data => {
                        this.showSuccess("error", "提示", "添加小类失败，请联系管理员！");
                    })
            }
        }
        this.footerInputArr[index] = '';
    }

    /**
     * 搜索/查询出险原因
     */
    riskReasonFind(): void {
        this.riskReason = []; // 清空出险原因
        this.gridRequest = {"first": 0, "rows": 1000};//分页

        this.api.call('riskReasonController.riskReasonFind', this.gridRequest, this.vRiskReasonFindRequest)
            .ok(data => {
                this.vRiskReasonFindResponse = Object.assign(data.result);
                for (let index of this.vRiskReasonFindResponse.content) {
                    this.riskReason.push({name: index.name + ':' + index.label, hasDel: true, id: index.id});
                }

            })
            .fail(data => {
                ////console.log(data);
                if (data.code) {
                    this.items(data.code);
                } else {
                    this.showSuccess("error", "提示", "查询失败，请联系管理员！");
                }
            })
    }


    /**
     * 搜索/查询责任方
     */
    getAbnormalDuty(): void {
        // 清空列表
        this.abnormalDuty = [];
        this.api.call('abnormalDutyController.abnormalDutyFind', {"first": 0, "rows": 1000}, this.abnormalDutyFindVo)
            .ok(data => {
                ////console.log('异常责任方查询结果: %o', data);
                let rows = data.result.content;
                for (let i = 0; i < rows.length; i++) {
                    this.abnormalDuty.push({name: rows[i].name + ':' + rows[i].label, hasDel: true, id: rows[i].id});
                }
                ////console.log('异常责任方列表: %o', this.abnormalDuty);
            })
            .fail(data => {
                console.error(data);
                if (data.code) {
                    this.items(data.error);
                } else {
                    this.showSuccess("error", "提示", "添加失败，请联系管理员！");
                }
            })
    }

    /**
     * 搜索/查询维修任务类型
     */
    getRepairType(): void {
        this.repairType = []; // 清空维修类型
        this.gridRequest = {"first": 0, "rows": 1000};//分页
        this.api.call('repairTypeController.repairFind', this.gridRequest, this.repairTypeFindRequestVo)
            .ok(data => {
                this.repairTypeFindResponseVo = Object.assign(data.result);

                for (let index of this.repairTypeFindResponseVo.content) {
                    this.repairType.push({name: index.name + ':' + index.label, hasDel: true, id: index.id});
                }

            })
            .fail(data => {
                ////console.log(data);
                if (data.code) {
                    this.items(data.code);
                } else {
                    this.showSuccess("error", "提示", "查询失败，请联系管理员！");
                }
            })
    }

    /**
     * 搜索/查询补件任务类型
     */
    getPartType(): void {
        this.partType = []; // 清空partType
        this.gridRequest = {"first": 0, "rows": 1000};	//分页
        this.api.call('metaComplementController.metaComplementFind', this.gridRequest, this.vMetaComplementFind)
            .ok(data => {
                for (let index of data.result.content) {
                    this.partType.push({name: index.label, hasDel: true, id: index.id});
                }
            })
            .fail(data => {
                ////console.log(data);
                this.showSuccess("error", "提示", "查询失败，请联系管理员！");
            })
    }

    /**
     * 搜索/查询物流供应商
     */
    getSpecifyLogistics(): void {
        this.specifyLogistics = []; // 清空specifyLogistics
        this.gridRequest = {"first": 0, "rows": 1000};//分页

        this.api.call('specifyLogisticsController.specifyLogisticsFind', this.gridRequest, this.vSpecifyLogisticsRequest)
            .ok(data => {
                this.vSpecifyLogisticsResponse = Object.assign(data.result)

                for (let index of this.vSpecifyLogisticsResponse.content) {
                    this.specifyLogistics.push({name: index.name + ':' + index.label, hasDel: true, id: index.id});
                }

            })
            .fail(data => {
                ////console.log(data);
                if (data.code) {
                    this.items(data.code);
                } else {
                    this.showSuccess("error", "提示", "查询失败，请联系管理员！");
                }
            })
    }

    /**
     * 搜索/查询异常大类
     */
    getAbnormalBigType(): void {
        this.abnormalBigType = [];		//清空异常类型s
        this.gridRequest = {"first": 0, "rows": 1000};		//分页
        this.api.call('abnormalTypeController.abnormalTypeFind', this.gridRequest, this.vAbnormalTypeAddOrUpdate)
            .ok(data => {
                //this.vAbnormalTypeFind = Object.assign(data.result)
                for (let index of data.result.content) {
                    this.abnormalBigType.push({
                        name: index.name,
                        hasDel: true,
                        id: index.id,
                        parentId: index.parentId,
                        oldId: index.oldId
                    });
                }
            })
            .fail(data => {
                ////console.log(data);
                this.showSuccess("error", "提示", "查询失败，请联系管理员！");
            })
    }

    /**
     * 搜索/查询异常小类
     */
    getAbnormalSmallType(parentId): void {
        this.abnormalSmallType = []; // 清空abnormalSmallType
        this.gridRequest = {"first": 0, "rows": 1000};		//分页
        //alert(parentId);
        this.vAbnormalTypeFind.parentId = parentId;
        this.api.call('abnormalTypeController.abnormalTypeFind', this.gridRequest, this.vAbnormalTypeFind)
            .ok(data => {
                //this.vAbnormalTypeFind = Object.assign(data.result)
                let content=data.result.content || [];
                for (let index of content) {
                    let obj = {
                        name: index.name,
                        hasDel:true,
                        id: index.id,
                        grade: index.grade,
                        ifArbitrate: index.arbitrated,
                        oldId: index.oldId
                    }
                    this.abnormalSmallType.push(obj);
                    //console.log(this.abnormalSmallType);
                }
            })
            .fail(data => {
                ////console.log(data);
                this.showSuccess("error", "提示", "查询小类失败，请联系管理员！");
            })
    }

    /*
     * p1-p5函数*/
    send(int: string, value: any, id: string) {
        this.vAbnormalTypeAddOrUpdate.grade = value;
        this.vAbnormalTypeAddOrUpdate.id = id;
        //console.log(this.vAbnormalTypeAddOrUpdate);
        
        //修改等级
        if(value == ""){
        	this.showSuccess("error", "提示", "提醒等级未设置！");
        	return;
        }
        this.api.call('abnormalTypeController.abnormalTypeAddOrUpdate', this.vAbnormalTypeAddOrUpdate)
            .ok(data => {
                this.showSuccess("success", "提示", "修改成功！");
            })
            .fail(data => {
	            if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                	this.showSuccess("error", "提示", "修改失败，请联系管理员！");
                }
            })
    };

    /**
     * 修改异常小类仲裁状态
     */
    updateArbitrate(liIndex: number, id: string, oldId: string) {
      //  if (id == this.vAbnormalTypeAddOrUpdate.id) {
            this.vAbnormalTypeAddOrUpdate.oldId = oldId;
            this.vAbnormalTypeAddOrUpdate.id = id;
            if (this.abnormalSmallType[liIndex]['ifArbitrate'] === true) {
                this.vAbnormalTypeAddOrUpdate.arbitrate = false;
            } else {
                this.vAbnormalTypeAddOrUpdate.arbitrate = true;
            }
            this.api.call('abnormalTypeController.abnormalTypeAddOrUpdate', this.vAbnormalTypeAddOrUpdate)

                .ok(data => {
                    ////console.log('修改成功返回数据: %o', data);
                    this.showSuccess("success", "提示", "修改成功！");
                    if (this.abnormalSmallType[liIndex]['ifArbitrate'] === true) {
                        this.abnormalSmallType[liIndex]['ifArbitrate'] = false;
                    } else {
                        this.abnormalSmallType[liIndex]['ifArbitrate'] = true;
                    }
                })
                .fail(data => {
					if (data.code) {
	                    this.showSuccess("error", "提示", data.error);
	                } else {
                    	this.showSuccess("error", "提示", "修改失败，请联系管理员！");
                    }
                })
        //console.log(this.abnormalSmallType);
 //       } else {
  //         this.showSuccess("warn", "提示", "请选择P等级");
  //      }

    }

    /*
     * 公用弹窗*/
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
    arbitra(value){
        //console.log(value);
    }
}