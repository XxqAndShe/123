/**
 * Created by 1 on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {API} from "../../../../share/lib/api/api";
import {ComplaitManageVo} from "./vo/complaitManage.vo";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {DatePipe} from "@angular/common";

@Component({
    templateUrl: './complaint-manage.component.html',
    styleUrls: [
        './complaint-manage.component.css'
    ]
})

export class ComplaintManageComponent implements OnInit {
    share:string;
    data:any;
    columns: any[] = [];
    msgs:any[];
    loading:boolean = false;
    CatalogId:string;//投诉类型
    dataCreatedBeginTime:string;//创建时间
    dataCreatedEndTime:string;//结束时间
    selections:any[]=[];
    startDate:string;//开始时间
    endDate:string;//结束时间
    header=["责任方","投诉大类","投诉小类","符合投诉条件描述","处罚金额","备注","编辑人","编辑时间"];
    field=["duty","penaltyBigCatelogName","penaltySmallCatelogName","penaltyDesc","penaltyFee","remark","lastUpdatedUser","lastUpdatedTime"];
    complaitManageVo:ComplaitManageVo =  new ComplaitManageVo();
    /**
     * 日历组件
     * @type {any}
     */
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        'width': 78 + 'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    constructor(public datePickerService:DatepickerService,
                public api:API,
                public mask:ShowOrHideMaskService,
                public datePipe:DatePipe){

    }
    ngOnInit() {
        for(let i = 0;i<this.header.length;i++){
            this.columns.push({
                header:this.header[i],
                field:this.field[i],
                sortable: false,
                filter: true

            });
        }
    }

    /**
     * 点击表格
     * @param event
     */
    rowSelect(event){
        this.selections = event;
    }

    /**
     * 查询
     */
    doSearch(){
       this.load({first:0,row:10});
       this.selections = [];
    }
    /**
     * 表格加载
     * @param $event
     */
    load($event){
        this.complaitManageVo.createBeginTime = this.datePipe.transform(this.dataCreatedBeginTime,'yyyy-MM-dd HH:mm:ss');
        this.complaitManageVo.createEndTime = this.datePipe.transform(this.dataCreatedEndTime,'yyyy-MM-dd 23:59:59');
      this.api.call("ComplaintController.listMaterial",$event,this.complaitManageVo).ok(data=>{
          this.data = data.result;
      }).fail(err=>{
          this.showSuccess("error","提示","查询失败");
      })
    }
    /**
     * 组件类型
     * @param event
     */
    shareType(event){
        if(event === 'add'){
            this.share = event;
        }else {
            if(this.selections.length === 0){
                this.showSuccess("warn","提示","请选择一条数据");
                return;
            }
            if(this.selections.length > 1){
                this.showSuccess("warn","提示","只能选择一条数据");
                return
            }
            this.share = event;
        }

    }
    close(event){
        if(event){
         this.showSuccess('success',"提示","操作成功");
         this.doSearch();
        }
        this.share = "";
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    onCatalogChange(event){
        if(event.level === 0){
            this.complaitManageVo.complaintDuty = this.CatalogId;
            this.complaitManageVo.bigCatalogId = null;
            this.complaitManageVo.smallCatalogId = null;
        }else if(event.level === 1){
            this.complaitManageVo.bigCatalogId = this.CatalogId;
            this.complaitManageVo.smallCatalogId = null;
        }else {
            this.complaitManageVo.smallCatalogId = this.CatalogId;
        }
    }

    /**
     * 清空
     */
    resetAll(){
        this.complaitManageVo.complaintDuty = null;
        this.complaitManageVo.bigCatalogId = null;
        this.complaitManageVo.smallCatalogId = null;
    }
}

