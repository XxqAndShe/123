import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import {DragBoxService} from "../../../../../../share/app-service/drag-box.service";
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService} from "../../../../../../../../node_modules/primeng/components/common/api";

@Component({
    selector: 'add-or-edit',
    templateUrl: './add-or-edit.component.html',
    styleUrls: [
        './add-or-edit.component.css'
    ]
})

export class AddOrEditPriceComponent implements OnInit {
    @Output() hideWin = new EventEmitter();
    @Input() selectedRow;
    @Input() flag;//父组件传入的标识，值为addPrice和editPrice表示支线采购价，addStan和editStan表示支线标准采购价
    area: any;
    stanPrice: any;
    data:any;
    msgs:any;
    @Input() masterId;
    price;
    id;
    branchPriceId;
    standaardbranchPrice;
    @Output() finishOperation = new EventEmitter();
    @Output() updateFather = new EventEmitter();

    constructor(
        public drag: DragBoxService,
        public api: API,
        public confirmationService:ConfirmationService
    ) {}
    ngOnInit() {
        if(this.flag === 'editPrice'){
            if(this.selectedRow){
                this.area=this.selectedRow.area.code;
                this.branchPriceId=this.selectedRow.id;
                this.price=this.selectedRow.agreementPrice;
                this.getBranchPrice();
            }
        }

        if(this.flag === 'editStan'){
            if(this.selectedRow){
                this.area=this.selectedRow.areaCode;
                this.stanPrice=this.selectedRow.standardPurchasePrice;
            }
        }
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    close() {
        this.hideWin.emit(false);
    }
    save() {
        if(!this.area){
            this.showSuccess("warn","提示","请输入省市区！");
            return;
        }
        let regExp1 = /^[\d]{4}0/;
        let regExp2 = /^[\d]{5}0/;
        if(regExp1.test(this.area)){
            if(regExp2.test(this.area)){
                this.showSuccess("warn","提示","省市区需精确到区县！");
                return;
            }
        }
        //支线采购价
        if(this.flag === 'addPrice'){
            if(!this.price){
                this.showSuccess("warn","提示","请输入协议价！");
                return;
            }
            this.api.call("goodsBranchPriceController.queryIfBranchPrice",{
                userWorker:{id:this.masterId},
                area:{code:this.area}
            }).ok(json=>{
                this.sendSaveRequest();
            }).fail(json=>{
                this.hideWin.emit(false);
                this.updateFather.emit([this.area,this.price,"add"]);
            });
        }else if( this.flag === 'editPrice'){
            if(!this.price){
                this.showSuccess("warn","提示","请输入协议价！");
                return;
            }
            this.api.call("goodsBranchPriceController.queryIfBranchPrice",{
                userWorker:{id:this.masterId},
                area:{code:this.area},
                id:this.branchPriceId
            }).ok(json=>{
                this.sendUpdateRequest();
            }).fail(json=>{
                this.hideWin.emit(false);
                this.updateFather.emit([this.area,this.price,"edit"]);
            });


        }
        //支线标准采购价
        if(this.flag === 'addStan'){
            if(!this.stanPrice){
                this.showSuccess("warn","提示","请输入采购标准价！");
                return;
            }
            console.log("----------");
            this.api.call("BranchStandardPriceController.queryIfBranchStandardPurchasePrice",{
                code: this.area
            }).ok(json=>{
                this.saveBranchStandardPrice();
            }).fail(json=>{
                this.hideWin.emit(false);
                this.updateFather.emit([this.area,this.stanPrice,"addStan"]);
            });

        }
        if(this.flag === 'editStan'){
            if(!this.stanPrice){
                this.showSuccess("warn","提示","请输入采购标准价！");
                return;
            }
            this.api.call("BranchStandardPriceController.queryIfBranchStandardPurchasePrice",{
                id:this.selectedRow.branchStandardPurchasePriceId,
                code: this.area
            }).ok(json=>{
                this.editBranchStandardPrice();
            }).fail(json=>{
                this.hideWin.emit(false);
                this.updateFather.emit([this.area,this.stanPrice,"editStan"]);
            });

        }
    }
    sendSaveRequest(){
        this.api.call("goodsBranchPriceController.addBranchPrice",{
            userWorker:{id:this.masterId},
            area:{code:this.area},
            agreementPrice:this.price
        }).ok(json=>{
            this.selectedRow = {};
            this.finishOperation.emit();
            this.hideWin.emit(true);
        }).fail(json=>{
            this.showSuccess("error", "提示", "操作失败！");
        });
    }
    sendUpdateRequest(){
        this.api.call("goodsBranchPriceController.updateBranchPrice",{
            id:this.branchPriceId,
            userWorker:{id:this.masterId},
            area:{code:this.area},
            agreementPrice:this.price
        }).ok(json=>{
            this.selectedRow = {};
            this.finishOperation.emit();
            this.hideWin.emit(true);
        }).fail(json=>{
            this.showSuccess("error", "提示", "操作失败！");
        });
    }

    /**
     * 限制输入一位小数
     * @param obj
     * @param name
     */
    numbranch(obj,name) {
        this.clear(obj,name);
        if(name === 'price'){
            if(obj.value==""){
                this.price = 0;
            }else {
                this.price = parseFloat(obj.value)
            }
        }else {
           if(obj.value==""){
               this.stanPrice = 0
           }else {
               this.stanPrice = parseFloat(obj.value)
           }
        }
    }
    clear(obj,name) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
        name= obj.value;
    }

    getBranchPrice(){
        if(this.area==""){
            this.standaardbranchPrice="";
            return;
        }else{
            this.api.call("BranchStandardPriceController.findBranchStandardPurchasePrice",{first:0,rows:10},{
                code: this.area
            }).ok(json=>{
                ////console.log(this.vLateralAreaRequestVo);
                if(json.result.content&&json.result.content.length!=0){
                    this.standaardbranchPrice=json.result.content[0].standardPurchasePrice;
                }else{
                    this.standaardbranchPrice="暂无标准价";
                }
            }).fail(data => {
                // this.showSuccess("error", "提示", "查询失败！");
            });
        }

    }

    saveBranchStandardPrice(){
        this.api.call("BranchStandardPriceController.branchStandardPurchaseAddOrUpdate",{
            areaCode: this.area,
            standardPurchasePrice: this.stanPrice
        }).ok(json=>{
            this.data = json.result;
            this.showSuccess("success", "提示", "操作成功！");
            this.hideWin.emit(true);
        }).fail(data => {
            this.showSuccess("error", "提示", "操作失败！");
        });
    }

    editBranchStandardPrice(){
        this.api.call("BranchStandardPriceController.branchStandardPurchaseAddOrUpdate",{
            id: this.selectedRow.branchStandardPurchasePriceId,
            areaCode: this.area,
            standardPurchasePrice: this.stanPrice
        }).ok(json=>{
            this.data = json.result;
            this.showSuccess("success", "提示", "操作成功！");
            this.hideWin.emit(true);
        }).fail(data => {
            this.showSuccess("error", "提示", "操作失败！");
        });
    }


}

