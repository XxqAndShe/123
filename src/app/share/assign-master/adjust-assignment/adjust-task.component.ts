import {Component, EventEmitter, Output, OnInit, Input, Pipe,ViewChild} from '@angular/core';
import {AreaService} from '../../app-service/area.service';
import {API} from "../../lib/api/api";
import {ConfirmationService} from 'primeng/primeng';


@Component({
    selector: 'adjust-assign',
    templateUrl: './adjust-task.component.html',
    styleUrls: ['./adjust-task.component.css']
})
@Pipe({name: 'master'})
export class AdjustTaskComponent implements OnInit{

    @Output() closeAssignMaster = new EventEmitter<any>();
    @Output() onAssignment = new EventEmitter<any>();
    @Input() wayBill; //输入的运单号
    @Input() selectLineInfo;
    @Input() taskId: any;
    pointAdress: string;//详细地址

    itemsIf: boolean = false;//此区域没有师傅提示
    assignMasterIf: boolean = false;//分配师傅列表
    branch: number;
    goodsDetails:any={};
    goodsDetailsCount: any = {};
    install: number;//安装费
    mediateFee:number;//调解费用
    nearbyMaster: string;//双向绑定数据
    area: string;//地址组件数据
    listIf: boolean = false;//搜索返回数据下拉框，需要根据数据判断false和true;
    listMaster: any = [];//搜索下拉框数据
    seveList: any = [];//搜索返回师傅数据
    msgs: any;//公用弹窗
    value: any;//地址默认
    width:any = "230px";
    waybill:any[]=[];//用于后端请求
    allocation:any[]=[];//分配传后端
    loading:boolean;
    page: number = 0;//页数，默认第一页
    pageNumber: string;//跳转页码
    totalPages: number;//总页数
    masterName:any[]=[];//本地存储
    goodsOver:any[]=[];
    hostory:boolean = false;
    hostoryMaster:any[]=[];
    isPShow:boolean = true;
    destination:string;
    whatPages:boolean;
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
    constructor(public api: API,
                public areaService: AreaService,
                public confirmationService: ConfirmationService) {
    }
    ngOnInit() {
        this.pointAdress = this.selectLineInfo[0].receiveAddress;
        //生成表格数据
        this.dataFee();
        //自动生成师傅列表
        this.query(true,true);
        if(localStorage.getItem("masterName")){
            this.hostory = true;
            this.hostoryMaster = JSON.parse(localStorage.getItem("masterName"));

        }
    }
    /*
     * 管道限制*/
    transform(value1: any, value2: any) {
        return parseFloat(value1) + parseFloat(value2)
    }

    close() {
        this.closeAssignMaster.emit();
    }

    num: number;

