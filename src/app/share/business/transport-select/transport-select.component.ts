import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {API} from "app/share/lib/api/api";


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TransportSelectComponent),
    multi: true
};

@Component({
    templateUrl: "./transport-select.component.html",
    styleUrls: ["./transport-select.component.css"],
    selector: "transporter-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TransportSelectComponent implements ControlValueAccessor,OnInit {
    /**
     * 发货人数组
     */
    suggestions: any[];

    @Input()
    valueField: string = "";
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
    styleClass: String;

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
    set value(value: any) {
        let v = value && value.name?value.name:value;
        if (v !== this.innerValue) {
            if (this.valueField === 'object') {
                this.innerValue = value.label;
                this.onChangeCallback(value);
            }else{
                this.innerValue = v;
                this.onChangeCallback(v);
            }
        }
    }

    // 写入值
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            //console.log(value);
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
    queryTransport($event: any) {
        let value = $event.query;
        this.api.call("commonController.findTransportCompany", {
            name: value
        }).ok(json => {
            let result: any = json.result || [];
            if(this.valueField === 'object'){
                this.suggestions=result;
                this.suggestions.forEach(item=>{
                    item.label=item.name;
                    item.name=item.name+' '+item.mobile;
                });
            }else{
                this.suggestions = result;
            }
        }).fail(err => {
            throw new Error(err);
        });
    }

}