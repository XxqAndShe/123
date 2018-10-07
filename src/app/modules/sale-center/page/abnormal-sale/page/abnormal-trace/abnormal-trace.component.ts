import { Component,OnInit} from '@angular/core';
import {AbnormalTaskRequestVo} from "../../vo/abnormal-task-request.vo";
import {API} from "../../../../../../share/lib/api/api";
import {AbnormalTaskService} from "../../service/abnormal-task.service";
import {TrackRequestVo} from "../../vo/track-request.vo";
import {  ShowOrHideMaskService } from '../../../../../../share/app-service/show-or-hide-mask.service';


@Component({
    templateUrl: './abnormal-trace.component.html',
    styleUrls: [
        '../share/abnormal-sale.css'
    ]
})

export class AbnormalTraceComponent implements OnInit{
    rowData;
    selected:any = 0;//用于显示选中数据条数
    loading: boolean;
    public abnormalTaskRequestVo:AbnormalTaskRequestVo;
    public trackRequestVo:TrackRequestVo;
    selectLineInfo:any[]=[];//传给跟踪

    constructor (
        public api: API,
        public abnormalTaskService: AbnormalTaskService,
        public mask:ShowOrHideMaskService){

    }
    ngOnInit():void{
        this.abnormalTaskRequestVo = new AbnormalTaskRequestVo();
        this.trackRequestVo = new TrackRequestVo();
        this.abnormalTaskRequestVo.trace = true;
        this.nodeRefresh();
    }
    navs = ["全部","维修任务","返货任务","补件任务","其他任务","待跟踪"];
    navHrefs = [
        '/modules/sale-center/abnormal-sale/all-abnormal',
        '/modules/sale-center/abnormal-sale/abnormal-repair',
        '/modules/sale-center/abnormal-sale/abnormal-returgood',
        '/modules/sale-center/abnormal-sale/abnormal-supgood',
        '/modules/sale-center/abnormal-sale/abnormal-other',
        '/modules/sale-center/abnormal-sale/abnormal-trace'
    ];
    nodeNumber:number[]=[0,0,0,0,0,0,0,0];
    curIndex =5 ;
    isExplane=false;
    changeExplane(isExplane:boolean){
        this.isExplane=isExplane;

    }

    /*公共弹窗提示*/
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    //由子组件传递过来参数--Z追踪弹框显示
    isshowTraceWin = false;

    showOrHideTraceWin(isshow: boolean) {
        //单选判断
        if(this.selectLineInfo.length >1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return
        }
        if(this.selectLineInfo.length !=0){
            this.selectLineInfo[0].whatType = "task";//跟踪判断
            this.isshowTraceWin = isshow;
            this.mask.show();
        }else {
            this.showSuccess("warn","提示","请选择一条数据");
        }

    }

    //获取任务列表,包括全部、维修、补件、返货、其他
    abnormalTaskResponseVo = [];
    /**
     * 执行查询操作
     */
    public doSearch():any{
        ////console.log(this.abnormalTaskRequestVo)
        this.abnormalTaskService.findAbnormalTask(vo=>{
            let content = vo.content;
            for (let i = 0; i < content.length; i ++) {
                this.abnormalTaskResponseVo.push({name: content[i].name, hasDel: true});
            }
        }, this.abnormalTaskRequestVo);
    }
    data:any
    load($event){
        this.data = this.test();
    }
    //测试表格数据
    test() {
        let data = {
            content: [
                {
                    "abnormalNum": "001", "source":"hfgfgf"
                }
            ],
            first: true,
            last: true,
            number: 0,
            numberOfElements: 4,
            size: 20,
            totalElements: 4,
            totalPages: 1
        }
        return data;
    }
    /**
     * 执行跟踪操作
     */
    public doSave(){
        this.showSuccess("success","提示","操作成功");
        this.isshowTraceWin = false;
        this.mask.hide();
        this.doSearch();
        this.selected=[];
        this.selectLineInfo=[];
    }
    rowInfo(data){
        this.rowData=data[0];
        this.selectLineInfo = data;
    }
    selectedRow(data){
        this.selected = data;
    }
    loadEvent($event){
        this.loading=!!$event;
    }
    /**
     * 节点数量
     */
    nodeRefresh(){
        this.api.call("abnormalAfterSaleController.abnormalAfterSaleTopNum").ok(data=>{
            this.nodeNumber[0] = data.result['allNumber'] || 0;
            this.nodeNumber[1] = data.result['repairNumber'] || 0;
            this.nodeNumber[2] = data.result['fhreturnNumber'] || 0;
            this.nodeNumber[3] = data.result['partNumber'] || 0;
            this.nodeNumber[4] = data.result['otherNumber'] || 0;
            this.nodeNumber[5] = data.result['trackNumber'] || 0;
        }).fail(err=>{

        })
    }
}
