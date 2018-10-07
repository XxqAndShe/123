import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {ConfirmationService} from 'primeng/primeng';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector: 'pick-goods-finish-return',
    templateUrl: './pick-goods-finish.component.html',
    styleUrls: [
        './pick-goods-finish.component.css'
    ]
})
export class PickGoodsFinishComponent implements OnInit{
    @Input() idField;
    @Input() wayBill;
    @Input() content: any;//所选行数据
    @Output() onPickGoodsFinish = new EventEmitter();
    @Output() goodsFinish = new EventEmitter();

    imgfiles:any=[];

    constructor(public api: API,
                public confirmationService: ConfirmationService,
                public requestTokenService: RequestTokenService
    ) {}

    logisticsComName: string = '';
    logisticsNumber: string = '';
    logisticsCompTel: string = '';
    payableAmount: string = '';
    picUpImgs: string = '/safs/safs.jpg,/sdlf234.jpg'; //图片，多个用英文逗号隔开 TODO 暂时写死

    PlogisticsComName: string = '请填写物流公司名称';
    PlogisticsNumber: string = '请填写物流单号';
    PlogisticsCompTel: string = '请填写物流公司电话';
    PpayableAmount: string = '请填写到付金额';
    msgs:any;//提示
    ngOnInit(){
        this.requestTokenService.createToken();
    }

    /*公用弹框*/
    alert(msg: string, title?: string, cb?: any) {
        this.confirmationService.confirm({
            message: msg,
            header: title || '提示',
            accept: (e) => {
                if (cb) {
                    cb(e);
                }
            }, reject: () => {

            }
        });
    }

    //保存
    savePickGoodsFinish() {
        if (this.imgfiles) {
            ////console.log(this.imgfiles);
            this.picUpImgs = "";
            for (let f of this.imgfiles) {
                ////console.log(f);
                this.picUpImgs = this.picUpImgs + f + ",";
            }
        }
        if (this.logisticsComName !="" && this.logisticsComName !=undefined && this.logisticsNumber !="" && this.logisticsNumber != undefined
            && this.logisticsCompTel !="" && this.logisticsCompTel !=undefined && this.payableAmount !="" && this.payableAmount !=undefined) {
            this.api.call("AftermarketTaskController.picUpGoodsEnd", {
                taskId: this.content.id,
                logisticsName: this.logisticsComName,
                logisticsBill: this.logisticsNumber,
                tel: this.logisticsCompTel,
                arrivePayMoney: this.payableAmount,
                picUpImgs: this.picUpImgs
            }).ok(json => {
                this.goodsFinish.emit();
            }).fail((err) => {
                this.showSuccess("error","提示",err.error)
            });
        } else {
          this.showSuccess("warn","提示","*为必填项，不能为空！");
        }
    }

    //取消
    cancelPickGoodsFinish() {
        this.onPickGoodsFinish.emit();
    }
    //公共提示
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
}