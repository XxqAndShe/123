import {Component,OnInit} from "@angular/core";
import {API} from "../../../../../share/lib/api/api";
import {AllArbitrationRequestVo} from "../vo/all-arbitration-request.vo";
@Component({
    selector:"table-grid",
    templateUrl:"./table-grid.component.html",

})
export class TableGridComponent implements OnInit{
    // isSelect = false;
    columns: any[] = [];
    data: any[] = [];
    selectionRow:any[] = [];
    testName:any[] = [];
    // 异常处理
    // public arbqueryRequst : AllArbitrationRequestVo;
    // constructor(
    //     public api: API
    // ) {}
    ngOnInit():void{
        // this.arbqueryRequst = new AllArbitrationRequestVo();
        this.initColumns();

    }

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "id",
            header: "异常编号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vWaybill.waybillId",
            header: "运单号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "",
            header: "收货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "",
            header: "收货手机号码",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "source",
            header: "来源",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "source",
            header: "异常类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "source",
            header: "异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "",
            header: "异常描述",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "发货人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "开单网点",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "目的地",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "登记人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "登记部门",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "dateCreated",
            header: "登记时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "feedbackMan",
            header: "反馈人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "contactWay",
            header: "联系方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "责任方",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "处理方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "处理时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "任务单号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "是否紧急",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "是否回复",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "是否仲裁",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "是否受理",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "跟踪状态",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "跟踪时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDesc",
            header: "跟踪备注",
            sortable: false,
            filter: true
        });
    }
    /**
     *
     * 加载仲裁处理数据列表
     * @param $event
     */
    // load($event): any {
    //     ////console.log(this.arbqueryRequst);
    //    /* this.api.call("AbortionHandleApiController.queryAbortion", $event, this.arbqueryRequst).ok(json => {
    //         this.data = json.result;
    //         ////console.log(json.result);
    //     });*/
    // }

    /**
     * 仲裁处理查询
     * @param vm
     */
    // cmSearch(vm) {
    //     this.arbqueryRequst.dateStart = vm.dateStart;
    //     this.arbqueryRequst.dateEnd = vm.dateEnd;
    //     this.arbqueryRequst.abID = vm.abID;
    //     this.arbqueryRequst.waybillID = vm.waybillID;
    //     this.arbqueryRequst.isArbState = vm.isArbState;
    //     this.arbqueryRequst.trackTime = vm.trackTime;
    //     this.arbqueryRequst.pageNum = vm.pageNum;
    //     this.arbqueryRequst.pageSize = vm.pageSize;
    //     this.arbqueryRequst.bigType = vm.bigType;
    //     this.arbqueryRequst.smallType = vm.smallType;
    //     this.arbqueryRequst.handleStartDate = vm.handleStartDate;
    //     this.arbqueryRequst.handleEndDate = vm.handleEndDate;
    //     this.arbqueryRequst.arbDate = vm.arbDate;
    //     this.arbqueryRequst.source = vm.source;
    //     this.arbqueryRequst.isTrack = vm.isTrack;
    //     this.arbqueryRequst.trackTime = vm.trackTime;
    //     vm.first = 0;
    //     vm.rows = 10;
    //     this.load(vm);
    // }
    // rowSelect($event):any{
    //     this.selectionRow=$event;
    // }

}