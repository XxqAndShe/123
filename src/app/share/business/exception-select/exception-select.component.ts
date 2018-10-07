import {Component, forwardRef, Input, Output, EventEmitter} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AbnormalTypeService} from "../../app-service/abnormal-type.service";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExceptionSelectComponent),
    multi: true
};

@Component({
    selector: "exception-select",
    templateUrl: "./exception-select.component.html",
    styleUrls: ["./exception-select.component.css"],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ExceptionSelectComponent implements ControlValueAccessor {
    /**
     * 显示值的标签
     */
    @Input()
    label: any;

    @Output()
    onChange:EventEmitter<any> = new EventEmitter<any>();

    constructor(public abnormalTypeService: AbnormalTypeService) {
    }

    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public innerValue;

    // 获取属性
    get value(): any {
        return this.innerValue;
    };

    // 设置属性，并触发监听器
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
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
     * 值改变事件
     * @param val
     */
    onValueChange(val) {
       this.onChange.emit(val);
    }

    dataHandler: Function = this.abnormalTypeService.selectBoxHandler();

    labelHandler:Function = this.abnormalTypeService.selectBoxLabelHandler();
}
