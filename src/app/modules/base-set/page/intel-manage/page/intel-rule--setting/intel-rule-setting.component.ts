import {Component, animate, trigger, state, transition, style, OnInit} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";

@Component({
    templateUrl: './intel-rule-setting.component.html',
    styleUrls: [
        './intel-rule-setting.component.css'
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

export class IntelRuleSettingComponent implements OnInit{

    constructor(public api:API){}

    // nav插件引用设置
    navs = ["智能匹配区域管理","智能匹配规则配置","发货人指定师傅管理","提货电话指定师傅管理"];
    navHrefs = [
        'modules/base-set/intel-manage/intel-addr-manage',
        'modules/base-set/intel-manage/intel-rule-manage',
        'modules/base-set/intel-manage/peo-point-master',
        'modules/base-set/intel-manage/addr-point-master'
    ];
    curIndex = 1;
    msgs:any;

    /**
    * 点击新增或者修改
    * @type {boolean}
    */
    isAdd=false;
    showOthBtn(){
        this.isAdd=!this.isAdd;
    }
    /*确定*/
    isReturnCredit(add:boolean){
        this.isAdd=add;
        this.showSuccess("success","提示","操作成功！");
        this.load({
            first: 0,
            rows: 10
        });
    }
    /*取消*/
    notReturnCredit(){
        this.isAdd=false;
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    // 初始化列
    columns: any[] = [];
    ngOnInit(){
        this.initColumns()
    }
    initColumns(): void {
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
            filter: true,
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
        this.api.call("basicSettingController.getRuleList", page, {ruleTypeName:"rule_setting"}).ok(json => {
            this.data = json.result;
        }).fail((err) => {
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
        }, {ruleTypeName:"rule_setting"})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
    rowSelect($event:any){

    }
}
