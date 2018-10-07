import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    AfterViewInit,
    Input,
    animate,
    state,
    transition,
    style,
    trigger
} from '@angular/core';

import {MasterManageEditRequestVo} from '../../vo/master-manage-edit-request.vo'
import {API} from "../../../../share/lib/api/api";
import {MasterManageEditService} from "../../service/master-manage-edit.service";
import {AreaService} from '../../../../share/app-service/area.service';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {MasterManageServiceVo}from '../../vo/master-manage-service.vo';
import {RequestTokenService} from "../../../../share/app-service/request-token.service";

@Component({
    selector: 'master-manage-edit',
    templateUrl: './master-manage-edit.component.html',
    styleUrls: [
        './master-manage-common.component.css',
        './master-manage-edit.component.css'
    ],
    animations: [
        trigger('modalState', [
            state('in', style({
                right: '0'
            })),
            state('out', style({
                right: '-1040px'
            })),
            transition('out => in', animate('200ms ease-in')),
            transition('in => out', animate('200ms ease-out'))
        ])
    ]
})

export class MasterManageEditComponent implements OnInit,AfterViewInit {
    @Input()
        master;
    isMore: boolean = false;
    msgs: any;
    ReturnCargo: boolean = false;//返货
    Maintenance: boolean = false;//维修
    valueAddServiceIf: boolean = false;//维修小项
    selectedCategoriesc: any[] = [];//选中维修小项
    RegularService: string;
    masterManageService: any[] = [];//Todo 常规服务
    adressObj: any;//服务区域;后端接口 Todo
    adressStorage = "areaEdit";//本地存储名
    dispatch: any;//配送；
    install: any;//安装
    cooperationTime:any;//合作时间
    //返回的结果
    userWorkerInfoed: any = {};
    //用户信息
    user: any = {};

    typeOfservice: any = [];
    zPath: any = [];
    backPath: any = [];


    @Output() closeModalEdit = new EventEmitter<boolean>();
    @Output() preservation = new EventEmitter();
    /*接收父组件数据*/
    @Input() selections: any = {};

    //图片
    @Input() imaArr;


    masterManageEditRequestVo: MasterManageEditRequestVo;
    MasterManageServiceVo: MasterManageServiceVo;

    constructor(public api: API,
                public masterManageEditService: MasterManageEditService,
                public areaService: AreaService,
                public datePickerService: DatepickerService,
                public RequestTokenService: RequestTokenService,) {

    }

    ngOnInit(): any {
        this.RequestTokenService.createToken();
        this.masterManageEditRequestVo = new MasterManageEditRequestVo();//初始化;
        this.MasterManageServiceVo = new MasterManageServiceVo;
        this.RegularService = "民用家具";
        this.masterManageEditRequestVo.cooperationMethod = "";
        this.masterManageEditRequestVo.passport = "yes";
        this.masterManageEditRequestVo.ProductRange = "";
        this.masterManageEditRequestVo.paymentMethod = "";
        this.masterManageEditRequestVo.wageSettlement = "";
        this.masterManageEditRequestVo.invoice = "";
        //调用接口刷新数据
        this.checkUserWorker();
    }

    /**
     * 页面初始化方法
     */
    checkUserWorker(clear?:boolean) {
        if(clear){
            if(this.masterManageEditRequestVo.masterAccount.length === 11){
                let regBox = /^0?1[3|4|5|7|8][0-9]\d{8}$/;//手机
                if(!regBox.test(this.masterManageEditRequestVo.masterAccount)){
                    this.showSuccess("warn","提示","账号格式不正确");
                    return;
                }
                this.api.call("UserWorkerOperationeController.checkUserWorker", {
                    id: this.masterManageEditRequestVo.masterAccount
                }).ok(json => {
                    this.totlle(json.result);
                }) .fail(json => {
                    this.showSuccess("error", "提示", json.error);

                });
            }
        }else {
            if(this.master === "new"){
                return;
            }
            this.api.call("UserWorkerOperationeController.checkUserWorker", {
                id: this.selections[0].id
            }).ok(json => {
                this.totlle(json.result);
            }) .fail(json => {
                this.showSuccess("error", "提示", json.error);

            });
        }
    }

