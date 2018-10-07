import {Component, animate, trigger, state, transition, style, OnInit} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService}from"primeng/primeng"

@Component({
    templateUrl: './peo-point-master.component.html',
    styleUrls: [
        './peo-point-master.component.css'
    ],
    animations: [
        trigger('modalState', [
            state('in', style({
                right: '0'
            })),
            state('out', style({
                right: '-1040px'
            })),
            transition('out => in', animate('200ms ease-in')),
            transition('in => out', animate('200ms ease-out'))
        ])
    ]
})

export class PeoPointMasterComponent implements OnInit{

    // nav插件引用设置
    navs = ["智能匹配区域管理","智能匹配规则配置","发货人指定师傅管理","提货电话指定师傅管理"];
    navHrefs = [
        'modules/base-set/intel-manage/intel-addr-manage',
        'modules/base-set/intel-manage/intel-rule-manage',
        'modules/base-set/intel-manage/peo-point-master',
        'modules/base-set/intel-manage/addr-point-master'
    ];
    currentRow:any;
    currentRowId:string[]=[];//id数组
    msgs:any;//公共提示
    curIndex = 2;
    selectLineInfo:string[]=[];//点击表格选中的数据
    selectionRow:string[]=[];//判断行数用，与ui-grid表格绑定
    // 地址组件
    // addrSelectHidden = true;
    // areaText = "";
    // changeAddrText(result: any) {
    //     this.areaText = result.areaText;
    //     this.addrSelectHidden = result.addrSelectHidden;
    // }

    //输入框组件
    suggestionShipperResult:any[];//查询建议结果
    suggestionWorkerResult:any;//查询结果
    transportCompany:string;//查询建议结果
    shipperName:any;
    suggestionTransportResult:any[]=[];
    len:number = 0;
    ordertype:string;
    requestvo:any={};
    masterIf:boolean;//修改师傅
    isshowMater:string = "out";
    loading:boolean;
    query(event){
        event.first=0;
        event.rows=10;
        this.loading = true;
        this.load(event);
    }
    reset(event){
        // this.transportCompany="";
        // this.ordertype="";
        // // this.shipperName="";
        // this.area="";
        // // this.workerName="";
        // this.query(event);
    }

    searchResult(event,type?) {
        if(type='receive'){
            //查询收货人
        }
        // if(event.query.startsWith("a")){
        //     this.suggestionResult = ["aaa","aab","aac"];
        // }
        // else if(event.query.startsWith("b")){
        //     this.suggestionResult = ["bbb","bba","bbc"];
        // }
    }

    isshowModal=false;//
    isshowModalAni=false;//
    displayModal(){
        var that=this;
        this.isshowModal=true;
        setTimeout(function(){
            that.isshowModalAni =true;
        }, 0);
    }
    /*
    * 关闭取消*/
    closeModal(show:boolean){
        if(show){
            this.showSuccess("success","提示","操作成功！");
            //console.log("进入刷新保存");
            this.query({first:0,rows:10});//刷新
        }
        let that=this;
        this.isshowModalAni=false;
        setTimeout(function(){
            that.isshowModal =false;
        }, 200);
    }
    /*
     * 右弹窗保存*/
    doSave(){
        this.showSuccess("success","提示","操作成功！");
        this.query({first:0,rows:10});//刷新
        this.selectLineInfo = [];//清空选中
        let that=this;
        this.isshowModalAni=false;
        setTimeout(function(){
            that.isshowModal =false;
        }, 200);
    }

    /**
     * 点击编辑按钮，样式变化
     */
    isClickModify=false;
    clickModify(){
        this.isClickModify=!this.isClickModify;
    }

