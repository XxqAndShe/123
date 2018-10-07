import {Component, OnInit, Input} from '@angular/core';
import {API} from "../../../lib/api/api";

@Component({
    selector: 'abnormal-msg',
    templateUrl: './abnormal-msg.component.html',
    styleUrls: [
        './abnormal-msg.component.css'
    ]
})
export class AbnormalMsgComponent implements OnInit{

    //选中行数据
    @Input() selectLineInfo;
    abnormalSale : string;

    constructor(public api: API) {

    }

    columns: any = [];
    initColumns(): void{
        this.columns.push({
            field: "abnormalNum",
            header: '异常编号',
            sortable: true,
            width: '200px'
        });
        this.columns.push({
            field: "abnormalBigType",
            header: '异常类型',
            sortable: true
        });

        this.columns.push({
            field: "abnormalSmallType",
            header: '异常小类',
            sortable: true
        });

        this.columns.push({
            field: "describe",
            header: '异常描述',
            sortable: true
        });

        this.columns.push({
            field: "abnoHandleSts",
            header: '异常状态',
            sortable: true
        });

        this.columns.push({
            field: "abnormalResult2",//abnormalResult
            header: '处理结果',
            sortable: true,
            link: true
        });

        this.columns.push({
            field: "abnormalArbitrations2",//abnormalArbitrations
            header: '仲裁结果',
            sortable: true,
            link: true
        });

        this.columns.push({
            field: "feedbackMan",
            header: '反馈人',
            sortable: true
        });
        this.columns.push({
            field: "deptName",
            header: '登记部门',
            sortable: true
        });

        this.columns.push({
            field: "registerPerson",
            header: '登记人',
            sortable: true
        });
        this.columns.push({
            field: "registerTime",
            header: '登记时间',
            sortable: true
        });
    }

    ngOnInit(){
        this.abnormalSale = "abnormalSale";

        this.initColumns();

        this.selFindAbnormal();
    }


    dataFindAbnormal: any = {};
    /**
     * 取异常信息
     */
    selFindAbnormal() {
        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});

        let taskId=selectRow['id'] || selectRow['taskID'];

        let waybillId=selectRow['waybillId'] || selectRow['dispatchTaskTitle'];

        if(!taskId){
            throw new Error('taskId 不能为空');
        }

        if(!waybillId){
            throw new Error('waybillId 不能为空');
        }

        let qryParams={
            "taskID":taskId,
            "waybillId":waybillId
        };

        this.api.call("TaskDetailContorller.findAbnormal",
            {first: 0, rows: 10},qryParams).ok(json => {
            this.dataFindAbnormal = json.result
        });

/*        let selectRow=this.selectLineInfo && this.selectLineInfo[0] || (this.selectLineInfo || {});
        this.api.call("TaskDetailContorller.findAbnormal",
            {
                first: 0, rows: 10},
            {
                taskID: selectRow.id,waybillId: selectRow.waybillId
            }).ok(json => {
            let result = json.result || {};
            this.dataFindAbnormal = result;
            console.info("异常日志");
            console.info(result);
        });*/

    }
    isshowExceptionWin: boolean=false;
    isshowArbitrationWin: boolean=false;


    selectionRow;
    cellClick(cell){
        this.selectionRow=cell.row;
        //console.log(this.selectionRow, 'this.selectionRow');
        if(cell.field === 'abnormalResult2'){
            this.isshowExceptionWin = true;
        }
        if(cell.field === 'abnormalArbitrations2'){
            this.isshowArbitrationWin = true;
        }
    }
    hideWin(){
        this.isshowExceptionWin=false;
        this.isshowArbitrationWin=false;
    }
}
