/**
 * Created by wq on 2017/3/29.
 */
import {Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
import {AreaService} from '../../../../share/app-service/area.service';
import {error} from "selenium-webdriver";
@Component({
    selector: 'manage-ChangeInformation',
    templateUrl: './change-information.component.html',
    styleUrls: [
        './change-information.component.css'
    ]
})
export class changeInformationComponent implements OnInit{
    pickUpTel:string;//提货人电话
    pickUpAddress:string;//提货地址
    pickUpCode:string;//提货验证码
    @Output() onChangeCancle = new EventEmitter();
    @Output() onChangeSure = new EventEmitter();
    @Output() onSearch = new EventEmitter();
    @Input() wayBill;//运单号
    @Input() selectLineInfo;//所有的数据
    @Input() taskId: any;
    msgs:any;//公共提示
    loading:boolean;
    // todo 新增三个字段
    logistics:string;//物流单号
    areaCode:any;//提货区域
    // 地址组件
    dataHandler: Function = this.areaService.selectBoxHandler();
    constructor(public api: API,
                public RequestTokenService:RequestTokenService,
                public areaService: AreaService,
                private changeDetectorRef: ChangeDetectorRef,
    ){}

    ngOnInit(){
        this.api.call('taskInstallController.findPickUp',{
            taskId:this.taskId,
        }).ok(data=>{
            this.logistics = data.result.logisticsBill;
            this.pickUpCode = data.result.pickUpCode;
            this.pickUpTel = data.result.pickUpTel;
            this.areaCode = data.result.addrCode;
            this.pickUpAddress = data.result.pickUpAddress;
        }).fail(error=>{

        })
        this.RequestTokenService.createToken();
    }
    /*判断提货人电话*/
    itemTelephone:string = '请输入提货人电话';
    /*判断地址*/
    itemAddress:string = '请输入物流单号';
    address(value:string){
        if(value.length>0&&value.length<=50){
        }else {
            this.showSuccess("warn","提示","提货人地址不能为空");
        }
    }
    /*判断提货验证码*/
    itemsVerificationCode:string = "请输入提货验证码";
    VerificationCode:boolean = false;
    verificationCode(value:string){
        if(value.length>0&&value.length<=40){
            this.VerificationCode = true;
        }else {
            this.VerificationCode = false;
            this.showSuccess("warn","提示","提货验证码不能为空");
        }
    }

    //确认
    changeSure($event){
        this.changeDetectorRef.detectChanges();
        if(!this.logistics){
            this.showSuccess("warn","提示","物流单号不能为空");
            return;
        }
        if(this.pickUpCode == undefined || this.pickUpCode ==""){
            this.showSuccess("warn","提示","提货验证码不能为空");
            return;
        }
        if(!this.pickUpTel){
            this.showSuccess("warn","提示","提货电话不能为空");
            return;
        }
        if(!this.areaCode){
            this.showSuccess("warn","提示","提货区域不能为空");
            return;
        }
        if(!this.pickUpAddress){
            this.showSuccess("warn","提示","详细地址不能为空");
            return;
        }
            this.loading = true;
            this.api.call('taskInstallController.modifyPickUpInfo',{
                taskId:this.taskId,
                pickUpTel:this.pickUpTel,
                pickUpCode:this.pickUpCode,
                pickUpAddress:this.pickUpAddress,
                addrCode:this.areaCode,
                logisticsBill:this.logistics,
                abnoSource:"ips"
            }).ok(data=>{
                this.onChangeSure.emit();
                this.loading = false;
            }).fail(data=>{
                this.showSuccess("error","提示",data.error);
                this.loading = false;
            });
    }

    //取消
    changeCancle(){
        this.onChangeCancle.emit();
        this.pickUpTel = null;
        this.pickUpAddress = null;
        this.pickUpCode=null;
    }

    DeleteSymbol(){
        this.onChangeCancle.emit();
        this.pickUpTel = null;
        this.pickUpAddress = null;
        this.pickUpCode=null;
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
