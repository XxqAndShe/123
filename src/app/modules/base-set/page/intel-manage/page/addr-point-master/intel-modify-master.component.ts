/**
 * Created by Administrator on 2017/5/15.
 */
import { Component,EventEmitter, Output, OnInit,Input} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {intelModifyMasterVo}from"./vo/intelmodifyMaster.vo"
import {API} from "../../../../../../share/lib/api/api";


@Component({
    selector:'add-modify-master',
    templateUrl:'./intel-modify-master.component.html',
    styleUrls:['./intel-modify-master.component.css']
})
export class IntelModifyMasterComponent implements OnInit{
    @Output() closeAddMaster = new EventEmitter<boolean>();//取消
    @Output() saveAddMaster = new EventEmitter<boolean>();//保存
    @Input() currentRow;//传回来点击表格的数据
    intelModifyMasterVo:intelModifyMasterVo;
    workerName:string;//师傅姓名
    msgs:any;//提示公共组件
    workerValues:any[];//师傅选择组件值
    transportCompany:string;//物流公司；
    suggestionTransportResult:any[]=[];
    // 地址组件
    constructor(public areaService: AreaService,public api:API){}
    dataHandler:Function = this.areaService.selectBoxHandler();
    ngOnInit(){
        //console.log(this.currentRow);
        this.intelModifyMasterVo = new intelModifyMasterVo();
        //添加判断
        this.currentRow = this.currentRow[0]?this.currentRow[0]:this.currentRow;
        if(this.currentRow){
            this.intelModifyMasterVo.pickUpMobile = this.currentRow.pickUpMobile;//回显提货电话
            this.intelModifyMasterVo.objectiveArea = this.currentRow.objectiveArea;//回显到货区域
            this.intelModifyMasterVo.shipperName = this.currentRow.customerName;//回显发货人
            if(this.currentRow.orderTypeValue == "支装"){
                this.intelModifyMasterVo.ordertype = "branch"
            }else if(this.currentRow.orderTypeValue == "干支装"){
                this.intelModifyMasterVo.ordertype = "trunk"
            }else {
                this.intelModifyMasterVo.ordertype = "all"
            }//回显订单类型
            this.intelModifyMasterVo.transportCompany = this.currentRow.transportCompany;//回显物流公司
            if(this.currentRow.userWorkers){
                this.workerValues=[];
                this.currentRow.userWorkers.forEach(each=>{
                    this.workerValues.push({
                        realName:each.workerName,
                        id:each.workerID
                    });
                });
            }
            //console.log(this.workerValues);
        }
    }
    /*
     * 关闭、取消*/
    close(){
        this.closeAddMaster.emit(true);
    }
    /*
     * 保存*/
    preservation(){
        let workersRequest=[];
        if(this.intelModifyMasterVo.pickUpMobile == "" || this.intelModifyMasterVo.pickUpMobile == undefined){
            this.showSuccess("warn","提示","提货电话不能为空");
            return
        } else if(this.intelModifyMasterVo.objectiveArea == "" || this.intelModifyMasterVo.objectiveArea == undefined){
            this.showSuccess("warn","提示","目的地区不能为空");
            return
        } else if(this.intelModifyMasterVo.ordertype == ""){
            this.showSuccess("warn","提示","订单类型不能为空");
            return
        } else if(this.workerValues == [] || this.workerValues == undefined){
            this.showSuccess("warn","提示","师傅不能为空");
            return
        }
        this.workerValues.forEach(each=>{
            workersRequest.push({
                workerName:each.realName,
                workerID:each.id
            });
        });
        this.api.call("AreaWorkerController.saveOrUpdate",{
            areaCodes:[this.intelModifyMasterVo.objectiveArea],
            pickUpMobile:this.intelModifyMasterVo.pickUpMobile,
            // arriveArea:{code:this.intelModifyMasterVo.arrivalArea},
            orderType:this.intelModifyMasterVo.ordertype,
            userWorkers:workersRequest,
            isUpdate:true,
            id:this.currentRow.id
        }).ok(json=>{
            // alert("保存成功");
            this.showSuccess("success","提示","保存成功");
            this.saveAddMaster.emit();//保存成功调用
        }).fail(fail=>{
            this.showSuccess("warn","提示",fail.error);
        });

    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    deleteTypeOfService(i){
        //console.log(this.workerValues);
        this.workerValues.splice(i,1);
        //console.log(this.workerValues);
    }
    searchTransport($event:any): void{

    }
}

