import {Component, EventEmitter, Output, OnInit, Input} from "@angular/core";
import {API} from "../../../share/lib/api/api";
import {AreaService} from "../../../share/app-service/area.service";
import {ShowOrHideMaskService} from "../../../share/app-service/show-or-hide-mask.service";

@Component({
    selector: 'repair-assign',
    templateUrl: './re-assignment.html',
    styleUrls: ['./re-assignment.css']
})

export class RepairSchedulingComponent implements OnInit {
    alert: any;

    constructor(public api: API, public areaService: AreaService, public mask: ShowOrHideMaskService) {
    }

    @Output() closeAssignMaster = new EventEmitter<any>();//取消
    @Output() onSaveMaster = new EventEmitter<any>(); //保存、分配
    @Input() wayBill; //输入的运单号
    @Input() isRepair;
    @Input() isReturn;
    loading:any;

    @Input() selectedRowData: any[] = [];

    showaGoods:string;//弹窗提示
    fee: any[]=[]; //维修或者返货费用
    itemsIf: boolean = false;//区域有无区域提示；
    masterName:any[]=[];//本地存储
    hostoryMaster:any[]=[];
    page: number = 0;//页数，默认第一页
    pageNumber: string;//跳转页码
    totalPages: number;//总页数
    assignMasterIf:boolean;
    whatPages:boolean;
    hostory:boolean;
    allocation:any[];
    goodsDetails:any={};
    goodsDetailsCount: any = {};
    goodsOver:any[]=[];
    isPShow:boolean = true;
    pages = {
        first: this.page,
        rows: 5
    };
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
    close() {
        this.closeAssignMaster.emit(false);
    }

    num: number;

    msgs: any;//公共弹窗

    transitionData: any[]=[];

    width:any = "230px";//地址组件的宽度
    ngOnInit() {
        if(localStorage.getItem("masterName")){
            this.hostory = true;
            this.hostoryMaster = JSON.parse(localStorage.getItem("masterName"));

        }
        for(let i = 0;i<this.selectedRowData.length;i++){
            this.fee[i]= "0";
            let transfer = this.selectedRowData[0] && this.selectedRowData[0] || (this.selectedRowData || {});
            this.api.call('AftermarketTaskController.queryTaskHeaderInfo', {
                id: this.selectedRowData[i].id
            }).ok(data => {
                let content = data.result || "";
                this.transitionData.push(
                    {
                        waybill: content['taskTitle'],
                        taskRepairDetailsName: this.selectedRowData[i].goods,
                        taskRepairDetailsNameTop1: content['goods'],
                        vArea: content['consigneeAddr'], //返修收货地址
                        returnGoodsVolumn: content['totalVolumes'],
                        getGoodsArea: content['pickUpAddr'],  //返货提货地址
                        taskRemark: content['remark'],
                        fee:content['fee'] || 0,
                        goods:content['goods'] || '',
                        id:this.selectedRowData[i].id,
                        waybillId:this.selectedRowData[i].waybillId
                    }
                );
            }).fail(err => {
                this.transitionData = [];
                this.showSuccess("error", "提示", err.error);
            });
        }
        let id = this.selectedRowData[0] && this.selectedRowData[0]['id'] || this.selectedRowData['id'];
        if (!id) {
            throw new Error('id is not null');
        }
        //自动加载师傅
        this.getUserWorker(true,true);
    }

    /**
     * 师傅列表
     */
    userWorkerList: any = [];

    /*分配成功提示*/
    okIf: boolean = false;

    operation() {
        this.okIf = false;
        this.mask.hide();
    }

    /*input搜索框*/
    mobileOrRealName: string;//双向绑定数据
    area: string;
    addressArea:string;
    listShow: boolean = false;//搜索返回数据下拉框，需要根据数据判断false和true;
    /*按键按下函数*/
    return(value: string) {
    }

    /**
     * 查询师傅
     */
    getUserWorker(e?:boolean,event?:boolean) {
        this.whatPages = event;
        //第一次自动加载需areaCode;
        if(e){
            this.addressArea = this.selectedRowData[0].areaCode;
        }else {
            this.addressArea = this.area;
        }
        this.loading = true;
        //去除首尾空格
        if(this.mobileOrRealName != undefined && this.mobileOrRealName != ""){
            this.mobileOrRealName = this.mobileOrRealName.trim();
        }
        this.api.call('AftermarketTaskController.getEUserworker',this.pages, {
            areaCode: this.addressArea,
            mobile: this.mobileOrRealName,
            realName: this.mobileOrRealName
        }).ok(data => {
            this.loading = false;
            this.userWorkerList = data.result.content;
            this.totalPages = data.result.totalPages;//总页数
            if(data.result.content.length >0){
                this.itemsIf = false;
                this.assignMasterIf = true;
            }else {
                this.itemsIf = true;
                this.assignMasterIf = false;
            }
        }).fail(data => {
            this.loading = false;
        });
    }

