import {Component, OnInit, Input} from '@angular/core';
import {API} from "../../../lib/api/api";

@Component({
    selector: 'path-msg',
    templateUrl: './path-msg.component.html',
    styleUrls: [
        './path-msg.component.css'
    ]
})
export class PathMsgComponent implements OnInit {

    @Input() selectLineInfo;
    columns: any = [];//轨迹信息表格
    //默认分页信息
    defaultPage = {first: 0, rows: 10};
    constructor(public api: API) {
    }

    initColumns(): void {
        this.columns.push({
            field: "deptName",
            header: '网点名称',
            sortable: true
        });
        this.columns.push({
            field: "waybillID",
            header: '运单号',
            sortable: true
        });
        this.columns.push({
            field: "logType",
            header: '日志类型',
            sortable: true
        });
        this.columns.push({
            field: "operateInfo",
            header: '操作信息',
            sortable: true
        });
        this.columns.push({
            field: "operator",
            header: '操作人',
            sortable: true
        });

        this.columns.push({
            field: "operateDate",
            header: '操作时间',
            sortable: true
        });
    }

    ngOnInit() {
        this.initColumns();
    }

    installTaskLog: any = {};

    load($event?:any) {
        $event=$event?$event:this.defaultPage;
        this.findInstallTaskLog($event);
    }

    /**
     * 取轨迹日志
     */
    findInstallTaskLog(page) {
        let selectRow = this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let taskId = selectRow['id'];

        let waybillId = selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        if (!taskId) {
            throw new Error('taskId 不能为空');
        }

        let qryParams = {
            "taskID": taskId,
            "waybillId": waybillId
        }

        this.api.call("TaskDetailContorller.findInstallTaskLog",
            page, qryParams).ok(json => {
            let result = json.result || {};
            //console.info(result)
            this.installTaskLog = result;
        });
    }

}
