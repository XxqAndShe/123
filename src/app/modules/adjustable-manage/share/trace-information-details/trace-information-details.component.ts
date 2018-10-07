import {Component, Input, OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
@Component({
    selector: 'trace-information-details',
    templateUrl: './trace-information-details.component.html',
    styleUrls: [
        './trace-information-details.component.css'
    ]
})
export class traceInformationDetailsComponent {
    //选择行数据
    @Input() selectLineInfo;
    @Input() trackInfo;

    constructor(public api: API) {
    }

    ngOnInit() {
        // this.initColumns();
        // this.queryGoods();
    }

// 详情信息里面的表格
//     columns: any = [];
//
//     initColumns(): void {
//         this.columns.push({
//             field: "goods",
//             header: '商品名称',
//             sortable: true
//         });
//
//         this.columns.push({
//             field: "goodsServiceType",
//             header: '服务类型',
//             sortable: true
//         });
//
//         this.columns.push({
//             field: "valueCharge",
//             header: '声明价值',
//             sortable: true
//         })
//     }
//     data: any = {};

    /**
     * 取品名
     */
    // queryTrack() {
    //     let selectRow = this.selectLineInfo && this.selectLineInfo[0] || this.selectLineInfo;
    //
    //     let taskId = selectRow['id'];
    //
    //     let waybillId = selectRow['waybillId'];
    //
    //     let qryParams = {
    //         "taskID": taskId,
    //         "waybillId": waybillId
    //     }
    //
    //     this.api.call("TaskDetailContorller.findWaybillGoods", qryParams).ok(json => {
    //         this.data = json.result

    //     }).fail(err => {
    //         //console.log(err);
    //     });
    // }
}