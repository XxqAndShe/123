import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {API} from "app/share/lib/api/api";


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MasterSelectComponent),
    multi: true
};

@Component({
    selector: 'master-select',
    templateUrl: './master-select.component.html',
    styleUrls: ['./master-select.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class MasterSelectComponent implements ControlValueAccessor,OnInit {
    /**
     * 师傅数组
     */
    suggestions: any[];

    regExpNum: RegExp = /^[0-9]*$/;

    @Input()
    defaultLabel: string = "请选择…";
    @Input()
    multiSelect: boolean = false;
    @Input()
    width: string = "";
    @Input()
    height: string = "";
    @Input()
    type: String;
    @Input()
    valueField: string = "";
    @Input()
    nameField: string = "name";

    constructor(public api: API) {
    }

    ngOnInit() {
        //测试数据
        // TODO
        this.suggestions = [];
    }


    public onTouchedCallback: () => () => {};
    public onChangeCallback: (_: any) => () => {};
    public innerValue;

    // 获取属性
    get value(): any {
        return this.innerValue;
    };

    // 设置属性，并触发监听器
    set value(v: any) {
        let value = "";
        if (v !== this.innerValue) {
            if (this.type === 'mobile') {
                value = v.mobile ? v.mobile : v;
                this.innerValue = value;
                this.onChangeCallback(value);
            } else if (this.type === 'name') {
                value = v.realName ? v.realName : v;
                this.innerValue = value;
                this.onChangeCallback(value);
            } else {
                let name = v.realName || v;
                let mobile = v.mobile || v;
                if (this.valueField === 'mobile') {

                    if(this.nameField==='mobile'){
                        this.innerValue = mobile;
                    }else{
                        this.innerValue = name;
                    }
                    this.onChangeCallback(mobile);
                } else if (this.valueField === 'name') {
                    if(this.nameField==='mobile'){
                        this.innerValue = mobile;
                    }else{
                        this.innerValue = name;
                    }
                    this.onChangeCallback(name);

                } else {
                    this.innerValue = name;
                    this.onChangeCallback(v);
                }

            }
        }

    }

    // 写入值
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    // 注册变化处理事件
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // 注册触摸事件
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    /**
     * 查询数据
     * @param $event
     */
    queryData($event: any) {
        let value = $event.query;
        let qryParams = {
            realName: "",
            mobile: ""
        }
        if (this.type === 'name') {
            qryParams.realName = value;
        } else if (this.type === 'mobile' || this.regExpNum.test(value)) {
            qryParams.mobile = value;
        } else {
            qryParams.realName = value;
        }

        this.api.call("UserWorkerController.findMasterByNameOrAccount", qryParams).ok(json => {
            if(this.type !== 'name' && this.type !== 'mobile'){
                this.suggestions=json.result || [];
                this.suggestions.forEach(item=>{
                    item.name=item.realName+' '+item.mobile;
                });
            }else{
                this.suggestions = json.result || [];
            }

        })
    }
}
