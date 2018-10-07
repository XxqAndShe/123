import {Component, animate, trigger, state, transition, style, OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";

@Component({
    templateUrl: './intime-rule-set.component.html',
    styleUrls: [
        './intime-rule-set.component.css'
    ],
    animations: [
        trigger('modalState', [
            state('in', style({
                right: '-60px'
            })),
            state('out', style({
                right: '-1000px'
            })),
            transition('out => in', animate('200ms ease-in')),
            transition('in => out', animate('200ms ease-out'))
        ])
    ]
})

export class IntimeRuleSetComponent implements OnInit{

    constructor(public api:API){}

    /**
     * 点击新增或者修改
     * @type {boolean}
     */
    isAdd=false;
    isAddIf:boolean = false;
    showOthBtn(){
        this.isAdd=!this.isAdd;
        this.isAddIf = true;
    }

    /*
    * 确认*/
    isReturnCredit(add:boolean){
        this.isAdd=add;
        this.isAddIf = false;
        this.showSuccess("success","提示","操作成功！");
        this.load({
            first: 0,
            rows: 10
        });
    }
    /*
     * 取消*/
    notReturnCredit(){
        this.isAdd= false;
        this.isAddIf = false;
    }

    // 初始化列
    columns: any[] = [];
    msgs:any;//公用提示
    ngOnInit(){
        this.initColumns()
    }
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

    //请求响应数据
    data: any[] = [];

    load(page): any {
        this.api.call("basicSettingController.getRuleList", page, {ruleTypeName:"timely"}).ok(json => {
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
        }, {ruleTypeName:"timely"})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }

    rowSelect($event:any){

    }
}
