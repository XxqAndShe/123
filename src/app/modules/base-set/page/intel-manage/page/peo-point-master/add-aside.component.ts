import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {CustomerWorkerRequestVO, VCustomer, VWorker} from "./vo/peo-point-master-requestvo";
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector:"add-aside",
    templateUrl:"./add-aside.component.html",
    styleUrls:["./add-aside.component.css"]
})
export class AddAsideComponent implements OnInit{
    @Output() closeModal = new EventEmitter<boolean>();//取消
    @Output() onSave = new EventEmitter<boolean>();//保存
    @Input() currentRow;//点击表格时的整行数据

    hideModal(){
        this.closeModal.emit(false);
    }

    //输入框组件
    public shipper:any;
    public shipperName:string;
    public customer:VCustomer;
    public worker:any;
    public transportCompany:string;
    public orderType:string;
    selectedCodes:any[];
    public add:any[];
    public workers:any[]=[];
    public workerCode:any[];
    public suggestionResult;//查询发货人建议结果
    msgs:any;//公共提示；
    object:string="object";
    constructor(public api:API,public requestTokenService: RequestTokenService){
    }
    ngOnInit(): void {
        this.shipper="";
        this.worker="";
        this.orderType = "";
        this.workers=[];
        this.requestTokenService.createToken();
    }
    nodeSelect($event){
        let selection=$event.selectedAreas;
        this.selectedCodes=[];
        for(let i=0;i<selection.length;i++){
            this.selectedCodes.push(
                selection[i].data
            )
        }

    }


    save(){
        //判断发货人是否属于基础资料
        if(typeof this.shipper == "string" && this.shipper !=""){
            this.showSuccess("warn","提示","基础资料没有此发货人");
            return;
        };
        // //判断物流公司师傅属于基础资料
        // if(typeof this.transportCompany == "string" && this.transportCompany !=undefined){
        //     this.showSuccess("warn","提示","基础资料没有此物流公司");
        //     return;
        // };
        if(this.shipper == ""&& this.orderType == ""&& this.transportCompany == undefined){
            this.showSuccess("warn","提示","发货人、订单类型、物流公司必选一项");
            return;
        }else if(this.selectedCodes == [] || this.selectedCodes == undefined){
            this.showSuccess("warn","提示","区域不能为空");
            return;
        }else if(this.workerCode == [] || this.workerCode == undefined){
            this.showSuccess("warn","提示","推荐师傅不能为空");
            return;
        }
        this.workerCode.forEach(each=>{
            this.workers.push({
                workerName:each.realName,
                workerID:each.id
            })
        });
        this.api.call("CustomerWorkerController.saveOrUppdate",{
            transportCompany:this.transportCompany,
            orderType:this.orderType,
            // customer:this.shipper,
            customer:this.shipper,

            // userWorkerIds:this.workerIds,
            userWorkers:this.workers,
            areaCodes:this.selectedCodes
        }).ok(json=>{
            this.closeModal.emit(true);//Todo 操作成功后保存刷新列表按钮
            }
        ).fail(
            json=>{
                this.showSuccess("warn","提示",json.error);
            }
        )
      // //Todo 不能进入ok
      //   this.onSave.emit();
    }
    /*删除师傅*/
    deleteTypeOfService(i){
        //console.log(i);
        this.workerCode.splice(i,1);
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }

}