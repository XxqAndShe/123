import { Component,OnInit, AfterViewInit } from '@angular/core';
import {API} from "../../../../share/lib/api/api";
import {modalAnimation} from "../../../../share/animation/modalAnimation.animation";


@Component({
    selector: 'sale-running',
    templateUrl: './sale-running.component.html',
    styleUrls: ['./sale-running.component.css'],
    animations: [
        modalAnimation
    ]
})
export class SaleRunningComponent implements OnInit, AfterViewInit{
    saleRunning:boolean=true;
    requestParam:any;
    /**
     * 表单组件
     */
    columns:any[]=[];

    data:any;

    selections:any;

    // 右侧弹出块显示的控制变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    curModalIndex = -1;
    loading:boolean = false;

    // 控制第一次加载不触发查询组件查询按钮加载表格
    isFirstLoad: boolean = true;

    /*公共弹窗提示*/
    msgs:any;
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    constructor(public api:API){

    }

    ngOnInit():void{
        this.columns.push({
            field: "id",
            header: "ID",
            sortable: true,
            filter: true,
            hidden: true
        });
        this.columns.push({
            field:"companyDepartmentMobile",
            header:"网点手机",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"companyDepartment",
            header:"所属网点",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"waybillId",
            header:"任务号",
            sortable:false,
            filter:true,
            link: true
        });
        this.columns.push({
            field:"taskType",
            header:"任务类型",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"masterName",
            header:"师傅姓名",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"masterAccount",
            header:"师傅账号",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"taskMoney",
            header:"任务金额",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"feeDetail",
            header:"费用明细",
            sortable:false,
            filter:true
        });
        /*this.columns.push({
            field:"referCost",
            header:"参考成本",
            sortable:false,
            filter:true
        });
        this.columns.push({
             field:"differential",
             header:"差价",
             sortable:false,
             filter:true,
             isNegative: true
        });*/
        this.columns.push({
          field:"flowCreateDate",
          header:"流水生成时间",
          sortable:false,
          filter:true
        });
        this.columns.push({
            field:"signTime",
            header:"签收时间",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"withdrawStatus",
            header:"提现状态",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"applyTime",
            header:"申请时间",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"auditTime",
            header:"审批时间",
            sortable:false,
            filter:true
        });
        this.columns.push({
            field:"auditPerson",
            header:"审批人",
            sortable:false,
            filter:true
        });
    }

    ngAfterViewInit(){
        this.isFirstLoad = false;
    }


    //显示右键勾选编辑按钮
    isshowTitle=false;
    showTitle(){
        this.isshowTitle=!this.isshowTitle;
    }
    //表格加载及右下角页码改变调、列筛选调用
    load(page): any {
        this.api.call("FinancialCenterController.saleFlowCount", page, this.requestParam).ok(json => {
            this.data = json.result;
            this.loading = false;
        }).fail((err)=>{
            this.loading = false;
        });
    }
    /**
     * 导出
     */
    exportCSV($event){
        this.api.call('FinancialCenterController.saleFlowCount', {
            first:0,
            rows:99999999
        }, this.requestParam)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    findSaleRunningFlow(event):any{
        this.loading = true;
        this.requestParam=event;
        if(!this.isFirstLoad) {
            this.load({
                first: 0,
                rows: 10
            });
        }
    }
    displayModal(index){
        let that = this;
        this.isModuleDisplayArr[index] = true;
        setTimeout(function () {
            that.isModuleDisplayArr1[index] = true;
        }, 0);
        this.curModalIndex = index;
    }
    closeModal(isClose: boolean) {
        let that = this;
        this.isModuleDisplayArr1[this.curModalIndex] = isClose;
        setTimeout(function () {
            that.isModuleDisplayArr[that.curModalIndex] = isClose;
        }, 200);
    }

    rowData;
    rowSelect(row){
        this.rowData = row[0];
    }

    cellClick(cell){
        if (cell.field === 'waybillId'){
            this.selections = cell.row;
            if(cell.row.taskType === '维修任务'){
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if(cell.row.taskType === '返货任务'){
                let that = this;
                this.isModuleDisplayArr[1] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[1] = true;
                }, 0);
                this.curModalIndex = 1;
            }
            else if(cell.row.taskType === '调度任务'){
                let that = this;
                this.isModuleDisplayArr[2] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[2] = true;
                }, 0);
                this.curModalIndex = 2;
            }else {
                this.showSuccess("warn","提示","该记录无法判断任务类型！");
            }
        }
    }

}
