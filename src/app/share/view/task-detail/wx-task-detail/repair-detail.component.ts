import {Component, EventEmitter, Output, Input, OnInit} from "@angular/core";
import {MenuItem} from "primeng/primeng";
import {API} from "../../../lib/api/api";
import {VTaskRepairDeatils} from "../../../../modules/sale-center/page/scheduling/vo/task-repair-details.vo";
import {isUndefined} from "util";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'repair-detail',
    templateUrl: './repair-detail.component.html',
    styleUrls: [
        './repair-detail.component.css'
    ]
})

export class RepairDetailComponent implements OnInit {
    @Input() selectedRowData;
    @Input() selectLineInfo;
    @Output() closeModal = new EventEmitter<any>();
    // 切换标签

    RowAndLineData: any;

    public infoTypeActive: string;
    // 进度
    public items: MenuItem[];

    totalActiveIndex: number = 4; // 总进度

    //任务状态下面的时间数组
    // timeArr: any[] = [];

    constructor(public api: API) {
    }

    close() {
        this.closeModal.emit();
    }

    ngOnInit() {
        this.RowAndLineData = this.selectedRowData || this.selectLineInfo;
        this.infoTypeActive = 'rwxx';
        this.items = [
            {
                label: '订单生成',
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
                label: '维修',
            }
        ];

        this.getDetailsInfo();
    }

    public detailsVo: VTaskRepairDeatils = new VTaskRepairDeatils();

    /**
     * 获取详情信息
     */
    getDetailsInfo() {
        var  id;
       if (isNullOrUndefined(this.selectedRowData)) {
           id = this.selectedRowData.taskID || this.selectLineInfo.id;
       } else {
           id = this.selectedRowData.taskID || this.selectedRowData.id;
       }
        this.api.call("AftermarketTaskController.getRepairTaskInfo", {taskId: id}).ok(json => {
            //debugger;
            ////console.log("----" + json);
            this.detailsVo = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }

    // 标签切换
    selectInfoPanel(type): void {
        this.infoTypeActive = type;
        switch (type) {
            case 'xqxx':

                break;
            case 'gjxx':    //轨迹信息
                break;
            case 'ycxx':
                //alert("ycxx");
                break;
            case 'shxx':
                //alert("shxx");
                break;
            case 'gzxx':    //跟踪信息
                break;
        }
    }

    isShowPanel: boolean=false;
    appointmentInfo:any = [];
    appointmentDetails:any = {};
    showPanel(){
        //有时传入对象有时传入数组,需要判断,否则有些页面无法获取
        this.selectedRowData=this.selectedRowData.length?this.selectedRowData[0]:this.selectedRowData;
        this.appointmentDetails.taskID = this.selectedRowData.taskID || this.selectedRowData.id;
        // this.appointmentDetails.waybillId = this.selectedRowData.waybillId;//

        this.api.call("taskDetailContorller.findAppointmentSh",{first: 0, rows: 10}, this.appointmentDetails).ok(json => {
            this.appointmentInfo = json.result.content;
        }).fail((err) => {

        });
        this.isShowPanel = true;
    }
    hidePanel(){
        this.isShowPanel = false;
    }
}
