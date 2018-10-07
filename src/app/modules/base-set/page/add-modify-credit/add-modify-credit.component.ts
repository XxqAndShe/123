import {Component, Output, EventEmitter, NgModule,OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {GrowlModule} from "primeng/components/growl/growl";
import {API} from "../../../../share/lib/api/api";

@Component({
    selector:'add-modify-credit',
    templateUrl: './add-modify-credit.component.html',
    styleUrls: [
        './add-modify-credit.component.css',
        '../base-set-common.css'
    ]
})
export class AddModifyCreditComponent implements OnInit{
    msgs:any;//提示弹窗
    assessment:string;//考核项下拉框双向绑定
    setDescription:string;//规则设置
    ruleDescription:string;//规则说明
    detailFun:string;//规则说明函数
    @Output() isReturnCredit=new EventEmitter();
    @Output() notReturnCredit=new EventEmitter();
    constructor(public api:API){}

    ngOnInit(){
        this.assessment = "";//默认是选择
    }
    /**
     * 类似checkbox是否选中
     */
    /*保存*/
    preservation(){
        if ("" == this.assessment) {
            this.showSuccess("warn", "提示", "请选择规则类型！");
            return;
        }
        if(this.setDescription == undefined || this.setDescription ==""){
            this.showSuccess("warn","提示","设置规则输入不能为空！");
            return;
        }
        if (!this.setDescription.trim().includes(this.assessment, 0)) {
            this.showSuccess("warn", "提示", "请输入js函数：function " + this.assessment + "(){}");
            return;
        }
        if(this.ruleDescription == undefined || this.ruleDescription ==""){
            this.showSuccess("warn","提示","规则说明输入不能为空！");
            return;
        }
        ////console.log(this.KPIAssessment);

        this.api.call("basicSettingController.saveRule", {
            ruleType: this.assessment,
            content: this.setDescription,
            remark: this.ruleDescription
        }) .ok(data => {
            //console.log(data);
            this.showSuccess("success", "提示", "操作成功！");
            this.isReturnCredit.emit(true);
        }).fail(data => {
            //console.log(data);
            debugger;
            let code = data.code;
            if (code != null && code == -9999) {
                this.showSuccess("error", "提示", "请先登录！");
                return;
            }
            this.showSuccess("error", "提示", "添加规则失败！");
        });
    }

    returnCredit() {
         this.notReturnCredit.emit();
    }
    changeValue(e){
        debugger;
        //console.log(e);//e是下拉框的value值
        this.showLasterRule(e);
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

    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}

@NgModule({
    imports: [CommonModule,FormsModule,GrowlModule],
    exports: [AddModifyCreditComponent],
    declarations: [AddModifyCreditComponent]
})
export class AddModifyCreditModule {
}