/**
 * Created by 1 on 2017/8/21.
 */
import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {AddAndModifyVo} from "../vo/addAndModify.vo";
import {ShowOrHideMaskService} from "../../../../../share/app-service/show-or-hide-mask.service";
import {API} from "../../../../../share/lib/api/api";
import {last} from "@angular/router/src/utils/collection";
import {fail} from "assert";
import {DragBoxService} from "app/share/app-service/drag-box.service";

@Component({
    selector: 'add-and-modify',
    templateUrl: './add-and-modify.component.html',
    styleUrls: [
        './add-and-modify.component.css'
    ]
})
export class AddAndModifyComponent implements OnInit{
    addAndModifyVo:AddAndModifyVo = new AddAndModifyVo();
    @Output() close = new EventEmitter();
    @Input() selections;
    @Input() whatType;
    add:boolean;
    msgs:any[];
    who:string;//大类或小类
    bigName;//大类名
    complaintDuty:string;//责任方
    catalogId:string;//小类
    penaltyDesc:string;//描述
    remark:string;//备注
    penaltyFee:string;//金额
    penaltyBigCatelogName:any[]=[];
    penaltySmallCatelogName:any[] = [];
    complaintBig:string;//大类，发后端
    constructor(public mask:ShowOrHideMaskService,
                public api:API,
                public drag: DragBoxService){

    }
    ngOnInit(){
        this.mask.show();
        if(this.whatType !== 'add'){
            this.penaltyDesc = this.selections[0].penaltyDesc;
            this.penaltyFee = this.selections[0].penaltyFee;
            this.remark = this.selections[0].remark;
        }
    }

    /**
     * 责任方选择
     * @param event
     */
    responsibility(event){
        this.complaintDuty = event;
        $('#'+event).addClass('add-color').siblings().removeClass('add-color');
        this.addAndModifyVo.complaintDuty = event;
        this.api.call("ComplaintController.listCatalog",{
            "complaintDuty":event
        }).ok(data=>{
           this.penaltyBigCatelogName = data.result;
           this.penaltySmallCatelogName = [];
        }).fail(err=>{
          this.showSuccess("error","提示",err.error);
        })
    }

    /**
     * 点击大类
     * @param i
     */
    apiBig(i){
        this.bigName = i;
        $('#'+i.catalogId).addClass('add-color').siblings().removeClass('add-color');
        this.api.call("ComplaintController.listCatalog",{
            "complaintDuty":this.addAndModifyVo.complaintDuty,
            "catalogParentId":i.catalogId
        }).ok(data=>{
            this.penaltySmallCatelogName = data.result;
        }).fail(err=>{
            this.showSuccess("error","提示",err.error);
        })
    }

    /**
     * 点击小类
     * @param i
     */
    apiSmall(i){
     this.catalogId = i.catalogId;
        $('#'+i.catalogId).addClass('add-color').siblings().removeClass('add-color');
    }
    /**
     * 取消、关闭
     */
    closeHide(){
        this.close.emit(false);
    }
    /**
     * 保存
     */
    // 添加/修改投诉资料：/complaint/saveMaterial
    // 入参出参均是这个：VComplaintMaterial
    save(){
        /*增加判断*/
        if(this.whatType === "add"){
            if(!this.addAndModifyVo.complaintDuty){
                this.showSuccess("warn","提示","请选择责任方");
                return;
            }
            if(!this.bigName.catalogId){
                this.showSuccess("warn","提示","请选择投诉大类");
                return;
            }
            if(!this.catalogId){
                this.showSuccess("warn","提示","请选择投诉小类");
                return;
            }
            if(!this.penaltyDesc){
                this.showSuccess("warn","提示","请输入符合描述");
                return;
            }
            this.api.call("ComplaintController.saveMaterial",{
                "complaintDuty":this.addAndModifyVo.complaintDuty,
                "penaltyBigCatelogId":this.bigName.catalogId,
                "penaltySmallCatelogId":this.catalogId,
                "penaltyDesc":this.penaltyDesc,
                "penaltyFee":this.penaltyFee,
                "remark":this.remark,
            }).ok(data=> {
                this.close.emit(true);
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            })
        } else {
            this.api.call("ComplaintController.saveMaterial",{
                "id":this.selections[0].id,
                "complaintDuty":this.selections[0].complaintDuty,
                "penaltyBigCatelogId":this.selections[0].penaltyBigCatelogId,
                "penaltySmallCatelogId":this.selections[0].penaltySmallCatelogId,
                "penaltyDesc":this.penaltyDesc,
                "penaltyFee":this.penaltyFee,
                "remark":this.remark,
            }).ok(data=> {
                this.close.emit(true);
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            })
        }
    }
    /**
     * 添加小类
     */
    addSmall(){
     if(!this.addAndModifyVo.complaintDuty){
         this.showSuccess("warn","提示","请选择责任方");
         return;
     }
     if(!this.bigName){
         this.showSuccess("warn","提示","请选择投诉大类");
         return;
     }
     this.who = "modify";
     this.add = true;
    }

    /**
     * 添加大类
     */
    addBig(){
        if(!this.addAndModifyVo.complaintDuty){
            this.showSuccess("warn","提示","请选择责任方");
            return;
        }
        this.add = true;
        this.who = "add";
    }
    ngOnDestroy() {
        this.mask.hide();
    }

    /**
     * 确认、取消
     * @param event
     */
    closeSave(event){
        if(event === "small"){
            this.api.call("ComplaintController.listCatalog",{
                "complaintDuty":this.complaintDuty,
                "catalogParentId":this.bigName.catalogId
            }).ok(data=>{
                this.penaltySmallCatelogName = data.result;
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            });
            this.showSuccess("success","提示","添加小类成功！");

        } else if(event){
            this.api.call("ComplaintController.listCatalog",{
                "complaintDuty":this.complaintDuty
            }).ok(data=>{
                this.penaltyBigCatelogName = data.result;
            }).fail(err=>{
                this.showSuccess("error","提示",err.error);
            })
            this.showSuccess("success","提示","添加大类成功！");

        }
        this.add = false;
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
}
