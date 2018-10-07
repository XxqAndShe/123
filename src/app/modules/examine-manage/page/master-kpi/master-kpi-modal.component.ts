import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {ApiService} from "../../../../share/app-service/api-service";

@Component({
    selector: 'master-kpi-modal',
    templateUrl: './master-kpi-modal.component.html',
    styleUrls: [
        './master-kpi-modal.component.css'
    ]
})
export class MasterKpiModalComponent implements OnInit{
    startDate: any;
    endDate: any;
    date: any;
    @Output() closeModal=new EventEmitter<boolean>();
    @Input() selectionRow; //父组件传过来的数据
    columns: any[] = [];
    data:any;
    loading:boolean;
    initColumns=[
        this.columns.push({
            field: 'workerName',
            header: '师傅姓名',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'waybillId',
            header: '运单号',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'serviceType',
            header: '服务类型',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'taskStatus',
            header: '任务状态',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'writeDate',
            header: '任务时间',
            sortable: true,
            filter: true
        }),
        // this.columns.push({
        //     field: 'sl',
        //     header: '受理及时',
        //     sortable: true,
        //     filter: true
        // }),
        this.columns.push({
            field: 'reservationRemain',
            header: '预约及时',
            sortable: true,
            filter: true
        }),
        // this.columns.push({
        //     field: 'th',
        //     header: '提货及时',
        //     sortable: true,
        //     filter: true
        // }),
        this.columns.push({
            field: 'ifInstallationCompletionStr',
            header: '安装及时',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'installationCompletion48Reamin',
            header: '48小时安装完成',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'ifInstallationCompletionStr',
            header: '是否安装完成',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'ifDamageStr',
            header: '是否破损',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: 'ifWriteOffStr',
            header: '是否核销',
            sortable: true,
            filter: true
        }),
        // this.columns.push({
        //     field: 'canno',
        //     header: '核销单号',
        //     sortable: true,
        //     filter: true
        // }),
        // this.columns.push({
        //     field: 'iscomplain',
        //     header: '是否投诉',
        //     sortable: true,
        //     filter: true
        // })
    ];

    ngOnInit(){
        this.api.report().call("userWorkerController.listDetail",{first:0,rows:10},{workerMobile:this.selectionRow.mobile}).ok(data => {
            console.log(data)
            this.data = data.result;
        }).fail(fail => {

        });

    }

    constructor(public datePickerService: DatepickerService,public api:ApiService){}
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";

    close(){
        this.closeModal.emit(null);
    }
    doSearch(){
        this.loading = true;
        this.api.report().call("userWorkerController.listDetail",{first:0,rows:10},{workerMobile:this.selectionRow.mobile,startDate:this.startDate,endDate:this.endDate}).ok(data => {
            this.loading = false;
            this.data = data.result;
        }).fail(fail => {
          this.loading = false;
        });
    }
    load(event){
        this.api.report().call("userWorkerController.listDetail",event,{workerMobile:this.selectionRow.mobile,zz:1}).ok(data => {
            console.log(data)
            this.data = data.result;
        }).fail(fail => {

        });
    }
}
