import { Component,animate, trigger, state, transition, style} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService} from 'primeng/primeng';

@Component({
    templateUrl: './addr-point-master.component.html',
    styleUrls: [
        './addr-point-master.component.css'
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

export class AddrPointMasterComponent{
    // nav插件引用设置
    navs = ["智能匹配区域管理","智能匹配规则配置","发货人指定师傅管理","提货电话指定师傅管理"];
    navHrefs = [
        'modules/base-set/intel-manage/intel-addr-manage',
        'modules/base-set/intel-manage/intel-rule-manage',
        'modules/base-set/intel-manage/peo-point-master',
        'modules/base-set/intel-manage/addr-point-master'
    ];
    curIndex = 3;
    msgs:any;//公共提示
    len:number = 0;
    masterIf:boolean;//修改师傅
    isshowMater:string = "out";//修改师傅动画
    isshowModal=false;//
    isshowModalAni=false;//
    tellPhone:string;//提货人电话
    selectLineInfo:string[]=[];//选中信息
    selectionRow:string[] = [];//判断选中条数专用
    loading:boolean;

    workerCode:string="";

    constructor(public areaService: AreaService,
                public api:API,
                public confirmationService:ConfirmationService){}
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
        let that=this;
        this.isshowModalAni=false;
        setTimeout(function(){
            that.isshowModal =false;
        }, 200);
    }
    /*
    * 保存*/
    doSave(){
        this.showSuccess("success","提示","操作成功");
        this.query({first:0,rows:10});
        this.selectionRow = [];
        let that=this;
        this.isshowModalAni=false;
        setTimeout(function(){
            that.isshowModal =false;
        }, 200);
    }
    /*
    * 修改师傅*/
    disableModify(){
        //console.log("函数："+this.selectionRow.length);
        if(this.selectLineInfo.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.selectLineInfo.length == 0){
            this.showSuccess("warn","提示","请选择一行数据");
            return;
        }
        this.masterIf = true;
        let that = this;
        setTimeout(function () {
            that.isshowMater = "in";
        })
    }
    //取消修改师傅
    closeMaster(){
            this.isshowMater = "out";
            let that = this;
            setTimeout(function () {
                that.masterIf = false;
            })
    }
    //保存修改师傅
    saveMaster(){
        this.showSuccess("success","提示","操作成功！");
        this.closeMaster();//关闭弹窗
        this.query({first:0,rows:10});//刷新
        this.selectionRow = [];//清空选中

    }
    /**
     * 点击编辑按钮，样式变化
     */
    isClickModify=false;
    clickModify(){
        this.isClickModify=!this.isClickModify;
    }
    // 地址组件
    dataHandler:Function = this.areaService.selectBoxHandler();

    // 初始化列
    columns: any[] = [];
    ngOnInit(){
        this.initColumns()
    }
    initColumns(): void {
        this.columns.push({
            field: "pickUpMobile",
            header: "提货人电话",
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
            field: "destinationProvince",
            header: "目的省",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "destinationCity",
            header: "目的市",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "destinationDistrict",
            header: "目的区",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "workerName",
            header: "推荐师傅",
            sortable: false,
            filter: true
        });
    }
    //表中订单类型
    orderType:string="";
    //页面顶部订单类型
    orderTypeTop="";
    //页面顶部地区
    area:any;
    data:any[]=[];
    arriveAreaName:string="";
    areaName:string="";
    currentRow:any;
    currentRowId:string[]=[];//批量删除id
    userWokers:string;
    load(event){

        if(event==null){
            event.first=0;
            event.rows=10;
        }
        this.api.call("AreaWorkerController.queryByExample",event,{ area:{code:this.area},
            orderType:this.orderTypeTop,workerName:this.workerCode, pickUpMobile:this.tellPhone},
        ).ok(json=>{
            this.data=json.result;
            this.loading = false;


        }).fail(json=>{
            this.showSuccess("warn","提示",json);
            this.loading = false;
        })
    }

    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('AreaWorkerController.queryByExample', {
            first:0,
            rows:99999999
        }, {area:{code:this.area},
            orderType:this.orderTypeTop,workerName:this.workerCode, pickUpMobile:this.tellPhone})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    query($event){
        $event.first=0;
        $event.rows=10;
        this.loading = true;
        this.load($event);
    }
    clearInput(){
        this.area='';
        this.orderTypeTop='';
    }
    disableSave(){
        ////console.log(this.ids);
        this.api.call("AreaWorkerController.delete",{ids:this.ids}).ok(json=>{
            this.showSuccess("success","提示","操作成功");
            this.query({first:0,rows:10});
            this.selectionRow = [];

        }).fail(json=>{
            this.showSuccess("error","提示",json.error);
        })
    }
    ids:string[]=[];
    disable(){
        if (this.selectLineInfo.length == 0){
            this.showSuccess("warn","提示","请选择一行数据");
            return;
        }
        this.alert("是否确认删除？","提示", ()=>{
            //Todo 确认删除
            this.ids = this.currentRowId;
            this.disableSave();

        },()=> {
            //Todo 取消删除

        })
    }

    onselect(event){
        //console.log(event);
        //console.log(this.selectLineInfo.length);
        this.selectLineInfo = event;
        this.currentRow=event[0];
        this.len = event.length;
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

}