    data1: any[] = [];
    /*取消确认弹窗*/
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



    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    /**
     * 查询师傅
     */
    query(event?:boolean,who?:boolean) {
        this.whatPages = who;
        if(event){
           this.destination =  this.selectLineInfo[0].areaCode;
        }else {
          this.destination = this.area;
        }
        this.loading = true;
        //去除首尾空壳
        if(this.nearbyMaster != undefined && this.nearbyMaster != ""){
            this.nearbyMaster = this.nearbyMaster.trim();
        }
        this.api.call('taskInstallController.queryUserJzt',this.pages,{
            areaCode: this.destination,
            id: this.nearbyMaster
        }).ok(data => {
            this.loading = false;
            this.seveList = data.result.content;
            this.listMaster = data.result.content;
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
    distribution(e: any) {
       //localStorage
        if(localStorage.getItem('masterName')){
            let storage = JSON.parse(localStorage.getItem('masterName'));
            for(let i = 0;i<storage.length;i++) {
                if (e.id === storage[i]['id']) {
                    storage.splice(i, 1);
                }
            }
            storage.unshift(e);
            if(storage.length>10){
                storage.splice(9,storage.length-1);
            }
            this.masterName = storage;
        }else {
            this.masterName.unshift(e);
        }
        let content = JSON.stringify(this.masterName);
        localStorage .setItem("masterName",content);
        this.allocation = [];//清空；
        for(let i = 0;i<this.data1.length;i++){
            this.allocation.push({
                dis: true,
                taskId: this.data1[i].id,
                workerId: e.id,
                branchFee: this.data1[i].branchFee,
                installFee: this.data1[i].installFee,
                mediateFee:parseFloat(this.data1[i].mediateFee)
            });
            console.log(this.data1[i].mediateFee);
            console.log(typeof this.data1[i].mediateFee);
        }
        let that = this;
        if (e.order > e.maxOrder) {
            this.alert("师傅接单已经饱和，是否确认分配？", "提示",
                function () {
                    that.api.call('taskInstallController.batDisWorker',{
                        disWorkerReqs:that.allocation
                    }).ok(data => {
                        // 分配师傅成功刷新页面
                        that.onAssignment.emit();
                    }).fail(data => {
                        that.showSuccess("error", "提示", "分配失败！" + data.error);
                    })
                }
                , function () {
                    /*取消*/
                })
        } else {
            this.api.call('taskInstallController.batDisWorker',{
                disWorkerReqs:that.allocation
            }).ok(data => {
                // 分配师傅成功刷新页面
                this.onAssignment.emit();
                // this.task.changeNodeType("waitDistribution");
            }).fail(data => {

                this.showSuccess("error", "提示", "分配失败" + ":" + data.error);
            });
        }
    }
    /**
     * 生成费用
     */
    dataFee(){
        for(let i = 0;i<this.selectLineInfo.length;i++){

                this.api.call('taskInstallController.findTaskFee', {
                    waybillId: this.selectLineInfo[i].waybillId
                }).ok(data => {
                    this.install = parseFloat(this.selectLineInfo[i].installFee);
                    this.branch = parseFloat(this.selectLineInfo[i].branchFee);
                    this.mediateFee = parseFloat(data.result.mediateFee);
                    if (this.selectLineInfo) {
                        this.pointAdress = this.selectLineInfo[0].receiveAddress;
                        //头部列表的显示
                            this.data1.push(
                                {
                                    waybill: this.selectLineInfo[i].waybillId,
                                    serviceType: this.selectLineInfo[i].serviceType,
                                    waybillGoodsCopy: this.selectLineInfo[i].goods,
                                    branchFee: Number(this.selectLineInfo[i].branchFee),
                                    installFee: Number(this.selectLineInfo[i].installFee),
                                    //最低安装费
                                    minInstallFee: Number(data.result.installFee),
                                    receiveAddress: this.selectLineInfo[i].receiveAddress,
                                    id:this.selectLineInfo[i].id,
                                    mediateFee:Number(data.result.mediateFee),
                                    totleFee:this.addNum(this.branch,this.install,this.mediateFee),//总费用

                                }
                            )
                    }
                }).fail(data => {
                });
        }
    }


    goodsShow: any = [];
    /*
     * 维修费限制*/
    clear(obj,i,name) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
        this.data1[i][name]=obj.value;
    }

    /*
     * 清空*/
    empty() {
        this.nearbyMaster = null;
    }

    //解决浮点bug函数
        addNum (num1:number, num2:number,num3:number) {
        console.log( typeof num3);
        console.log(num3);
            let sq1,sq2,sq3,m;
            try {
                sq1 = num1.toString().split(".")[1].length;
            }
            catch (e) {
                sq1 = 0;
            }
            try {
                sq2 = num2.toString().split(".")[1].length;
            }
            catch (e) {
                sq2 = 0;
            }
            try {
                sq3 = num2.toString().split(".")[1].length;
            }
            catch (e) {
                sq3 = 0;
            }
            m = Math.pow(10,Math.max(sq1, sq2,sq3));
            return (num1 * m + num2 * m+num3 * m) / m;
    }
    /*字符串转数字*/
    numbranch(obj,i,name) {
        this.clear(obj,i,name);
        this.branch = parseFloat(obj.value);
        this.data1[i].totleFee = this.addNum(this.branch,this.install,this.mediateFee);
    }

    numinstall(obj,i,name) {
        this.clear(obj,i,name);
        this.install = parseFloat(obj.value);
        this.data1[i].totleFee = this.addNum(this.branch,this.install,this.mediateFee);
    }
    nummediate(obj,i,name){
        this.clear(obj,i,name);
        this.mediateFee = parseFloat(obj.value);
        this.data1[i].totleFee = this.addNum(this.branch,this.install,this.mediateFee);
    }
    /*搜索下拉框*/
    assign(obj: any) {
        this.nearbyMaster = obj.id;//点击后让搜索框内的值等于被点击值
    }

    dataHandler: Function = this.areaService.selectBoxHandler();
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
        }
        if(this.whatPages){
            this.query(true,true);
        }else {
            this.query(false,false);
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
            this.query(true,true);
        }else {
            this.query(false,false);
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
            };
            if(this.whatPages){
                this.query(true,true);
            }else {
                this.query(false,false);
            }
        }
    }

    /**
     * 商品明细
     */
    allGoods($event,i,op2){
        console.log(i);
        op2.toggle($event);
        this.goodsDetails.taskID = i.id;
        this.goodsDetails.waybillId = i.waybill;
        console.log(i.waybillId);
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

