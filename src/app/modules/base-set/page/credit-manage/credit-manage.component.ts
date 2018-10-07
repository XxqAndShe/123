import {Component, OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";

@Component({
    templateUrl: './credit-manage.component.html',
    styleUrls: [
        './credit-manage.component.css'
    ]
})

export class CreditManageComponent implements OnInit {

    /**
     * 点击新增或者修改
     * @type {boolean}
     */
    isAdd = false;
    msgs: any;
    isAddIf: boolean = false;//信用规则分
    //请求响应数据
    data: any[] = [];
    columns: any[] = [];

    /*
     * 保存
     *
     * */
    isReturnCredit(add: boolean) {
        this.isAdd = add;
        this.isAddIf = false;
        this.showSuccess("success", "提示", "操作成功！");
        this.load({
            first: 0,
            rows: 10
        });
    }

    /*
     * 取消*/
    notReturnCredit() {
        this.isAdd = false;
        this.isAddIf = false;
    }

    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    constructor(public api: API) {
    }

    ngOnInit() {
        this.initColumns()
    }

    // 初始化列
    initColumns(): void {
        this.columns.push({
            field: "name",
            header: "考核项",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "remark",
            header: "规则说明",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "userName",
            header: "操作人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "validTime",
            header: "生效时间",
            sortable: false,
            filter: true
        });
    }

    load(page): any {
        this.api.call("basicSettingController.getRuleList", page, {ruleTypeName: "credit"}).ok(json => {
            ////console.log(json)
            // debugger;
            this.data = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('basicSettingController.getRuleList', {
            first:0,
            rows:99999999
        }, {ruleTypeName: "credit"})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    showOthBtn() {
        this.isAdd = !this.isAdd;
        this.isAddIf = true;
    }

}
