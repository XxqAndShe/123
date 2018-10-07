import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {modalAnimation} from "../../animation/modalAnimation.animation";
import {API} from "../../lib/api/api";

@Component({
    selector: 'detail-modal',
    templateUrl: './detail-modal.component.html',
    styleUrls: [
        './detail-modal.component.css'
    ],
    animations: [
        modalAnimation
    ]
})

export class WaybillDetailModalComponent implements OnInit {
    @Output() closeModal = new EventEmitter<any>();


    //选择行数据
    @Input() selectLineInfo;
    @Input() flag;

    constructor(public api: API) {

    }

    // 切换标签
    public infoTypeActive: string;

    // 进度
    public items: MenuItem[];

    // 总进度
    totalActiveIndex: number = 0;

    //总的任务状态
    totalTaskState: any;

    //任务状态下面的时间数组
    timeArr: any[];

    close() {
        this.closeModal.emit();
    }

    ngOnInit() {
        //刷新节点信息
        this.selNOdeValue();
        this.selNOdeTimeValue();

        //alert("xxxxxxxxxxxx");
        // 判断任务状态
        if (this.totalTaskState === '开单') {
            //this.totalActiveIndex = 0;
        }
        if (this.totalTaskState === '干线开始') {
            //this.totalActiveIndex = 1;
        }

        this.infoTypeActive = 'xqxx';
        this.items = [
            {
                label: '开单',
            },
            {
                label: '干线开始',
            },
            {
                label: '干线结束',
            },
            {
                label: '分配',
            },
            {
                label: '受理',
            },
            {
                label: '预约',
            },
            {
                label: '提货',
            },
            {
                label: '签收',
            }
        ];

    }

    // 标签切换
    selectInfoPanel(type): void {
        this.infoTypeActive = type;
        switch (type) {
            case 'xqxx':
                //alert("test");
                break;
            case 'gjxx':
                //alert("gjxx");
                break;
            case 'ycxx':
                //alert("ycxx");
                break;
            case 'shxx':
                //alert("shxx");
                break;
            case 'gzxx':
                //alert("gzxx");
                break;
        }
    }

    dataNode: any = {};
    /**
     * 显示运单信息
     */
    selNOdeValue() {

        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let taskId=selectRow['id'] || selectRow['taskID'];

        let waybillId=selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        let qryParams={
            "taskID":taskId,
            "waybillId":waybillId
        }
        this.api.call("TaskDetailContorller.findInstallTaskNode",qryParams).ok(json => {
            let result = json.result || {};
            console.info(result)
            if (result) {
                this.dataNode = result;
            }
        });
    }

    dataNodeTime: any = {};
    /**
     * 取节点时间
     */
    selNOdeTimeValue() {
        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || this.selectLineInfo;

        let taskId=selectRow['id'];

        let waybillId=selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        let qryParams={
            "taskID":taskId,
            "waybillId":waybillId
        }

        this.api.call("TaskDetailContorller.findWaybillNodeTime",qryParams).ok(json => {
            //console.log("findWaybillNodeTime1");
            this.dataNodeTime = json.result;
            this.totalActiveIndex = this.dataNodeTime.nodeSort;
            this.timeArr= json.result.dataNode;
            //console.log("findWaybillNodeTime2");
        }).fail(err => {
            //console.log(err);
        });
    }

    modalState: string = 'out';
    showDetailModal: boolean = false;

    displayModal() {
        let that = this;
        this.showDetailModal = true;
        setTimeout(function () {
            that.modalState = 'in';
        }, 0);
    }

    closeTaskModal() {
        let that = this;
        this.modalState = 'out';
        setTimeout(function () {
            that.showDetailModal = false;
        }, 200);
    }

    isShowPanel: boolean=false;
    appointmentDetails:any = {};
    appointmentInfo:any=[];
    showPanel(){
        //有时传入对象有时传入数组,需要判断,否则有些页面无法获取
        this.selectLineInfo=this.selectLineInfo.length?this.selectLineInfo[0]:this.selectLineInfo;
        this.appointmentDetails.taskID = this.selectLineInfo.id;
        this.appointmentDetails.waybillId = this.selectLineInfo.waybillId || this.selectLineInfo.dispatchTaskTitle;

        this.api.call("taskDetailContorller.findAppointment",{first: 0, rows: 10}, this.appointmentDetails).ok(json => {
            this.appointmentInfo = json.result.content;
        }).fail((err) => {

        });
        this.isShowPanel = true;
    }
    hidePanel(){
        this.isShowPanel = false;
    }

}
