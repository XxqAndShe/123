import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";

@Component({
    selector: 'ro-handle-way-repair',
    templateUrl: './ro-handle-way-repair.component.html',
    styleUrls: [
        './public.css'
    ]
})
export class RoHandleWayRepairComponent implements OnInit{
    constructor(public api:API,public drag: DragBoxService){}
    @Input() selectionRow: any;
    abnormal: any = {};
    @Input() subAbnormalSaleFlag : any;
    public taskRepairVo:any={};
    repairResult: any={
        id : "",
        taskRepairType: "",
        insMaster : "",
        taskRepairGoods:[],
        repairFee: "",
        shipperFee: "",
        pics: [],
        repairPicPath: [],
        fileInfos: [],
        responsibers: "",
        remark: ""
    };
    @Output() closeWin = new EventEmitter();

    ngOnInit(): void {
        //console.log("subAbnormalSaleFlag1");
        //console.log(this.subAbnormalSaleFlag);
        //console.log("subAbnormalSaleFlag1");

        Object.assign(this.taskRepairVo, this.selectionRow);

        if(this.subAbnormalSaleFlag === 'abnormalSale'){
            this.api.call("TaskRepairController.findTaskRepairData",{
                abnormalNum : this.selectionRow.abnormalNum,
                abnormalSaleFlag : this.subAbnormalSaleFlag
            }).ok(json=>{
                let result = json.result || {};
                // //console.log(json.result);
                this.repairResult.taskRepairType = result.taskType;
                this.repairResult.insMaster = result.installMaster;
                /*            result.repairGoodsName.forEach((repairGoodName) => {
                 this.repairResult.taskRepairGoods.push({
                 repairGoodName : repairGoodName
                 });
                 });*/
                this.repairResult.taskRepairGoods = result.repairGoodsName;
                this.repairResult.repairFee = result.repairFee;
                this.repairResult.shipperFee = result.assumeFee;
                this.repairResult.responsibers = result.responsiber;
                this.repairResult.remark = result.remark;
                ////console.log("repairPicPath1");
                typeof (result.repairPicPath) != "undefined" ? this.repairResult.repairPicPath = result.repairPicPath : this.repairResult.repairPicPath = [];
                //图片id绑定
                this.repairResult.fileInfos=_.map(this.repairResult.repairPicPath,'id');
                ////console.log(this.repairResult.repairPicPath);
                ////console.log("repairPicPath2");
            }).fail(err=>{
                //console.log(err);
            });
        }else{
            this.api.call("TaskRepairController.findTaskRepairData",{
                abnormalId : this.selectionRow.id
            }).ok(json=>{
                let result = json.result || {};
                // //console.log(json.result);
                this.repairResult.taskRepairType = result.taskType;
                this.repairResult.insMaster = result.installMaster;
                /*            result.repairGoodsName.forEach((repairGoodName) => {
                 this.repairResult.taskRepairGoods.push({
                 repairGoodName : repairGoodName
                 });
                 });*/
                this.repairResult.taskRepairGoods = result.repairGoodsName || [];
                this.repairResult.repairFee = result.repairFee;
                this.repairResult.shipperFee = result.assumeFee;
                this.repairResult.responsibers = result.responsiber;
                this.repairResult.remark = result.remark;
                ////console.log("repairPicPath1");
                typeof (result.repairPicPath) != "undefined" ? this.repairResult.repairPicPath = result.repairPicPath : this.repairResult.repairPicPath = [];
                //图片id绑定
                this.repairResult.fileInfos=_.map(this.repairResult.repairPicPath,'id');
                ////console.log(this.repairResult.repairPicPath);
                ////console.log("repairPicPath2");
            }).fail(err=>{
                //console.log(err);
            });
        }
        let dialogArea = document.getElementById('move');
        let dialogBox = document.getElementById('box');
        this.drag.dragEle(dialogArea, dialogBox);
    }

    close(){
        this.closeWin.emit();
    }
}
