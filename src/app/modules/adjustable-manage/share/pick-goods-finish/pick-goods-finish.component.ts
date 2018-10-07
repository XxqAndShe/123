import { Component, EventEmitter, Output, Input,OnInit } from '@angular/core';
import {ConfirmationService} from 'primeng/primeng';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'pick-goods-finish',
    templateUrl: './pick-goods-finish.component.html',
    styleUrls: [
        './pick-goods-finish.component.css'
    ]
})
export class PickGoodsFinishComponent implements OnInit{
    @Input() idField;
    @Input() wayBill;
    @Input() selectLineInfo;//所有的数据
    @Output() onPickGoodsFinish = new EventEmitter();
    @Output() cancelPickGoodsFinish = new EventEmitter();
    msgs:any;//提示
    loading:boolean;
    logisticsComName:string = '';
    logisticsNumber:string = '';
    logisticsCompTel:string = '';
    payableAmount:string = '';

    PlogisticsComName:string ='请填写物流公司名称';
    PlogisticsNumber:string='请填写物流单号';
    PlogisticsCompTel:string='请填写物流公司电话';
    PpayableAmount:string='请填写到付金额';

    files:any= [];

    constructor(public confirmationService: ConfirmationService,
                public api:API,
                public RequestTokenService:RequestTokenService){

    }
    ngOnInit(){
        this.RequestTokenService.createToken();
    }
    /*公用弹框*/
    alert(msg:string,title?:string,cb?:any){
        this.confirmationService.confirm({
            message: msg,
            header: title||'提示',
            accept: (e) => {
                if(cb){
                    cb(e);
                }
            },reject:()=>{

            }
        });
    }
    picUpImgs:any;
    //保存
    savePickGoodsFinish(){
        if(!!this.logisticsComName&&!!this.logisticsNumber&&!!this.logisticsCompTel&&!!this.payableAmount&&(this.files.length<=6&&this.files!=0)){
            if (this.files) {
                this.picUpImgs = "";
                for (let f of this.files) {
                    this.picUpImgs = this.picUpImgs + f + ",";
                }
            }
            this.loading = true;
            this.api.call("AftermarketTaskController.picUpGoodsEnd", {
                taskId: this.selectLineInfo[0].id,
                logisticsName: this.logisticsComName,
                logisticsBill: this.logisticsNumber,
                tel: this.logisticsCompTel,
                arrivePayMoney: this.payableAmount,
                picUpImgs: this.picUpImgs
            }).ok(json => {
                this.alert('确认返货完成成功','提示');
                this.onPickGoodsFinish.emit();
                this.loading = false;
            }).fail((err) => {
               this.loading = false;
                 this.cancelPickGoodsFinish.emit();
            });
        }else{
            if(!!this.logisticsComName&&!!this.logisticsNumber&&!!this.logisticsCompTel&&!!this.payableAmount){
                if(this.files==0){
                    this.showSuccess("warn","提示","照片至少上传一张！")
                }else if(this.files.length > 6){
                    this.showSuccess("warn","提示","照片最多上传6张！")
                }
            }else {
                this.showSuccess("warn","提示","*为必填项，不能为空！")
            }
        }
    }
    pickGoodsFinishCancel(){
        this.cancelPickGoodsFinish.emit();
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}



