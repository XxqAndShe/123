import {Component, OnInit, Output} from '@angular/core';
import {MasterManageRequestVo} from "../../vo/master-manage-request.vo";
import {API} from "../../../../share/lib/api/api";
import {AreaService} from '../../../../share/app-service/area.service';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service'
import {ConfirmationService} from 'primeng/primeng';
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";
import {MasterManageCheckResponse} from "../../vo/master-manger-check-response.vo";
import {RequestTokenService} from "../../../../share/app-service/request-token.service";
import {overlayPanelHide} from "../../../../share/utils/gridUtil";
import {stringify} from "querystring";
@Component({
    templateUrl: './master-manage.component.html',
    styleUrls: [
        './master-manage.component.css'
    ],
    animations: [
        modalAnimation
    ]
})
export class MasterManageComponent implements OnInit {

    /*header默认值*/
    // 右侧弹出块显示的控制变量
    isModuleDisplayArrCheck: boolean = false;
    isModuleDisplayArrNew: boolean = false;
    isModuleDisplayArrEdit: boolean = false;
    /*控制动画*/
    isModuleDisplayArr1Check: boolean = false;
    isModuleDisplayArr1New: boolean = false;
    isModuleDisplayArr1Edit: boolean = false;
    loadingIf:boolean = false;//加载中
    redColor: string;
    curModalIndex = -1;
    curIndex: any = 0;
    selectedRow: any[] = [];//选中记录
    msgs: any;//公用提示
    loading:boolean;
    //hover表格服务区域
    cellOverEvent: any;
    serviceAreas: any[];
    //输入框组件
    public temp: string;
    public suggestionResult: string[];//查询建议结果
    userWorkerInfoed: any = {};
    //基本信息
    user: any = {};
    //部分组织信息
    userWorkerCompany: any = {};
    //常规服务
    typeOfservice: any = [];
    //增值服务
    valueAddService: any = [];
    master:string;//判断师傅与修改
    userWorkerServiceArea: any = [];
    imgArr: string[];//认证照片

    masterManageRequestVo: MasterManageRequestVo;
    columns: any[] = [];
    areaCode1: any;
    data: any;
    deleteSucceed: boolean = false;//删除提示框，默认不显示
    rtw: boolean = false;//恢复白名单提示框，默认不显示
    jtb;
    boolean = false;//加入黑名单提示框，默认不显示
    startUsing: boolean = false;//启用提示框，默认不显示
    stopUsing: boolean = false;//停用弹框，默认隐藏
    // data:any[]=[];
    @Output() selections: any[] = [];

    //停用
    HowDay: string;//停用天数
    ReasonsForStop: string;//停用理由

    /*定义布尔*/
    MuchDay: boolean = true;
    WhyReasons: boolean = false;
    /*相关提示*/
    itemHowDay: string = '请输入停用天数';
    itemStopReasons: string = '请输入理由';
    /**
     * 查看响应的vo
     */
    masterMangerCheckResponse: MasterManageCheckResponse;


    constructor(public api: API,
                public areaService: AreaService,
                public mask: ShowOrHideMaskService,
                public confirmationService: ConfirmationService,
                public RequestTokenService: RequestTokenService) {
    }


    selectNum: number = 0; //选中项数
    isJoinBlacklist = true;//加入黑名单
    isStart = false;//启用
    notStart = true;//停用
    backEnd: string = "backEndAll";//头部标题，后端后
    cooperationState:boolean = true;
    navs = ["全部", "正常", "停用", "黑名单"];

    searchResult(event, type?) {
        //console.log(event.query)
        this.api.call("UserWorkerController.findMasterByNameOrAccount", {
            realName: event.query,
            mobile: ""
        }).ok(json => {
            this.suggestionResult = json.result;

        }).fail(json => {

            this.showSuccess("error", "提示", "查询失败");

        })
    }

    searchResult2(event, type?) {
        //console.log(event.query)
        this.api.call("UserWorkerController.findMasterByNameOrAccount", {
            realName: "",
            mobile: event.query
        }).ok(json => {
            this.suggestionResult = json.result;

        }).fail(json => {

            this.showSuccess("error", "提示", "查询失败");

        })
    }