    /**
     * 修改与合作共用
     */
      totlle(obj){
        if (obj) {
            this.userWorkerInfoed = obj;

            this.imaArr = this.userWorkerInfoed.list || {};
            //师傅id;
            this.masterManageEditRequestVo.masterId = this.userWorkerInfoed.masterId;
            //师傅账号

            //师傅姓名
            let user = this.userWorkerInfoed.vEuser || {};

            this.masterManageEditRequestVo.masterName = user.realName;

            this.masterManageEditRequestVo.masterAccount = user.mobile;
            //开发票
            this.masterManageEditRequestVo.invoice = this.userWorkerInfoed.invoiceValue;
            //合作方式
            this.masterManageEditRequestVo.cooperationMethod = this.userWorkerInfoed.accountTypeValue;
            //组织信息

            let userWorkerCompany = this.userWorkerInfoed.vUserWorkerCompany || {};


            //最大接单量
            this.masterManageEditRequestVo.maxOrder = userWorkerCompany.maxOrder;
            //保证金阈值
            this.masterManageEditRequestVo.marginThreshold = userWorkerCompany.bond;
            //已缴纳保证金
            this.masterManageEditRequestVo.marginPaid = userWorkerCompany.payBond;
            //团队人数
            this.masterManageEditRequestVo.teamsNum = userWorkerCompany.teamAmount;


            //车辆数量
            this.masterManageEditRequestVo.carsNum = userWorkerCompany.carAamount;
            //车辆容积
            this.masterManageEditRequestVo.carVolume = userWorkerCompany.carVolume;
            //仓库容积(方)
            this.masterManageEditRequestVo.warehouseVolume = userWorkerCompany.carWeight;
            //仓库地址
            this.masterManageEditRequestVo.warehouseAddress = userWorkerCompany.warehouseAddress;

            //入行时间
            this.masterManageEditRequestVo.cooperationDate = this.userWorkerInfoed.cooperationDate;

            this.masterManageEditRequestVo.ProductRange = userWorkerCompany.businessScope;
            //合作单位
            this.masterManageEditRequestVo.cooperationUnit = userWorkerCompany.cooperationCompany;
            //结款方式
            this.masterManageEditRequestVo.paymentMethod = this.userWorkerInfoed.paymentTypeValue;

            //工资结算方式
            this.masterManageEditRequestVo.wageSettlement = userWorkerCompany.wagesPayType;


            //电商节最大处理订单数
            this.masterManageEditRequestVo.maxOrders = userWorkerCompany.activityAmount;
            //平均日订单量
            this.masterManageEditRequestVo.averageOrder = userWorkerCompany.dayAamount;
            //商品范围

            // 合作时间
            this.masterManageEditRequestVo.cooperationTime = userWorkerCompany.createDate;
            //智通订单占比cd
            this.masterManageEditRequestVo.orderProportion = userWorkerCompany.orderProportion;
            //账号信息
            //账号类型
            this.masterManageEditRequestVo.userAccount = this.userWorkerInfoed.receiptAccountType;

            //	姓名(支付宝）
            this.masterManageEditRequestVo.alipayName = this.userWorkerInfoed.accountName;
            //账号
            this.masterManageEditRequestVo.alipayAccount = this.userWorkerInfoed.bankAccount;
            //银行名称
            this.masterManageEditRequestVo.bankName = this.userWorkerInfoed.bankName;
            //支行名称
            this.masterManageEditRequestVo.subBranchName = this.userWorkerInfoed.subBranchName;
            //开户姓名
            this.masterManageEditRequestVo.accountName = this.userWorkerInfoed.accountName;
            //银行账号
            this.masterManageEditRequestVo.bankAccount = this.userWorkerInfoed.bankAccount;

            //通行证
            this.masterManageEditRequestVo.passport = this.userWorkerInfoed.passValue;


            //this.masterManageEditRequestVo.documentImg

            //返货true值
            this.ReturnCargo = this.userWorkerInfoed.returnCargo;
            //维修true值
            this.Maintenance = this.userWorkerInfoed.maintenance;
            if (this.Maintenance == true) {
                this.valueAddServiceIf = true;
            }
            //维修类型标签集合
            this.selectedCategoriesc = this.userWorkerInfoed.selectedCategoriesc || [];
            //常规服务
            this.masterManageService = this.userWorkerInfoed.vTypeOfServices || [];
            //区域信息
            this.adressObj = this.userWorkerInfoed.vAreas || [];
            //图片信息
            this.imaArr = this.userWorkerInfoed.list || [];
            this.cooperationTime = this.userWorkerInfoed.createDate;
        }
    }
    /*1-4位数字提示*/
    leftFour(value: string) {
        this.showSuccess("info", "提示", "请输入1-4位数字");
    }

