
import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'arrival-goods',
    templateUrl: './arrival-goods.component.html',
    styleUrls: [
        './arrival-goods.component.css'
    ]
})
export class ArrivalGoodsComponent implements OnInit{
    arrivalTell:string;//到货电话
    arrivalAddress:string;//地址
    logisticsCompany:string;//物流公司
    arrialItem:string;//备注
    @Output() onArrivalCancle = new EventEmitter();
    @Output() onArrivalSure = new EventEmitter();
    @Input() selectedRowData;//所有的数据
    msgs:any;//公共提示
    constructor(public api: API,
                public RequestTokenService:RequestTokenService
    ){}
    ngOnInit(){
        this.RequestTokenService.createToken();
        console.log(this.selectedRowData);
    }

    //确认 TODO 确认保存，原型不需要判断
    changeSure(){
       this.onArrivalSure.emit();//保存
    }

    //取消
    changeCancle(){
       this.onArrivalCancle.emit();//取消
    }

    DeleteSymbol(){

    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
