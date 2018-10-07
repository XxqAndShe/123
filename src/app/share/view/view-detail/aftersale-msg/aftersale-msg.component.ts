import {
    Component, OnInit, style, state, trigger, transition, animate, Output, EventEmitter,
    Input, OnChanges
} from '@angular/core';
import {API} from "../../../lib/api/api";
import {modalAnimation} from "../../../animation/modalAnimation.animation";
import {AbnormalTaskRequestVo} from "../../../../modules/sale-center/page/abnormal-sale/vo/abnormal-task-request.vo";
import {ShowOrHideMaskService} from "../../../app-service/show-or-hide-mask.service";
import {AbnormalTaskService} from "../../../../modules/sale-center/page/abnormal-sale/service/abnormal-task.service";

@Component({
    selector: 'aftersale-msg',
    templateUrl: './aftersale-msg.component.html',
    styleUrls: [
        './aftersale-msg.component.css'
    ],
    animations: [
        trigger('modalState', [
            state('in', style({
                right: '0'
            })),
            state('out', style({
                right: '-1040px'
            })),
            transition('out => in', animate('200ms ease-in')),
            transition('in => out', animate('200ms ease-out'))
        ]),
        modalAnimation
    ]
})
export class AftersaleMsgComponent implements OnInit {
    public abnormalTaskRequestVo: AbnormalTaskRequestVo;
    taskType: string;
    //选中行数据
    @Input() selectLineInfo;
    @Input() flag;

    selected: any = 0;//用于显示选择数据条数
    selections: any[] = [];
    data: any;

    //用于右侧弹出窗口的变量
    isModuleDisplayArr = new Array();
    isModuleDisplayArr1 = new Array(); //用以控制动画
    rowData: any;
    isshowExceptionWin: boolean = false;//用于控制异常信息窗口显示隐藏
    curModalIndex = -1;
    /*公共弹窗提示*/
    msgs: any;


    public controlException: string = 'hide'; // 异常信息弹框

    @Output() showTaskModal = new EventEmitter()


    abnormalSale: string;

    constructor(public api: API, public abnormalTaskService: AbnormalTaskService,
                public mask: ShowOrHideMaskService) {

    }

    ngOnInit() {
        this.abnormalSale = "abnormalSale";
        this.initColumns();
        this.taskType = 'All';//任务类型默认全部
        this.abnormalTaskRequestVo = new AbnormalTaskRequestVo();
    }

    hideDialog() {
        this.controlException = 'hide';
        this.isshowExceptionWin = false;
    }

    public doSearch(): any {
        this.load({"first": 0, "rows": 10})

    }

    columns: any[] = [];

    initColumns(): void {
        this.columns.push({
            field: "title",
            header: '任务单号',
            sortable: true,
            link: true
        });
        this.columns.push({
            field: "abnormalNum",
            header: '异常编号',
            sortable: true,
            link: true
        });
        this.columns.push({
            field: "taskType",
            header: '任务类型',
            sortable: true
        });
        this.columns.push({
            field: "taskStatus",
            header: '任务状态',
            sortable: true
        });
    }

    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    rowSelect($event): any {
        this.rowData = $event[0];
        this.selections = $event[0];
        this.selectLineInfo = $event;
        this.selectLineInfo[0].whatType = "task";//跟踪判断
        this.selected = $event;
        let id = this.rowData.id;
        this.abnormalTaskService.rowData = this.rowData;
    }

    load(page) {
        //this.data = this.test();
        this.queryData("All");
    }

    closeModal(i) {
        var that = this;
        this.isModuleDisplayArr1[i] = false;
        setTimeout(function () {
            that.isModuleDisplayArr[i] = false;
        }, 200);
    }

    cellClick(cell: any) {
        //console.log(cell.row);
        this.rowData = cell.row;
        this.selectLineInfo = cell.row;
        this.abnormalTaskService.rowData = this.rowData;

        if (cell.field === 'abnormalNum') {
            this.isshowExceptionWin = true;
        }
        if (cell.field === 'title') {
            if (cell.row.taskType === '维修任务') {
                let that = this;
                this.isModuleDisplayArr[0] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[0] = true;
                }, 0);
                this.curModalIndex = 0;
            }
            else if (cell.row.taskType === '返货任务') {
                if(this.flag === 'carrier'){
                    let that = this;
                    this.isModuleDisplayArr[5] = true;
                    setTimeout(function () {
                        that.isModuleDisplayArr1[5] = true;
                    }, 0);
                    this.curModalIndex = 5;
                }else{
                    let that = this;
                    this.isModuleDisplayArr[1] = true;
                    setTimeout(function () {
                        that.isModuleDisplayArr1[1] = true;
                    }, 0);
                    this.curModalIndex = 1;
                }

            } else if (cell.row.taskType === '补件任务') {
                let that = this;
                this.isModuleDisplayArr[3] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[3] = true;
                }, 0);
                this.curModalIndex = 3;
            }
            else if (cell.row.taskType === '其他') {
                let that = this;
                this.isModuleDisplayArr[4] = true;
                setTimeout(function () {
                    that.isModuleDisplayArr1[4] = true;
                }, 0);
                this.curModalIndex = 4;
            } else {
                this.showSuccess("info", "提示", "请点击维修/返货任务！");
            }
        }
        if (cell.field === 'waybillId') {
            let that = this;
            this.isModuleDisplayArr[2] = true;
            setTimeout(function () {
                that.isModuleDisplayArr1[2] = true;
            }, 0);
            this.curModalIndex = 2;
        }
        if (cell.field === 'abnormalNum') {
            this.controlException = 'show';
        }
        if (cell.field === 'taskNo') {
            this.showTaskModal.emit();
        }
    }

    /**
     * 生成数据
     * taskType:All/fhreturn/repair/part/other
     */
    queryData(taskType) {
        let selectRow = this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        this.api.call("TaskDetailContorller.findAbonrmalTask",
            {first: 0, rows: 10},
            {
                waybillId: selectRow.waybillId || selectRow.dispatchTaskTitle,
                taskType: taskType
            }).ok(json => {
            let result = json.result || {};
            this.data = result;
        });
    }

    //下拉框选择事件
    onChange(taskType) {
        //alert(taskType);

        //刷新数据
        this.queryData(taskType);
    }
}