    /*1-6位数字*/
    leftSix(value: string) {
        this.showSuccess("info", "提示", "请输入1-6位数字");
    }

    /*1-100字符*/
    leftHundred(value: string) {
        this.showSuccess("info", "提示", "输入在100字符及以内");
    }

    /*一智通占比*/
    order() {
        this.showSuccess("info", "提示", "限2位数字+标点符合.+2位小数");
    }

    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    /*一智通占比判断*/
    clear(obj) {

        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
        if (obj.value.indexOf(".") < 0 && parseInt(obj.value) > 99) {
            obj.value = obj.value.substring(0, 2);
        }
        this.masterManageEditRequestVo.orderProportion = obj.value;
    }

    /*常规服务*/
    /*添加常规服务*/
    addTypeOfService() {
        /*判断是否选中数据*/
        if (this.dispatch != true && this.install != true) {
            this.showSuccess("error", "提示", "安装”“配送”至少选择一项");
        } else {
            if (this.masterManageService.length > 0) {
                for (let i = 0; i < this.masterManageService.length; i++) {
                    if (this.masterManageService[i].googsName == this.RegularService) {
                        this.masterManageService[i].install = this.install;
                        this.masterManageService[i].dispatch = this.dispatch;
                        return;
                    }
                }
                this.masterManageService.push({
                    googsName: this.RegularService,
                    dispatch: this.dispatch,
                    install: this.install
                })
            } else {
                this.masterManageService.push({
                    googsName: this.RegularService,
                    dispatch: this.dispatch,
                    install: this.install
                });
            }

            this.dispatch = false;
            this.install = false;
        }
    }

    /*删除添加*/
    deleteTypeOfService(num: number) {
        for (let i = 0; i < this.masterManageService.length; i++) {
            if (this.masterManageService[i] == num) {
                this.masterManageService.splice(i, 1);
            }
        }

    }

    /*增值服务*/
    //返货
    cargo() {
        if (this.ReturnCargo == false) {
            // this.Maintenance = false;
            //判断维修和维修小项是否选中
            if (this.Maintenance == true && this.selectedCategoriesc.length !== 0) {
                this.masterManageEditRequestVo.valueAddService = "返货" + "，" + "维修" + "/" + this.selectedCategoriesc;
            } else {
                this.masterManageEditRequestVo.valueAddService = "返货";

            }

        }
    }

    //维修
    ten() {
        if (this.Maintenance == true) {
            this.valueAddServiceIf = true;
        } else {
            this.valueAddServiceIf = false;
            this.selectedCategoriesc = [];
        }
    }

    //维修小项
    selectedCate() {
        //判断维修小项是否选中
        //	debugger;
        if (this.selectedCategoriesc.length !== 0) {
            //判断返货是否选中
            if (this.ReturnCargo == true) {
                this.masterManageEditRequestVo.valueAddService = "返货" + "，" + "维修" + "/" + this.selectedCategoriesc;
            } else {
                this.masterManageEditRequestVo.valueAddService = "维修" + "/" + this.selectedCategoriesc;
            }

        }
        //console.log(this.masterManageEditRequestVo.valueAddService);
    }

    /*
     * 保存操作
     */


