/**
 * Created by Administrator on 2017/5/15.
 */
import {Component, Output, EventEmitter, OnInit,Input} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
import {addModifyMasterVo}from"./vo/add-modify-master.vo"
import {API} from "../../../../../../share/lib/api/api";
@Component({
    selector:"modify-master",
    templateUrl:"./add-modify-master.component.html",
    styleUrls:["./add-modify-master.component.css"]
})
export class ModifyMasterComponent implements OnInit{
    @Output() closeAddMaster = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<boolean>();
    @Input() currentRow;//传回来点击表格的数据
    addModifyMasterVo:addModifyMasterVo
    workerName:string;//师傅姓名
    msgs:any;//提示公共组件
    suggestionTransportResult:any[]=[];
    workerNames:any[]=[];
    id:any;//当前行id
    workers:any[]//师傅数组
    workerValues:any[];//师傅控件绑定值
    valueField:string="object";
    // 地址组件
    constructor(public areaService: AreaService,public api:API){}
    dataHandler:Function = this.areaService.selectBoxHandler();
    ngOnInit(){
        this.addModifyMasterVo = new addModifyMasterVo();
        //添加判断
        this.currentRow = this.currentRow[0]?this.currentRow[0]:this.currentRow;
        //console.log(this.currentRow);
        if(this.currentRow){
            this.addModifyMasterVo.area = this.currentRow.areaCode;//回显区域
            if(this.currentRow.customerIDBak){
                this.addModifyMasterVo.shipper={
                    idBak:this.currentRow.customerIDBak,
                    name:this.currentRow.customerName,
                    id:this.currentRow.customerID
                };
            };
            this.id=this.currentRow.id;
            if(this.currentRow.orderTypeValue == "支装"){
                this.addModifyMasterVo.ordertype = "branch"
            }else if(this.currentRow.orderTypeValue == "干支装"){
                this.addModifyMasterVo.ordertype = "trunk"
            }else {
                this.addModifyMasterVo.ordertype = "all"
            }//回显订单类型
            this.addModifyMasterVo.transportCompany = this.currentRow.transportCompany;//回显物流公司
            // this.addModifyMasterVo.workerName = this.currentRow.workerNames;//回显推荐师傅
            this.addModifyMasterVo.worker=this.currentRow.workers
            // this.worker
            this.addModifyMasterVo.worker=this.currentRow.workers
            //用于在页面加载时回显师傅数据，将当前选中行的师傅数组数据传递到修改页面的师傅组件的绑定数组中。forEach方法，每一个each相当于array[i]
            if(this.currentRow.workers){
                //初始化师傅组件绑定数组，也可以在其他地方进行
                this.workerValues=[];
                //遍历当前选中行的师傅数组
                this.currentRow.workers.forEach(each=>{
                    //向师傅组件的绑定数组push 师傅对象
                    this.workerValues.push({
                        id:each.workerID,
                        realName:each.workerName,
                    });
                });
            }
            //console.log(this.currentRow.workers);
        }
    }
    /*
    * 关闭、取消*/
    close(){
        this.closeAddMaster.emit();
    }
    /*
    * 保存*/
    preservation(){
        //用于将前端数据结构转换成接口接收的对应结构
        let workersRequest=[];
        /**
         * 接口接收师傅数组的结构为
         * {
         *   workerName:"",
         *   workerID:""
         * }
         */

        this.workerValues.forEach(each=>{
            workersRequest.push({
                workerName:each.realName,
                workerID:each.id
            });
        });
        //判断发货人是否属于基础资料
        if(typeof this.addModifyMasterVo.shipper == "string" && this.addModifyMasterVo.shipper !=""){
            this.showSuccess("warn","提示","基础资料没有此发货人");
            return;
        };
        if(this.addModifyMasterVo.area == "" || this.addModifyMasterVo.area == undefined){
            this.showSuccess("warn","提示","地区不能为空");
            return
        } else if(this.addModifyMasterVo.ordertype == ""){
            this.showSuccess("warn","提示","订单类型不能为空");
            return
        }else if(!workersRequest || workersRequest.length==0){
            this.showSuccess("warn","提示","师傅姓名不能为空");
            return
        }
        //大括号里为请求参数
        this.api.call("CustomerWorkerController.saveOrUppdate",{
            //物流公司，接口接收字符串
            transportCompany:this.addModifyMasterVo.transportCompany,
            //订单类型，接口接手字符串
            orderType:this.addModifyMasterVo.ordertype,
            //发货人，接口接手对象，对象里主要是一个idBak的值，在当前选择行里拿到
            customer:this.addModifyMasterVo.shipper,
            // customer:this.shipper,

            // userWorkerIds:this.workerIds,
            //师傅数组
            userWorkers:workersRequest,
            //地区编码数组
            areaCodes:[this.addModifyMasterVo.area],
            //是否为用于修改而非保存
            isUpdate:true,
            //此行id，用于接口查找当前行
            id:this.currentRow.id
        }).ok(data=>{
            //请求成功后的回调函数，data为返回值。
            this.save.emit();//保存成功调用
        }).fail(fail=>{
            //包含错误信息，fail.error为具体错误信息
            this.showSuccess("warn","提示",fail.error);//此处包含判断物流公司基础资料
        });


    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }

    searchTransport(){

    }

    deleteTypeOfService(i){
        //console.log(i);
        this.workerValues.splice(i,1);
    }
}