    /*父组件绑定函数，让子组件去触发*/
    changeNav(i) {
        //传后端用于查询
        if (i == 0) {
            this.backEnd = "backEndAll";
        } else if (i == 1) {
            this.backEnd = "serves";
        } else if (i == 2) {
            this.backEnd = "stop";
        } else if (i == 3) {//点击黑名单
            this.backEnd = "block";
        }
        this.selections.length = 0;//切换标签按钮，让表格选中数据归零
        this.queryData();
    }


    /*增加师傅动画*/
    displayModalNew(index) {
            this.master = "new";
            var that = this;
            this.isModuleDisplayArrEdit = true;
            //关闭查看详情
            this.isModuleDisplayArrCheck = false;
            this.isModuleDisplayArr1Check = false;
            //关闭添加师傅
            this.isModuleDisplayArr1New = false;
            this.isModuleDisplayArrNew = false;
            setTimeout(function () {
                that.isModuleDisplayArr1Edit = true;
            }, 0);
            this.curModalIndex = index;
    }

    /*查找资料动画*/
    displayModalCheck(index) {

        this.pageInit(index);

    }

    /**
     * 展开详情弹窗
     * @param index
     */
    displayView(index) {
        //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            var that = this;
            this.isModuleDisplayArrCheck = true;
            //修改资料关闭
            this.isModuleDisplayArrEdit = false;
            this.isModuleDisplayArr1Edit = false;
            //添加师傅关闭
            this.isModuleDisplayArr1New = false;
            this.isModuleDisplayArrNew = false;
            setTimeout(function () {
                that.isModuleDisplayArr1Check = true;
            }, 0);
            this.curModalIndex = index;
        }
    }

    pageInit(index) {


        this.api.call("UserWorkerOperationeController.checkUserWorker", {


                id: this.selections[0].id


            }
        ).ok(json => {
            if (json.result) {


                this.userWorkerInfoed = json.result;
                //师傅id;

                this.masterMangerCheckResponse.masterId = this.userWorkerInfoed.masterId;
                //师傅账号
                this.masterMangerCheckResponse.masterAccount = this.userWorkerInfoed.vEuser.mobile;
                //师傅姓名
                this.masterMangerCheckResponse.masterName = this.userWorkerInfoed.vEuser.realName;
                //组织信息

                let userWorkerCompany = this.userWorkerInfoed.vUserWorkerCompany || {};
                //最大接单量
                this.masterMangerCheckResponse.maxOrder = userWorkerCompany.maxOrder;

                //保证金阈值
                this.masterMangerCheckResponse.marginThreshold = userWorkerCompany.bond;
                //已缴纳保证金
                this.masterMangerCheckResponse.marginPaid = userWorkerCompany.payBond;
                //团队人数
                this.masterMangerCheckResponse.teamsNum = userWorkerCompany.teamAmount;
                //合作方式
                this.masterMangerCheckResponse.cooperationMethod = this.userWorkerInfoed.accountType;
                //console.log(this.masterMangerCheckResponse.cooperationMethod);
                //车辆数量
                this.masterMangerCheckResponse.carsNum = userWorkerCompany.carAamount;
                //车辆容积
                this.masterMangerCheckResponse.carVolume = userWorkerCompany.carVolume;
                //仓库容积(方)
                this.masterMangerCheckResponse.warehouseVolume = userWorkerCompany.carWeight;
                //仓库地址
                this.masterMangerCheckResponse.warehouseAddress = userWorkerCompany.warehouseAddress;
                //通行证

                this.masterMangerCheckResponse.passport = this.userWorkerInfoed.pass;
                //入行时间
                this.masterMangerCheckResponse.cooperationDate = this.userWorkerInfoed.cooperationDate;


                this.masterMangerCheckResponse.ProductRange = userWorkerCompany.businessScope;
                //合作单位
                this.masterMangerCheckResponse.cooperationUnit = userWorkerCompany.cooperationCompany;
                //结款方式
                this.masterMangerCheckResponse.paymentMethod = this.userWorkerInfoed.paymentType;
                //工资结算方式
                this.masterMangerCheckResponse.wageSettlement = userWorkerCompany.wagesPayType;
                //开发票
                this.masterMangerCheckResponse.invoice = this.userWorkerInfoed.invoice;
                //console.log("1111111111");
                //console.log(this.masterMangerCheckResponse.invoice);
                //电商节最大处理订单数
                this.masterMangerCheckResponse.maxOrders = userWorkerCompany.activityAmount;
                //平均日订单量
                this.masterMangerCheckResponse.averageOrder = userWorkerCompany.dayAamount;
                //商品范围

                // 合作时间
                this.masterMangerCheckResponse.cooperationTime = userWorkerCompany.createDate;
                //智通订单占比
                this.masterMangerCheckResponse.orderProportion = userWorkerCompany.orderProportion;
                //账号信息
                //账号类型
                this.masterMangerCheckResponse.userAccount = this.userWorkerInfoed.receiptAccountType;

                //	姓名(支付宝）
                this.masterMangerCheckResponse.alipayName = this.userWorkerInfoed.accountName || {};
                //账号
                this.masterMangerCheckResponse.alipayAccount = this.userWorkerInfoed.bankAccount || {};
                //银行名称
                this.masterMangerCheckResponse.bankName = this.userWorkerInfoed.bankName || {};
                //支行名称
                this.masterMangerCheckResponse.subBranchName = this.userWorkerInfoed.subBranchName || {};
                //开户姓名
                this.masterMangerCheckResponse.accountName = this.userWorkerInfoed.accountName || {};
                //银行账号
                this.masterMangerCheckResponse.bankAccount = this.userWorkerInfoed.bankAccount || {};

                this.typeOfservice = this.userWorkerInfoed.veUserWokerBasicServices;


                this.valueAddService = this.userWorkerInfoed.veUserWokerIncrementServices;
                //console.log("增值服务" + this.valueAddService);
                this.userWorkerServiceArea = this.userWorkerInfoed.userWorkerServiceAreas;
                this.imgArr = this.userWorkerInfoed.list;

                ////console.log("123456");
                //  //console.log(this.imgArr);
                //  this.zPath=this.userWorkerInfoed.zPath;


                //赋值成功弹窗
                this.displayView(index);


            }
        }) .fail(json => {
            //console.log(json);
            this.showSuccess("error", "提示", "查询失败！");
        });


    }

    /**
     * 修改初始化方法
     */
    pageCheck(index) {


    }

    /**
     * 修改详情窗口
     */
    /**
    *修改资料动画*/
    displayModalEdit(index) {
        this.master = "edit";
     //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            var that = this;
            this.isModuleDisplayArrEdit = true;
            //关闭查看详情
            this.isModuleDisplayArrCheck = false;
            this.isModuleDisplayArr1Check = false;
            //关闭添加师傅
            this.isModuleDisplayArr1New = false;
            this.isModuleDisplayArrNew = false;
            setTimeout(function () {
                that.isModuleDisplayArr1Edit = true;
            }, 0);
            this.curModalIndex = index;
        }
    }

    /*关闭查找动画*/
    closeModalCheck(isClose: boolean) {
        var that = this;
        this.isModuleDisplayArr1Check = isClose;
        setTimeout(function () {
            that.isModuleDisplayArrCheck = isClose;
        }, 200);

    }

    /*关闭修改动画*/
    closeModalEdit(isClose: boolean) {
        var that = this;
        this.isModuleDisplayArr1Edit = isClose;
        setTimeout(function () {
            sessionStorage.removeItem("areaEdit");//关闭修改资料后，清除本地缓存
            that.isModuleDisplayArrEdit = isClose;
        }, 200);
    }

    /*关闭添加师傅动画*/
    closeModalNew(isClose: boolean) {
        var that = this;
        this.isModuleDisplayArr1New = isClose;
        setTimeout(function () {
            sessionStorage.removeItem("areaNew");//关闭添加师傅后，清除本地缓存
            that.isModuleDisplayArrNew = isClose;
        }, 200);
        //console.log('closeModalNew')
    }

    /*公用弹框*/
    items(msg: string, title?: string) {
        this.confirmationService.confirm({
            message: msg,
            header: title || '提示',
        });
    }

    /*删除联系人*/
    deleteLinkMan() {
        //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.deleteSucceed = true;
            this.mask.show();
        }

    }

    /*取消删除，隐藏“删除弹出框”*/
    cancelDeletel() {
        this.deleteSucceed = false;
        this.mask.hide();
    }

    /*确认删除，隐藏“删除弹出框”*/
    confirmDeletel() {
        this.deleteSucceed = false;
        this.mask.hide();
        this.api.call("UserWorkerOperationeController.disableCoop", {
            id: this.selections[0].id
        }).ok(json => {
            this.doSearch();
            this.selections = [];
            this.showSuccess("success", "提示", "操作成功！");
        }).fail(json => {
            this.showSuccess("error", "提示", json.error);
        });

    }


    /*恢复白名单*/
    restoreTWl() {
        //判断单选
        if(this.selections.length>1){
           this.showSuccess("warn","提示","只能选择一条任务消息");
           return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.rtw = true;
            this.mask.show()
        }
    }

    /*确认恢复白名单*/
    confirmDestorew($event) {
        this.rtw = false;
        this.mask.hide();

        this.api.call("UserWorkerOperationeController.recoverWhiteList", {
            masterAccount: this.selections[0]["masterAccount"],
            id: this.selections[0].id
        }).ok(json => {
            this.doSearch();
            this.selections = [];
            this.showSuccess("success", "提示", "操作成功！");

        }).fail(json => {
            this.showSuccess("error", "提示", json.error);
        });

    }

    /*取消恢复白名单*/
    cancelDestorew() {
        this.rtw = false;
        this.mask.hide();
    }

    /*加入黑名单*/
    jionTheBlacklist() {
        //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.jtb = true;
            this.mask.show()
        }

    }

    /**
     * 确认拉入黑名单
     * */
    confirmJoinb() {
        this.jtb = false;
        this.mask.hide();
        this.api.call("UserWorkerOperationeController.joinMasterblacklist", {
            masterAccount: this.selections[0]["masterAccount"],
            id: this.selections[0].id

        }).ok(json => {
            // this.data = json.result;
            // console.log(this.data);
            this.doSearch();
            this.selections = [];
            this.showSuccess("success", "提示", "操作成功！");
        }).fail(json => {
            this.showSuccess("error", "提示", "师傅有未完成的任务和未提现的余额或提现中待审核的提现申请，不能解约");
        });
    }

    /*取消拉入黑名单*/
    cancelJoinb() {
        this.jtb = false;
        this.mask.hide();
    }

    /*启用提示框*/
    startLinkMan() {
        //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.startUsing = true;
            this.mask.show()
        }
    }

    /**
     * 确认启用
     * */
    confirmStart() {
        // debugger;
        this.startUsing = false;
        this.mask.hide()
        this.api.call("UserWorkerOperationeController.enableUserWorker",
            {
                masterAccount: this.selections[0].masterAccount,
                id: this.selections[0].id
            }
        ).ok(json => {
            this.doSearch();
            this.selections = [];
            this.showSuccess("success", "提示", "操作成功！");

        }).fail(json => {
            //console.log(json.error);
            this.showSuccess("error", "提示", json.error);
        });

    }

    /*停用联系人*/
    stopLinkMan() {
        //判断单选
        if(this.selections.length>1){
            this.showSuccess("warn","提示","只能选择一条任务消息");
            return;
        }
        if(this.selections[0].departmentName !== "一智通供应链管理有限公司"){
            this.showSuccess("warn","提示","不能操作网点师傅");
            return;
        }
        if (this.selections.length == 0) {
            this.showSuccess("warn","提示","请选择一条数据");
        } else {
            this.stopUsing = true;
            this.HowDay = "1";
            this.ReasonsForStop = null;
            this.mask.show()
        }
    }

    /*数据的绑定*/
    /*失去焦点天数时判断输入*/
    fnHowDay(value: string) {
        if (parseFloat(value) < 1) {
            this.showSuccess("warn", "提示", "停用天数不能小于1");
            this.MuchDay = false;
        } else
            this.MuchDay = true;

    }

    /**
     * 确认停用
     * */
    confirmStopUsing() {
        if (parseFloat(this.HowDay) < 1) {
            this.showSuccess("warn", "提示", "停用天数不能小于1");
            return;
        } else if (this.ReasonsForStop == undefined || this.ReasonsForStop == "") {
            this.showSuccess("warn", "提示", "停用理由不能为空");
            return;
        }
        this.api.call("UserWorkerOperationeController.visableUserWorker",
            //请求账号
            {
                masterAccount: this.selections[0].masterAccount,
                id: this.selections[0].id,
                //请求天数
                disabledDay: this.HowDay,
                //请求原因
                disabledReason: this.ReasonsForStop


            }
        ).ok(json => {

            this.doSearch();
            this.stopUsing = false;
            this.mask.hide();
            this.selections = [];;
            this.showSuccess("success", "提示", "停用成功！");

        }).fail(json => {
            //console.log(json.error);
            this.showSuccess("error", "提示", json.error);
        });

    }

    /*取消停用*/
    cancelStopUsing() {
        this.HowDay = null;
        this.ReasonsForStop = null;
        this.stopUsing = false;
        this.mask.hide()
    }

    /*点击删除符号，删除提示框（公共）*/
    deleteSymbol() {
        this.jtb = false;
        this.rtw = false;
        this.deleteSucceed = false;
        this.startUsing = false;
        this.stopUsing = false;
        this.mask.hide()
    }

    /*关闭列表上按钮*/
    DeleteSelectNum() {
        this.selections = [];
        this.selectNum = 0;
    }

    /**
     *
     * @param $event
     */
    load($event): any {
        // this.queryData();
        this.api.call("UserWorkerOperationeController.getUserWorkerList", $event
            ,
            {
                reqParameter: this.backEnd,
                areaCode: this.masterManageRequestVo.areaCode,
                typeOfService: this.masterManageRequestVo.typeOfService,
                valueAddService: this.masterManageRequestVo.valueAddService,
                AuditStatus: this.masterManageRequestVo.auditStatus,
                masterName: this.masterManageRequestVo.masterName,
                masterAccount: this.masterManageRequestVo.masterAccount
            }
        ).ok(json => {
            this.data = json.result;
            //console.log(this.data);
        })
            .fail(json => {
                this.showSuccess("error", "提示", json.error);
            });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('UserWorkerOperationeController.getUserWorkerList', {
            first:0,
            rows:99999999
        }, {
            reqParameter: this.backEnd,
            areaCode: this.masterManageRequestVo.areaCode,
            typeOfService: this.masterManageRequestVo.typeOfService,
            valueAddService: this.masterManageRequestVo.valueAddService,
            AuditStatus: this.masterManageRequestVo.auditStatus,
            masterName: this.masterManageRequestVo.masterName,
            masterAccount: this.masterManageRequestVo.masterAccount
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
     * 表格点击选中状态
     * */
    rowSelect($event): any {
        let select = $event[0] ? $event[0] : 0;
        this.selections = $event;
        this.selectNum = this.selections.length;
        this.selectedRow = $event;

        //切换按钮
        if (select.auditStatus == "正常") {//点击服务
            this.notStart = true;
            this.isStart = false;
            this.isJoinBlacklist = true;
        } else if (select.auditStatus == "停用") {
            this.isStart = true;
            this.notStart = false;
            this.isJoinBlacklist = true;
        } else {
            this.isStart = false;
            this.notStart = false;
            this.isJoinBlacklist = false;
        }

        if(!(select.companiesType == "是")){
            this.cooperationState = false;
        }else {
            this.cooperationState = true;
        }
    }

    /**
     * 查询操作
     */
    doSearch($event?: any) {
        this.queryData();
        this.loading = true;
        this.DeleteSelectNum();//点击查询的时候清空列表
    }

    /**
     * 选中的单元格数据
     */

    cellMouseEnter($event, ...restObj: any[]): any {
        // debugger;
        let op1 = restObj[0];
        this.areaCode1 = $event;
        //如果是跟踪信息字段则显示浮动窗口op
        // if ($event.field == "areaCode") {
        //     this.cellOverEvent = JSON.stringify($event);
        //     this.serviceAreas = $event.row.serviceAreaGrid;
        //
        //     op1.toggle($event.originalEvent);
        // }
    }

    // cellMouseLeave($event, ...restObj: any[]) {
    //     overlayPanelHide($event, restObj, ['areaCode']);
    // }

    /**
     * 服务区域弹窗
    */
    cellClick(cell,op1): void {
        if (cell.field == "areaCode") {
            this.cellOverEvent = JSON.stringify(cell);
            //this.serviceAreas = cell.row.serviceAreaGrid;
            var masterId = cell.row.id;
            this.mask.show();
            this.loadingIf = true;
            this.serviceAreas = [];
            this.api.call("UserWorkerOperationeController.getUserWorkerAreaCity", {"masterId":masterId}).ok(data=>{
                //console.log("服务区域=====" + stringify(data.result));
                this.serviceAreas = data.result ||[];
                this.loadingIf = false;
                this.mask.hide();
                op1.toggle(cell.originalEvent);
            }).fail(err=>{
                this.showSuccess("error", "提示", err.error);
            });
            //console.log(cell);
        }
    }


    //地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    //查询数据获取师傅列表
    queryData() {
        this.api.call("UserWorkerOperationeController.getUserWorkerList",
            {first: 0, rows: 10},
            {
                reqParameter: this.backEnd,
                areaCode: this.masterManageRequestVo.areaCode,
                typeOfService: this.masterManageRequestVo.typeOfService,
                valueAddService: this.masterManageRequestVo.valueAddService,
                AuditStatus: this.masterManageRequestVo.auditStatus,
                masterName: this.masterManageRequestVo.masterName,
                masterAccount: this.masterManageRequestVo.masterAccount,
                companiesType: this.masterManageRequestVo.companiesType
            }
        ).ok(json => {
            this.data = json.result;
            this.loading = false;
        })
            .fail(json => {
                this.loading = false;
                this.showSuccess("error", "提示", json.error);

            });
    }

    /*
     * 修改师傅保存*/
    preservationEdit() {
        this.showSuccess("success", "提示", "操作成功！");
        this.doSearch();//刷新列表
        this.selections = [];
        this.closeModalEdit(false);
    }

    ngOnInit(): void {
        sessionStorage.removeItem("areaEdit");//移除本地缓存
        sessionStorage.removeItem("areaNew");//移除本地缓存
        this.RequestTokenService.createToken();
        this.masterManageRequestVo = new MasterManageRequestVo();
        this.masterManageRequestVo.typeOfService = "All";
        this.masterManageRequestVo.valueAddService = "All";
        this.masterManageRequestVo.companiesType = "All";
        this.masterManageRequestVo.auditStatus = "All";
        this.userWorkerInfoed = "";

        this.user = "";
        this.masterMangerCheckResponse = new MasterManageCheckResponse();
        this.typeOfservice = ["湖南"];
        this.valueAddService = [];
        ;
        this.userWorkerServiceArea = [];


        this.columns.push({
            field: "departmentName",
            header: "所属网点",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "masterName",
            header: "师傅名称",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "masterAccount",
            header: "师傅手机",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "auditState",
            header: "认证状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "companiesType",
            header: "是否合作",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "areaCode",
            header: "服务区域",
            sortable: false,
            filter: true,
            link: true
        });
        this.columns.push({
            field: "auditStatus",
            header: "状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "creditPoints",
            header: "信用分",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "priority",
            header: "优先级",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "maxOrder",
            header: "最大接单量",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "warehouseVolume",
            header: "仓库体积",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "warehouseAddress",
            header: "仓库地址",
            sortable: false,
            filter: true
        });
    }

}



