import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GoodSelectComponent),
    multi: true
};

@Component({
    selector: 'good-select',
    templateUrl: './good-select.component.html',
    styleUrls: ['./good-select.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class GoodSelectComponent implements OnInit {

    /**
     * 数据
     */
    suggestions: any[];

    @Input()
    defaultLabel: string = "请选择…";
    @Input()
    multiSelect: boolean = false;
    @Input()
    width: string = "";
    @Input()
    height: string = "";
    @Input()
    valueField: string="";
    @Input()
    styleClass: string;

    constructor(public api: API) {
    }

    ngOnInit() {
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
        let vv = v && v.name?v.name:v;
        this.innerValue = vv;
        console.info(v)
        if(this.valueField){
            // let _value=v[this.valueField]?v[this.valueField]:v;
            this.onChangeCallback(v[this.valueField]);
        }else{
            this.onChangeCallback(vv);
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

        let pageParms = {"first": 0, "rows": 9999};
        this.api.call("abnormalOtherHandleController.waybillGoodsQuery", pageParms, {
            name: value
        }).ok(json => {
            let result: any = json.result && json.result.content || [];
            this.suggestions = result || [];
        }).fail(err => {
            throw new Error(err);
        });
    }

}
