/*tslint:disable*/

import {Component, forwardRef, Input, Output, EventEmitter} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AreaService} from "../../app-service/area.service";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AreaSelectComponent),
    multi: true
};

@Component({
    templateUrl: "./area-select.component.html",
    styleUrls: ["./area-select.component.css"],
    selector: "area-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AreaSelectComponent implements ControlValueAccessor {
    /**
     * 显示值的标签
     */
    @Input()
    label: any;
    @Input()
    level: any; //控制选择区域的级别
    @Input()
    width: any;
    @Input()
    border;

    @Output()
    onChange = new EventEmitter();

    constructor(public areaService: AreaService) {
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

    onChangeHandler($event) {
        console.log($event)
        this.onChange.emit($event);
    }

    dataHandler: Function = this.areaService.selectBoxHandler();

    labelHandler: Function = this.areaService.selectBoxLabelHandler();
}
