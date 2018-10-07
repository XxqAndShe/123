import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../share/app-service/show-or-hide-mask.service';
import {API} from "../../../../share/lib/api/api";
import {TotalMoneyVo} from "../../vo/total-money.vo";


@Component({
    selector: 'master-running',
    templateUrl: './master-running.component.html',
    styleUrls: ['./master-running.component.css']
})
export class MasterRunningComponent implements OnInit, AfterViewInit{
    saleRunning: boolean = false;
    requestParam: any;
    selected: any[] = [];//用于显示选中数据条数
    loading: boolean = false;
    // 控制第一次加载不触发查询组件查询按钮加载表格
    isFirstLoad: boolean = true;

    constructor(public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit(): void {
        this.columns.push({
            field: "companyDepartment",
            header: "所属网点",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "companyDepartmentMobile",
            header: "网点手机",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "masterName",
            header: "师傅姓名",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "masterAccount",
            header: "师傅账号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTotalMoney.totalMoney",
            header: "账户余额",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTotalMoney.canWithdraw",
            header: "可提现",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTotalMoney.inWithdraw",
            header: "提现中",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTotalMoney.cannotWithdraw",
            header: "未出账单",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "vTotalMoney.alreadyWithdrawed",
            header: "已提现",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "totalAmount",
            header: "总金额",
            sortable: false,
            filter: true
        });
        /*this.columns.push({
            field: "referCost",
            header: "总参考成本",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "differential",
            header: "总差价",
            sortable: false,
            filter: true
        });*/
    }

    ngAfterViewInit(){
        this.isFirstLoad = false;
    }
    
    /**
     * 表单组件
     */
    columns: any[] = [];

    data: any[] = [];

    selections: any[] = [];
    msgs: any;
    selectionRow: any[] = []; //选中行
    /**
     * 传值
     */
    masterAccount: string;
    /*masterAccount:string;
     masterName:string;*/

    @Output() selectMasterFlowValue = new EventEmitter<any>();

    //显示右键勾选编辑按钮
    isshowTitle = false;

    showTitle() {
        //this.isshowTitle=!this.isshowTitle;
        this.selectionRow = [];
    }

    isshowWin = false;

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    showWin() {
        if (this.selectionRow.length !== 0) {
            this.mask.show();
            this.isshowWin = true;
        } else {
            this.showSuccess("warn", "警告", "请选择一条数据");
        }
    }

    closeWin(show: boolean) {
        this.isshowWin = false;
    }

    //表格加载及右下角页码改变调用
    load(page): any {
        this.api.call("FinancialCenterController.masterFlowCount", page, this.requestParam).ok(json => {
            this.data = json.result;
            this.loading = false;
        }).fail((err) => {
            this.loading = false;
        });

    }

    /**
     * 导出
     */
    exportCSV($event) {
        this.api.call('FinancialCenterController.masterFlowCount', {
            first: 0,
            rows: 99999999
        }, this.requestParam)
            .ok(data => {
                $event.done($event.grid, data.result.content);
            })
            .fail(err => {
                $event.done(null, null, true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    findMasterFlow(event): any {
        this.loading = true;
        this.requestParam = event;
        if(!this.isFirstLoad) {
            this.load({
                first: 0,
                rows: 10
            });
        }
    }

    rowSelect($event): any {
        let rows = $event[0] ? $event[0] : $event;
        this.masterAccount = rows.masterAccount;
        this.selectMasterFlowValue.emit($event);
        this.selected = $event;
        this.selectionRow.length = this.selected.length;
    }

}
