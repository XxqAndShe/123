import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {API} from "../../../lib/api/api";
import {overlayPanelShow,overlayPanelHide} from "../../../../share/utils/gridUtil";

@Component({
    selector: 'detail-msg',
    templateUrl: './detail-msg.component.html',
    styleUrls: [
        './detail-msg.component.css'
    ]
})
export class DetailMsgComponent implements OnInit,AfterViewInit {
    //选中行数据
    @Input() selectLineInfo;
    showaAress:string;//悬浮框数据
    //isUpstair: boolean = true;  //是否需要搬楼
    isElevator: boolean = false;  //是否有电梯

    dataContent: any;//数据主体
    totalPackingItem: number=0;//合计包装件数
    totalInstallItem: number=0;//合计安装数量
    totalVolume: number=0;//合计体积
    totalWeight: number=0;//合计重量
    totalInstallCharge: number=0;//合计安装费
    totalDeliveryCharge: number=0;//合计送货费
    totalTranSportCharge: number=0;//合计运费
    totalProtectionCharge: number=0;//合计保价费
    totalValueCharge: number=0;//合计声明价值

    constructor(public api: API) {

    }

    columns: any = []; // 详情信息里面的表格
    initColumns(): void {
        this.columns.push({
            field: "goods",
            header: '商品名称',
            sortable: true
        });

        this.columns.push({
            field: "goodsServiceType",
            header: '服务类型',
            sortable: true
        });

        this.columns.push({
            field: "packingItems",
            header: '包装件数',
            sortable: true
        });

        this.columns.push({
            field: "installItems",
            header: '安装数量',
            sortable: true
        });

        this.columns.push({
            field: "volumes",
            header: '体积',
            sortable: true
        });

        this.columns.push({
            field: "weight",
            header: '重量',
            sortable: true
        });

        this.columns.push({
            field: "packing",
            header: '包装',
            sortable: true
        });

        this.columns.push({
            field: "installCharge",
            header: '安装费',
            sortable: true
        });

        this.columns.push({
            field: "deliveryCharge",
            header: '送货费',
            sortable: true
        });

        this.columns.push({
            field: "tranSportCharge",
            header: '运费',
            sortable: true
        });

        this.columns.push({
            field: "protectioncharge",
            header: '保价费',
            sortable: true
        });

        this.columns.push({
            field: "valueCharge",
            header: '声明价值',
            sortable: true
        })
    }
    ngOnInit() {
        this.initColumns();
        //生成数据
        this.selWaybillDetail();
        this.selfindWaybillGoods();
    }
    ngAfterViewInit():void{
        this.initFancybox();
    }
    dataWaybillDetail: any = {};
    /**
     * 取运单详情信息
     */
    selWaybillDetail() {
        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let taskId=selectRow['id'];

        let waybillId=selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        if(!taskId){
            throw new Error('taskId 不能为空');
        }

        if(!waybillId){
            throw new Error('waybillId 不能为空');
        }

        let qryParams={
            "taskID":taskId,
            "waybillId":waybillId
        }

        this.api.call("TaskDetailContorller.findWaybillDetail",qryParams).ok(json => {
            let result = json.result || {};
            console.info(result)
            this.dataWaybillDetail = result;
            this.imgUrls=json.result.siImg;
            console.info(this.imgUrls)
        });
    }

    //明细
    dataTaskWaybillGoods: any;
    /**
     * 取运单对应货物明细
     */
    selfindWaybillGoods() {
        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let taskId=selectRow['id'];

        let waybillId=selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        if(!taskId){
            throw new Error('taskId 不能为空');
        }

        if(!waybillId){
            throw new Error('waybillId 不能为空');
        }

        let qryParams={
            "taskID":taskId,
            "waybillId":waybillId
        }
        this.api.call("TaskDetailContorller.findWaybillGoods",
            {first: 0, rows: 10},qryParams).ok(json => {
            this.dataTaskWaybillGoods = json.result;
            /**
             * 初始化表格数据，获取到相对应的值并求和，计算合计
             * params dataContent 数据主体
             */
            this.dataContent = json.result.content;
            for(let i=0; i<this.dataContent.length; i++){
                this.totalPackingItem+=this.dataContent[i].packingItems;
                this.totalInstallItem+=this.dataContent[i].installItems;
                this.totalVolume+=this.dataContent[i].volumes;
                this.totalWeight+=this.dataContent[i].weight;
                this.totalInstallCharge+=this.dataContent[i].installCharge;
                this.totalDeliveryCharge+=this.dataContent[i].deliveryCharge;
                this.totalTranSportCharge+=this.dataContent[i].tranSportCharge;
                this.totalProtectionCharge+=this.dataContent[i].protectioncharge;
                this.totalValueCharge+=this.dataContent[i].valueCharge;
            }
        });
    }

    /**
     * 图片url数组
     * @type {[string,string]}
     */
    imgUrls=[];
    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling':'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }

    /**
     * 发货人公司
     * @param event
     * @param num
     */
    sendName(event,op){
        op.toggle(event);
        this.showaAress = this.dataWaybillDetail.sendName;
    }

    /**
     * 发货人地址
     */
    sendAddres(event,op){
        op.toggle(event);
        this.showaAress = this.dataWaybillDetail.sendAddres;

    }

    /**
     * 收货人公司
     */
    receiveName(event,op){
        op.toggle(event);
        this.showaAress = this.dataWaybillDetail.receiveName;
    }

    /**
     * 收货人地址
     */
    receiveAddres(event,op){
        op.toggle(event);
        this.showaAress = this.dataWaybillDetail.receiveAddres;
    }
}
