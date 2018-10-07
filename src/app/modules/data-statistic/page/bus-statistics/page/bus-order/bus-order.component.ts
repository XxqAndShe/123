import {Component} from "@angular/core";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {BusOrder} from "../../vo/bus-order.vo";
import {getTwelveMonth} from "../../../../../../share/utils/DateUtil";
@Component({
    templateUrl: './bus-order.component.html',
    styleUrls: ['./bus-order.component.css']

})
export class BusOrderComponent {
    public BusOrder: BusOrder;
    // nav插件引用设置
    navs = ["商家排名", "商家数量趋势", "商家订单统计", "商家账单支出趋势统计"];
    navHrefs = [
        'modules/data-statistic/bus-statistics/bus-ranking',
        'modules/data-statistic/bus-statistics/merchant-quantity',
        'modules/data-statistic/bus-statistics/bus-order',
        'modules/data-statistic/bus-statistics/expenditure-trends',

    ];
    curIndex = 2;

    chanCurIndex(index: number) {
        this.curIndex = index;
    }

    tableData: any = {};
    isSelect = false;
    columns: any[] = [];
    data: any[] = [];
    selectionRow: any[] = [];
    msgs: any;
    twelveMonth: any;
    loading:any;

    //当前查询分页信息
    curEvent: any;
    //默认分页信息
    defaultPage = {first: 0, rows: 10}

    constructor(public api: ApiService) {
    }

    ngOnInit($event): void {
        this.BusOrder = new BusOrder();
        this.BusOrder.statisticalMonth = getTwelveMonth()[1];
        //this.tableData=TableDataTest;
        this.twelveMonth = getTwelveMonth();
        // var d = new Date();
        // d.setTime(-30);
        // this.BusStatistics.statisticalMonth= d.toString();
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /*查询*/
    doSearch(): void {
        let statisticalMonth = this.BusOrder.statisticalMonth;

        if (!statisticalMonth) {
            this.showSuccess("warn", "提示", "请输入需要统计的月份");
            return;
        }
        this.loading = true;
        this.load();
    }

    /**
     * 表格加载
     * @param $event
     */
    load($event?:any) {
        $event=$event?$event:this.defaultPage;
        let statisticalMonth = this.BusOrder.statisticalMonth;
        this.api.core().call("BusinessmenContraller.findBusinessmenOrder", $event, {
            strMonth: statisticalMonth,
            shipperId: this.BusOrder.shipperCode
        }).ok(data => {
            this.tableData = data.result || {};
            this.loading = false;
        }).fail(data => {
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                this.showSuccess("warn", "提示", "系统异常请联系管理员");
            }
            this.loading = false;
        });
    }

    //行选择事件
    onRowSelect($event:any) {

    }

}
