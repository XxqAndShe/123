/*tslint:disable*/
import {
    Component,
    forwardRef,
    OnInit,
    Input,
    AfterViewInit,
    Renderer,
    OnDestroy,
    Output,
    EventEmitter
} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import { ComplaintTypeService } from "app/share/app-service/complaint-select.service";

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ComplaintSelectComponent),
    multi: true
};

@Component({
    selector: "complaint-select",
    templateUrl: "./complaint-select.component.html",
    styleUrls: ["./complaint-select.component.css"],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ComplaintSelectComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    /** * 用于注册数据处理回调函数
     */
    dataHandler: Function = this.complaintTypeService.selectBoxHandler();
    /** * 用于注册数据处理回调函数
     */
    labelHandler:Function = this.complaintTypeService.selectBoxLabelHandler();
    /**
     * 显示值的标签
     */
    @Input()
    label: any;

    @Input()
    showTable: any;

    @Input()
    level: any; //可控制选择的级别

    @Input()
    border;

    @Input()
    multiSelect: boolean = false;

    @Input()
    placeholder;

    @Input()
    width: any;

    @Input()
    height: any;

    @Output()
    onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    clearOthers: EventEmitter<any> = new EventEmitter<any>();

    /**
     * 控制选择框是否显示
     */
    showBox: boolean;
    /**
     * 选择框Tab数组
     */
    selectBoxs: any[] = [];
    /**
     * 当前激活的Tab
     */
    activeIndex: number;


    focus: boolean = false;
    overFlag: boolean = false;

    dropdownFocus: boolean = false;

    documentClickListener: any;

    firstTimeInit: boolean = false;

    cacheLabels: any[] = [];

    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public innerValue;

    constructor(public complaintTypeService: ComplaintTypeService,public renderer: Renderer) {
    }

    ngOnInit(): void {
        this.firstTimeInit = true;
        this.showBox = false;
        this.selectBoxs = [];
        this.activeIndex = 0;
        this.dataHandler(this.selectBoxs);
    }

    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            this.hide();
        });
    }

    /**
     * 隐藏弹窗
     */
    hide() {
        this.showBox = false;
    }

    onInputFocus(event) {
        this.focus = true;
        event.stopPropagation();
        this.show()
    }

    onInputBlur(event) {
        this.focus = false;
        this.onTouchedCallback();
    }

    onMouseEnterHandler(event) {
        ////console.log('enter')
        this.dropdownFocus = true;
    }

    /**
     * 输入框点击事件
     * @param event
     */
    inputClick(event) {
        event.stopPropagation();
    }

    /**
     * 面板点击事件处理
     * @param event
     */
    panelClick(event) {
        event.stopPropagation();
    }

    /**
     * 触发选择框弹出
     * @param event
     */
    toggle(event: Event): any {
        this.showBox = true;
    }

    show() {
        if (!this.showBox && (this.focus || this.dropdownFocus)) {
            this.showBox = true;
        }
    }

    /**
     * 选择某个选项时
     * @param select
     * @param i
     */
    choose(select: any, i: number): any {

        if (!this.multiSelect) {

            this.selectBoxs[i].select = select;
            this.value = select.value;
            if (select.end || (this.level == select.level && select.level !== undefined)) {
                this.activeIndex = i;
                this.showBox = false;
            } else {
                this.activeIndex = i + 1;
                this.selectBoxs = this.selectBoxs.slice(0, i + 1);
                let this_ = this;
                setTimeout(() => {
                    this_.dataHandler(this_.selectBoxs, select);
                }, 10);
            }
            this.label = "";
            let index = 0;
            for (let selectBox of this.selectBoxs) {
                index++;
                if (selectBox.select) {
                    if (this.label.length != 0) {
                        this.label += "/";
                    }
                    this.label += selectBox.select.label;
                    if (index == this.selectBoxs.length) {
                        this.onChange.emit({
                            value: this.value,
                            level: selectBox.select.level,
                            id: selectBox.select.id,
                            label: this.label
                        })
                    }
                }
            }

        } else {
            //多选
            select.checked = !select.checked;
            if (select.checked) {
                if (!this.value) {
                    this.value = [];
                }
                this.value.push(select.value);
                this.cacheLabels.push(select.label);
                this.label = this.cacheLabels.join('、');

            } else {
                _.remove(this.value, n => {
                    return select.value === n;
                });
                _.remove(this.cacheLabels, n => {
                    return select.label === n;
                });
                this.label = this.cacheLabels.join('、');
            }
        }

    }


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

    // 设置某些事件确认值变化
    blur() {
        this.onTouchedCallback();
    }

    // 写入值
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            if (this.labelHandler && this.innerValue && this.firstTimeInit) {
                this.labelHandler(this, this.innerValue);
                this.firstTimeInit = false;
            }
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

    // 清除已选内容
    clear() {
        this.label = '';
        this.value = '';
        this.innerValue = '';
        this.activeIndex = 0;
        if (this.multiSelect) {
            this.unCheckedAll();
            this.cacheLabels = [];
        }
        this.clearOthers.emit();
    }
    // 多选的时候清除选中效果
    unCheckedAll() {
        if (this.selectBoxs[0] && this.selectBoxs[0]['data']) {
            for (let d of this.selectBoxs[0]['data']) {
                d.checked = false;
            }
        }

    }

    onMouseover($event) {
        this.overFlag = true;
        $event.stopPropagation();
    }

    onMouseout($event) {
        this.overFlag = false;
        $event.stopPropagation();
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }

}



// /**
//  * Created by 1 on 2017/8/21.
//  */
// import {Component, forwardRef, Input, Output, EventEmitter} from "@angular/core";
// import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
// import {ComplaintTypeService} from "../../app-service/complaint-select.service";


// const noop = () => {
// };

// export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
//     provide: NG_VALUE_ACCESSOR,
//     useExisting: forwardRef(() => ComplaintSelectComponent),
//     multi: true
// };

// @Component({
//     selector: "complaint-select",
//     templateUrl: "./complaint-select.component.html",
//     styleUrls: ["./complaint-select.component.css"],
//     providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
// })
// export class ComplaintSelectComponent implements ControlValueAccessor {
//     /**
//      * 显示值的标签
//      */
//     @Input()
//     label: any;
//     @Input()
//     width: any;

//     @Output()
//     onChange:EventEmitter<any> = new EventEmitter<any>();

//     constructor(public complaintTypeService: ComplaintTypeService) {
//     }

//     public onTouchedCallback: () => void = noop;
//     public onChangeCallback: (_: any) => void = noop;
//     public innerValue;

//     // 获取属性
//     get value(): any {
//         return this.innerValue;
//     };

//     // 设置属性，并触发监听器
//     set value(v: any) {
//         if (v !== this.innerValue) {
//             this.innerValue = v;
//             this.onChangeCallback(v);
//         }
//     }

//     // 写入值
//     writeValue(value: any) {
//         if (value !== this.innerValue) {
//             this.innerValue = value;
//         }
//     }

//     // 注册变化处理事件
//     registerOnChange(fn: any) {
//         this.onChangeCallback = fn;
//     }

//     // 注册触摸事件
//     registerOnTouched(fn: any) {
//         this.onTouchedCallback = fn;
//     }

//     /**
//      * 值改变事件
//      * @param val
//      */
//     onValueChange(val) {
//         this.onChange.emit(val);
//     }

//     dataHandler: Function = this.complaintTypeService.selectBoxHandler();

//     // labelHandler:Function = this.complaintTypeService.selectBoxLabelHandler();
// }