    // 初始化列
    columns: any[] = [];
    ngOnInit(){
        //console.info('ngOnInit')
        this.columns=[];
        this.ordertype = "";//默认请选择
        this.initColumns();

    }
    initColumns(): void {
        this.columns.push({
            field: "customerName",
            header: "发货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "transportCompany",
            header: "物流公司",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "orderTypeValue",
            header: "订单类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "destProvince",
            header: "目的省",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "destCity",
            header: "目的市",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "destDistrict",
            header: "目的区/县",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "workerNames",
            header: "推荐师傅",
            sortable: false,
            filter: true
        });
    }
    data:any[]=[];
    workerName:any;
    ordertypeValue:any
    // 地址组件
    constructor(public areaService: AreaService,
                 public api:API,
                 public confirmationService:ConfirmationService){}
    dataHandler:Function = this.areaService.selectBoxHandler();
    area:string;
        load($event){
        this.api.call("customerWorkerController.queryByExample", $event,{
            transportCompany:this.transportCompany,
            orderType:this.ordertype,
            customer:{
                name:this.shipperName
            },
            area:{
                code:this.area
            },
            workerName:this.suggestionWorkerResult
        })
            .ok(json => {
                this.data=json.result;
                this.loading = false;
            })
            .fail(json => {
               this.loading = false;
            });
    }
    exportCSV($event){
        this.api.call('customerWorkerController.queryByExample', {
            first:0,
            rows:99999999
        }, {
            transportCompany:this.transportCompany,
            orderType:this.ordertype,
            customer:{
                name:this.shipperName
            },
            area:{
                code:this.area
            },
            workerName:this.suggestionWorkerResult

        })
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    searchTransport(event){
        let value=event.query;
        let str=[];
        this.api.call("customerWorkerController.queryShipperNameLike",{
            name:value
        }).ok(json=>{
            // for(let i=0;i<json.result.length;i++){
            //     str.push(json.result[i].name);
            // }
            // this.suggestionShipperResult=str;
            this.suggestionShipperResult=json.result
        }).fail(json=>{

        });
    }
    /*
    * 修改师傅*/
    disableModify(){
        //判断单多选
        if(this.selectionRow.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if(this.selectionRow.length == 0){
            this.showSuccess("warn","提示","请选择一条数据");
            return;
        }
        this.masterIf =true;
      let that = this;
        setTimeout(function(){
            that.isshowMater = "in";
        }, 0);

    }
    //取消
    closeMaster(){
        this.isshowMater = "out";
        let that = this;
        setTimeout(function(){
            that.masterIf =false;
        }, 0);
    }
    //保存
    onSave(){
        this.showSuccess("success","提示","操作成功");
        this.closeMaster();//关闭弹窗
        this.query({first:0,rows:10});
        this.selectionRow = [];

    }
    searchShipper(event){
        let value=event.query;
        let str=[];
        this.api.call("customerWorkerController.queryShipperNameLike",{
            name:value
        }).ok(json=>{
            // for(let i=0;i<json.result.length;i++){
            //     str.push(json.result[i].name);
            // }
            // this.suggestionShipperResult=str;
            this.suggestionShipperResult=json.result
        }).fail(json=>{

        });
    }
    searchWorker(event){
        let value=event.query;
        let str=[];
        this.api.call("customerWorkerController.queryWorker",{
            workerName:value
        }).ok(json=>{
            // for(let i=0;i<json.result.length;i++){
            //     str.push(json.result[i].realName);
            // }
            // this.suggestionWorkerResult=str;
            this.suggestionWorkerResult=json.result
        }).fail(json=>{

        });
    }

    disableSave(){
        this.api.call("CustomerWorkerController.delete",{ids:this.ids}).ok(json=>{
            ////console.log(json);
            this.showSuccess("success","提示","操作成功");//删除成功后提示
            this.query({first:0,rows:10});
            this.selectionRow = [];
        }).fail(json=>{
            ////console.log(json);
            this.showSuccess("warn","提示","删除失败");//删除成功后提示
        })
    }
    ids:string[]=[];
    disable(){
        if(this.selectionRow.length == 0){
            this.showSuccess("warn","提示","请选择一条数据");
            return;
        }
        this.alert("是否确认删除？","提示",()=>{
            //Todo 确认取消
                 this.ids = this.currentRowId;
                this.disableSave();

        },()=>{
            //Todo 取消删除
        })
    }

    onselect(event){
        this.currentRow=event[0];
        this.len = event.length;
        this.selectLineInfo = event;
        this.selectionRow.length = this.selectLineInfo.length;
        //遍历所有的id
        if(event.length>0){
            for(let i = 0;i<event.length;i++){
                this.currentRowId.push(event[i].id)
            }
        }
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    /*公用弹框*/
    alert(msg:string,title?:string,cb?:any,cd?:any){
        this.confirmationService.confirm({
            message: msg,
            header: title||'提示',
            accept: (e) => {
                if(cb){
                    cb(e);
                }
            },
            reject:(e)=>{
                if(cd){
                    cd(e);
                }
            }
        });
    }

}