    addMarster: boolean = false; //
    loading:boolean;
    doSave(): any {
        this.loading = true;
        //获取本地储存
        if (sessionStorage.getItem("areaEdit") != null && sessionStorage.getItem("areaEdit") != undefined) {
            this.adressObj = JSON.parse(sessionStorage.getItem("areaEdit"));
        }
        console.log()
        if (this.masterManageEditRequestVo.maxOrder == undefined || this.masterManageEditRequestVo.maxOrder == "" || parseFloat(this.masterManageEditRequestVo.maxOrder)<=0) {
            this.showSuccess("warn", "提示", "最大接单量不能小于0");
            return;
        } else if (this.masterManageService.length == 0) {
            this.showSuccess("warn", "提示", "常规服务不能为空");
            return;
        } else if (this.adressObj.length == 0 || this.adressObj == undefined) {
            this.showSuccess("warn", "提示", "服务区域不能为空");
            return;
        }
        var objAll ={
            masterId: this.masterManageEditRequestVo.masterId,
            masterAccount: this.masterManageEditRequestVo.masterAccount,
            masterName: this.masterManageEditRequestVo.masterName,
            maxOrder: this.masterManageEditRequestVo.maxOrder,
            userAccount: this.masterManageEditRequestVo.userAccount,
            alipayAccount: this.masterManageEditRequestVo.alipayAccount,
            bankName: this.masterManageEditRequestVo.bankName,
            subBranchName: this.masterManageEditRequestVo.subBranchName,
            accountName: this.masterManageEditRequestVo.accountName,
            bankAccount: this.masterManageEditRequestVo.bankAccount,
            marginThreshold: this.masterManageEditRequestVo.marginThreshold,
            marginPaid: this.masterManageEditRequestVo.marginPaid,
            teamsNum: this.masterManageEditRequestVo.teamsNum,
            cooperationMethod: this.masterManageEditRequestVo.cooperationMethod,
            carsNum: this.masterManageEditRequestVo.carsNum,
            carVolume: this.masterManageEditRequestVo.carVolume,
            warehouseVolume: this.masterManageEditRequestVo.warehouseVolume,
            warehouseAddress: this.masterManageEditRequestVo.warehouseAddress,
            passport: this.masterManageEditRequestVo.passport,
            cooperationDate: this.masterManageEditRequestVo.cooperationDate,
            ProductRange: this.masterManageEditRequestVo.ProductRange,
            cooperationUnit: this.masterManageEditRequestVo.cooperationUnit,
            paymentMethod: this.masterManageEditRequestVo.paymentMethod,
            wageSettlement: this.masterManageEditRequestVo.wageSettlement,
            invoice: this.masterManageEditRequestVo.invoice,
            maxOrders: this.masterManageEditRequestVo.maxOrders,
            averageOrder: this.masterManageEditRequestVo.averageOrder,
            cooperationTime: this.masterManageEditRequestVo.cooperationTime,
            orderProportion: this.masterManageEditRequestVo.orderProportion,

            returnCargo: this.ReturnCargo,

            selectedCategoriesc: this.selectedCategoriesc,

            vTypeOfServices: this.masterManageService,
            vAreas: this.adressObj,
        };
        if(this.master === "edit"){
            this.api.call("UserWorkerOperationeController.updateUserWorkerDetailed",objAll).ok(json => {
                this.preservation.emit();//保存刷新
                this.loading = false;
            }) .fail(json => {
                this.loading = false;
                this.showSuccess("error", "提示", json.error);
            });

        }else {
            this.api.call("UserWorkerOperationeController.buildUpCoop",objAll).ok(json => {
                this.preservation.emit();//保存刷新
                this.loading = false;
            }) .fail(json => {
                this.showSuccess("error", "提示", json.error);
                this.loading = false;
            });
        }
    }

    /*取消操作*/
    close() {
        this.closeModalEdit.emit(false);
        this.masterManageEditRequestVo = new MasterManageEditRequestVo();
    }

    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    /*地图组件*/
    adressIf: boolean = false;
    /*控制动画*/
    isAdress: boolean = false;
    /*弹出动画*/
    displayAdress() {
        var that = this;
        this.adressIf = true;
        setTimeout(function () {
            that.isAdress = true;
        }, 0);
        /*获取sessionStorage数据*/
        if (sessionStorage.getItem("areaEdit") != null && sessionStorage.getItem("areaEdit") != undefined) {
            this.adressObj = JSON.parse(sessionStorage.getItem("areaEdit"));
        }

    }

    /*关闭动画*/
    closeAdress(isClose: boolean) {
        // //console.log('123');
        var that = this;
        this.isAdress = false;
        setTimeout(function () {
            that.adressIf = false;
        }, 200);
    }
    ngAfterViewInit(): void {
        this.initFancybox();
    }
    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }
}

export class FileUploadDemo {
    msgs: any[];

    uploadedFiles: any[] = [];

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});

    }
}
