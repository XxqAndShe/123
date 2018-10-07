import {Component, OnInit} from "@angular/core";
import {API} from "app/share/lib/api/api";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-task-add',
    templateUrl: './task-add.component.html',
    styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {
    orderIds: string = '';
    msgs: any = [];
    data: any[] = [{
        "waybillID": ""
    }];

    constructor(public api: API, public datePipe: DatePipe) {
    }

    ngOnInit() {
    }


    async query() {
        this.data = [];
        let orderIds = this.orderIds || '';
        if (!orderIds) {
            return this.msgs.push({severity: 'info', summary: '提示', detail: '请填写运单号'})
        }
        orderIds = this.orderIds.trim().replace(/，/g, ',');
        orderIds = orderIds.replace(/\n/g, ',').replace(/,,/g, ',');
        let arr = orderIds.split(',');
        for (let id of arr) {
            await this.request(id.trim());
        }
    }

    /**
     * 同步请求
     * @param waybillId
     */
    request(waybillId) {

        let params = {
            "waybillId": waybillId
        };
        // 天猫核销状态检查
        this.api.call("taskDetailContorller.taskAdd", params).ok(json => {
            let res = json.result || {};
            if (res.results) {
                this.data.push(res.results[0]);
            }
        }).fail(err => {
            this.msgs.push({severity: 'error', summary: '接口调用失败', detail: err});
        });
    }


}
