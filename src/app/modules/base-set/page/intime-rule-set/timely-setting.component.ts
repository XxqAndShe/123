/**
 * Created by Administrator on 2017/5/3.
 */
import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";

@Component({
    selector: 'timely-setting',
    templateUrl: './timely-setting.component.html',
    styleUrls: [
        './timely-setting.component.css',
        '../base-set-common.css'
    ]
})

export class timelySettingComponent implements OnInit {

    msgs: any;//提示弹窗
    KPIAssessment: any;//KPI下拉框双向绑定;
    setDescription: string = "";//设置规则
    ruleDescription: any;//说明规则
    detailFun: any;//规则说明函数
    @Output() isReturnCredit = new EventEmitter();
    @Output() notReturnCredit = new EventEmitter();

    constructor(public api: API) {
    }

    /**
     * 下拉框选中事件*/
    changeValue(e) {
        //console.log(e);//e为选中value值
        this.showLasterRule(e);
    }

    /**
     * 类似checkbox是否选中
     */
    /*保存*/
    preservation() {
        if (this.KPIAssessment == "") {
            this.showSuccess("warn", "提示", "请选择规则类型！");
            return;
        }
        if (this.setDescription == undefined || this.setDescription == "") {
            this.showSuccess("warn", "提示", "设置规则输入不能为空！");
            return;
        }
        if (!this.setDescription.trim().includes(this.KPIAssessment, 0)) {
            this.showSuccess("warn", "提示", "请输入js函数：function " + this.KPIAssessment + "(){}");
            return;
        }
        if (this.ruleDescription == undefined || this.ruleDescription == "") {
            this.showSuccess("warn", "提示", "规则说明输入不能为空！");
            return;
        }
        //console.log("----------KPIAssessment:" + this.KPIAssessment);
        this.api.call("basicSettingController.saveRule", {
            ruleType: this.KPIAssessment,
            content: this.setDescription,
            remark: this.ruleDescription
        }) .ok(data => {
            //console.log(data);
            this.showSuccess("success", "提示", "操作成功！");
            this.isReturnCredit.emit(true);
        }).fail(data => {
            //console.log(data);
            // debugger;
            let code = data.code;
            if (code != null && code == -9999) {
                this.showSuccess("error", "提示", "请先登录！");
                return;
            }
            this.showSuccess("error", "提示", "添加规则失败！");
        });
    }

    /**
     * 取消*/
    returnCredit() {
        this.notReturnCredit.emit();
        //console.log("12334");
    }

    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    /**
     * 获取最新的规则脚本。
     * @param ruleType
     */
    showLasterRule(ruleType) {
        this.api.call("BasicSettingController.showLasterRule", {ruleType:ruleType}).ok(data => {
            //console.log(data);
            debugger;
            this.detailFun = data.result.jsContent;
        }).fail(data => {
            //console.log("----fail");
            //console.log(data);
        });
    }


    ngOnInit() {
        this.KPIAssessment = "";//默认请选择
    }
}
