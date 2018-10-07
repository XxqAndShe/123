import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {ApiService} from "../../../../share/app-service/api-service";

@Component({
    selector: 'shipper-kpi-modal',
    templateUrl: './shipper-kpi-modal.component.html',
    styleUrls: [
        './shipper-kpi-modal.component.css'
    ]
})

export class ShipperKpiModalComponent implements OnInit {
    masterName: any;
    masterNo: any;
    suggestionResult: any;
    loading:boolean;
    @Input()
    data: any;
    @Output() closeModal = new EventEmitter<boolean>();
    @Output() openModal = new EventEmitter<boolean>();
    @Input() selectionRow; //父组件传过来的数据
    columns: any[] = [];
    @Input()
    startDate:any;
    @Input()
    endDate:any;
    initColumns(): void {
        this.columns.push({
            field: 'shipperName',
            header: '发货人',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'waybillId',
            header: '运单号',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'workerName',
            header: '安装师傅',
            sortable: true,
            filter: true
        });
        // this.columns.push({
        //     field: '',
        //     header: '师傅账号',
        //     sortable: true,
        //     filter: true
        // });
        this.columns.push({
            field: 'serviceType',
            header: '服务类型',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'taskStatus',
            header: '任务状态',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'writeDate',
            header: '任务时间',
            sortable: true,
            filter: true
        });
        // this.columns.push({
        //     field: '',
        //     header: '受理及时',
        //     sortable: true,
        //     filter: true
        // }),
        this.columns.push({
            field: 'reservationRemain',
            header: '预约及时',
            sortable: true,
            filter: true
        });
        // this.columns.push({
        //     field: '',
        //     header: '提货及时',
        //     sortable: true,
        //     filter: true
        // }),
        this.columns.push({
            field: 'installationRemain',
            header: '安装及时',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'installationCompletion48Reamin',
            header: '48小时安装完成',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'ifInstallationCompletionStr',
            header: '是否安装完成',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'ifDamageStr',
            header: '是否破损',
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: 'ifWriteOffStr',
            header: '是否核销',
            sortable: true,
            filter: true
        });
        // this.columns.push({
        //     field: '',
        //     header: '核销单号',
        //     sortable: true,
        //     filter: true
        // }),
        // this.columns.push({
        //     field: '',
        //     header: '是否投诉',
        //     sortable: true,
        //     filter: true
        // })
    }

    ngOnInit(): void {
        var that = this;
        this.initColumns();
        this.api.report().call("shipperController.listDetail",{first:1,rows:10}, {idBak:this.selectionRow.idBak,workerName:this.masterName,workerMobile:this.masterNo,startDate:this.startDate,endDate:this.endDate}).ok(data => {
            console.log(data)
            that.data = data.result;
        }).fail(fail => {

        });
        this.selectionRow;
        // this.api.core().call("TaskDetailContorller.listRemainDetail", {}).ok(data => {
        //     console.log(data)
        //     // this.data = {
        //     //     content:data.result
        //     // };
        // }).fail(fail => {
        //
        // });
    }

    constructor(public api: ApiService) {

    }

    close() {
        this.closeModal.emit(null);
    }

    doSearch(event?:any) {
        this.loading = true;
        this.api.report().call("shipperController.listDetail",{
            first:1,rows:10
        }, {idBak:this.selectionRow.idBak,workerName:this.masterName,workerMobile:this.masterNo,startDate:this.startDate,endDate:this.endDate}).ok(data => {
            this.loading = false;
            this.data = data.result;
        }).fail(fail => {
          this.loading = false;
        });
    }

    searchResult($event) {

    }

    load(event) {
        this.api.report().call("shipperController.listDetail",event, {idBak:this.selectionRow.idBak,workerName:this.masterName,workerMobile:this.masterNo,startDate:this.startDate,endDate:this.endDate}).ok(data => {
            console.log(data)
            this.data = data.result;
        }).fail(fail => {

        });
    }
}
