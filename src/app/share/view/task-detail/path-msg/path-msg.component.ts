import {Component, OnInit, Input} from '@angular/core';
import {API} from "../../../lib/api/api";

@Component({
    selector: 'task-path-msg',
    templateUrl: './path-msg.component.html',
    styleUrls: [
        './path-msg.component.css'
    ]
})
export class TaskPathMsgComponent implements OnInit{

    //选中行数据
    @Input() selectLineInfo;

    columns: any = [];//轨迹信息表格

    taskLogList = []    //任务日志列表

    constructor(public api:API){}

    initColumns(): void{
        this.columns.push({
            field: 'logType',
            header: '日志类型',
            sortable: true
        });
        this.columns.push({
            field: 'operateDate',
            header: '操作时间',
            sortable: true
        });
        this.columns.push({
            field: 'operator',
            header: '操作人',
            sortable: true
        });
        this.columns.push({
            field: 'operateInfo',
            header: '操作信息',
            sortable: true
        })
    }
    ngOnInit(){
        this.initColumns();
    }

    /**
     * 获取轨迹信息
     */
    load(page) : any {
        let record=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let queryId= record['taskID'] || record['id'];
        if(!queryId){
            throw new Error('taskId 不能为空');
        }
        this.api.call("AftermarketTaskController.getTaskLogList", page,{taskId: queryId}).ok(json => {
            ////console.log("----" + json);
            this.taskLogList = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }
}
