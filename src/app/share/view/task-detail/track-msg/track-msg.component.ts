import {Component, OnInit, Input} from '@angular/core';
import {API} from "../../../lib/api/api";

@Component({
    selector: 'task-track-msg',
    templateUrl: './track-msg.component.html',
    styleUrls: [
        './track-msg.component.css'
    ]
})
export class TaskTrackMsgComponent implements OnInit {

    //选中行数据
    @Input() selectLineInfo:any[]=[];

    taskTracList = [];
    columns: any = [];

    constructor(public api: API) {
    }

    initColumns(): void {

        this.columns.push({
            field: 'trackedTime',
            header: '上次跟踪时间',
            sortable: true
        });
        this.columns.push({
            field: 'operator',
            header: '跟踪人',
            sortable: true
        });
        this.columns.push({
            field: 'remark',
            header: '备注',
            sortable: true
        });
        this.columns.push({
            field: 'alertTime',
            header: '下次跟踪时间',
            sortable: true
        });
    }

    ngOnInit() {
        this.initColumns();
    }

    /**
     * 获取跟踪信息
     */
    load(page): any {
        let record=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        let queryId= record['taskID'] || record['id'];
        if(!queryId){
            throw new Error('id 不能为空');
        }
        this.api.call("TaskDetailContorller.findTrack", page, {
            //这里taskID 不允许修改，会导致查询 不到数据 ！
            taskID:  record.taskID || record.id,
            //调度任务
            //task/abnormal/abnormalArbitration
            TrackType: "task"
        }).ok(json => {
            //debugger;
            ////console.log("----" + json);
            this.taskTracList = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }
}
