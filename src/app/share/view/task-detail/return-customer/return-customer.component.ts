7/**
 * Created by Administrator on 2017/6/7 0008.
 */

import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
@Component({
    selector: 'return-customer',
    templateUrl: './return-customer.component.html',
    styleUrls: [
        './return-customer.component.css'
    ]
})
export class ReturnCustomerComponent implements OnInit{
    signMan:string;//签收人
    files:string[]=[];//上传文件
    @Output() onReturnCancle = new EventEmitter();//取消
    @Output() onReturnSure = new EventEmitter();//保存
    @Input() selectedRowData;//全部数据
    msgs:any;//公共提示
    constructor(public api: API,
                public RequestTokenService:RequestTokenService
    ){}
    ngOnInit(){
        this.RequestTokenService.createToken();
        console.log(this.selectedRowData);
    }

    //确认
    returnSure(){
        console.log(this.files);
        if(this.signMan == undefined || this.signMan == ""){
            this.showSuccess("warn","提示","签收人输入不能为空");
            return;
        }else if(this.files == undefined || this.files == [] || this.files.length == 0){
            this.showSuccess("warn","提示","签收图片不能为空");
            return;
        }
        this.onReturnSure.emit();//保存
    }

    //取消
    returnCancle(){
        this.onReturnCancle.emit();//取消
    }

    DeleteSymbol(){

    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