    /**
     * 分配师傅
     * @param i
     */
    distributionWorker(userWorkerId) {
        console.log(userWorkerId);
        //localStorage
        if(localStorage.getItem('masterName')){
            let storage = JSON.parse(localStorage.getItem('masterName'));
            for(let i = 0;i<storage.length;i++) {
                if (userWorkerId.id === storage[i]['id']) {
                    storage.splice(i, 1);
                }
            }
            storage.unshift(userWorkerId);
            if(storage.length>10){
                storage.splice(9,storage.length-1);
            }
            this.masterName = storage;
        }else {
            this.masterName.unshift(userWorkerId);
        }
        let content = JSON.stringify(this.masterName);
        localStorage .setItem("masterName",content);
        this.allocation = [];//防止多次点击累加
        for(let i = 0;i<this.transitionData.length;i++){
            let taskFeeType: string;
            if (!this.transitionData[i].fee) {
                this.isRepair ? this.showSuccess("warn", "提示", "请输入维修费用") : this.showSuccess("warn", "提示", "请输入返货费用");
                return;
            } else {
                taskFeeType = this.isRepair ? "repair" : "back";
            }
        }
        let id = this.selectedRowData[0] && this.selectedRowData[0]['id'] || this.selectedRowData['id'];
        if (!id) {
            throw new Error('id is not null')
        }

        let taskFeeType = this.isRepair ? "repair" : "back";
        for(let i = 0;i<this.selectedRowData.length;i++){
            this.allocation.push({
                taskId: this.selectedRowData[i].id,
                userWorkerId: userWorkerId.id,
                distributionFee: this.transitionData[i].fee,
                taskFeeType: taskFeeType
            })
        }
            this.api.call('AftermarketTaskController.distributionBatWorker', {
                taskOperateStatuses:this.allocation
            }).ok(data => {
                this.onSaveMaster.emit();
            }).fail(data => {

                this.showSuccess("error", "提示", data.error);
            });

    }
    /**
     * 运单号
     */
    //进入
    waybillCell(event,num,op){
        op.toggle(event);
        console.log(num);
        this.showaGoods = this.transitionData[num].waybill;
    }
    //离开
    waybillLeave(op){
        op.hide();
    }
    /*
     * 维修费限制*/
    clear(obj) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
        this.fee = obj.value;
    }

    /*
     * 清空*/
    empty() {
        this.mobileOrRealName = null;
    }

    /*搜索下拉框*/
    assign(obj: any) {
        this.mobileOrRealName = obj.name;//点击后让搜索框内的值等于被点击值
    }

    dataHandler: Function = this.areaService.selectBoxHandler();
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
    /**
     * 上一页
     */
    rpbtn() {
        if (this.page <= 0) {
            return;
        }
        this.page = this.page - 5;
        this.pages = {
            first: this.page,
            rows: 5
        };
        if(this.whatPages){
            this.getUserWorker(true,true);
        }else {
            this.getUserWorker(false,false);
        }

    }

    /**
     * 下一页
     */
    npbtn() {
        if (this.page >= this.totalPages * 5 - 5) {
            return;
        }
        this.page += 5;
        this.pages = {
            first: this.page,
            rows: 5
        }
        if(this.whatPages){
            this.getUserWorker(true,true);
        }else {
            this.getUserWorker(false,false);
        }
    }

    /**
     * 跳转
     */
    showPages(event) {
        let e = event || window.event;
        if (e && e.keyCode === 13) {
            this.page = parseFloat(this.pageNumber) * 5 - 5;
            if (this.page < 0) {
                this.page = 0;
            } else if (this.page >= this.totalPages * 5 - 5) {
                this.page = this.totalPages * 5 - 5;
            }
            this.pages = {
                first: this.page,
                rows: 5
            }
            if(this.whatPages){
                this.getUserWorker(true,true);
            }else {
                this.getUserWorker(false,false);
            }
        }
    }
    /**
     * 商品明细
     */
    allGoods($event,i,op2){
        op2.toggle($event);
        this.goodsDetails.taskID = i.id;
        this.goodsDetails.waybillId = i.waybillId;
        this.api.call("taskDetailContorller.findWaybillGoods", {first: 0, rows: 10}, this.goodsDetails)
            .ok(returnInfo => {
                this.goodsOver = returnInfo.result.content;
                this.goodsDetailsCount = this.getProductInfo(this.goodsOver);
            })
            .fail(data => {
                this.showSuccess("error", "提示", "查询失败！")
            });
    }
    pOver(e){
        this.isPShow = e;
    }
    pLeave(e,op2){
        this.isPShow = e;
        this.cancalAll(op2);
    }
    /**
     * 隐藏
     */
    cancalAll(op2){
        if (this.isPShow){
            op2.hide();
        }
    }
}

