import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";

@Component({
    selector:"addr-aside",
    templateUrl:"./addr-aside.component.html",
    styleUrls:["./addr-aside.component.css"],

})
export class AddrAsideComponent implements OnInit{

    @Output() closeModal = new EventEmitter<boolean>();//取消
    @Output() onSave = new EventEmitter<boolean>();//保存
    hideModal(){
        this.closeModal.emit(false);
    }


    //输入框组件
    public temp:string;
    public suggestionResult:string[];//查询建议结果
    public orderType:string
    public workers:any[]=[];
    public workersJsonStr:string;
    public workerCode:any[]=[];
    public workerName:string;
    public selectedCodes:any[];
    tellPhone:string;//提货人电话;
    public area:any;
    public msgs:any;//公共组件
    ngOnInit(): void {
        this.listWorkers();
        this.workersJsonStr=JSON.stringify(this.workers);
        this.requestTokenService.createToken();
        this.orderType = "";//默认请选择
    }
    searchResult(event,type?) {
        if(type='receive'){
            //查询收货人result.addrSelectHidden;
            //
        }
        if(event.query.startsWith("a")){
            this.suggestionResult = ["aaa","aab","aac"];
        }
        else if(event.query.startsWith("b")){
            this.suggestionResult = ["bbb","bba","bbc"];
        }
    }

    //地址组件
    constructor(public areaService: AreaService,public api:API,public requestTokenService: RequestTokenService){}
    dataHandler:Function = this.areaService.selectBoxHandler();

    //过滤师傅
    filterWorker(query, workers: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < workers.length; i++) {
            let worker = workers[i];
            //英文小写，不知道中文会怎样
            // if(worker.realName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(worker);

            // }
        }

        return filtered;
    }

    listWorkers() {
        this.api.call("AreaWorkerController.listWorker",{}).ok(json => {
            ////console.log(json.result)
            this.workers=json.result;
        });

    }

    getSelections(event){
        let selection=event.selectedAreas;
        this.selectedCodes=[];
        for(let i=0;i<selection.length;i++){
            this.selectedCodes.push(
                selection[i].data
            )
        }

    }

    /*删除师傅*/
    deleteTypeOfService(i){
        this.workerCode.splice(i,1);
    }
    save(){
        if(this.tellPhone == ""||this.tellPhone == undefined){
            this.showSuccess("warn","提示","提货人电话不能为空");
            return;
        }else if(this.orderType == "" || this.orderType == undefined){
            this.showSuccess("warn","提示","订单类型不能为空");
            return;
        }else if(this.selectedCodes == [] || this.selectedCodes == undefined){
            this.showSuccess("warn","提示","目的地不能为空");
            return;
        }else if(this.workerCode == []){

            this.showSuccess("warn","提示","推荐师傅不能为空");
            return;
        }

        this.workerCode.forEach(each=>{
            this.workers.push({
                workerName:each.realName,
                workerID:each.id
            })
        });
        this.api.call("AreaWorkerController.saveOrUpdate",{
            pickUpMobile:this.tellPhone,
            areaCodes:this.selectedCodes,
            // arriveArea:{code:this.area},
            orderType:this.orderType,
            // userWorkerIds:this.workerCode,
            userWorkers:this.workers
        }).ok(json=>{
            this.onSave.emit();//Todo 操作成功后保存刷新列表按钮
        }).fail(fail=>{
            this.showSuccess("warn","提示",fail.error);
        });
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }

}