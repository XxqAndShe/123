/**
 * Created by rjr on 2017/5/3.
 */
import {Component, forwardRef, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {API} from "app/share/lib/api/api";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AbnormalMoverComponent),
    multi: true
};

@Component({
    templateUrl: "./abnormalMover-select.component.html",
    styleUrls: ["./abnormalMover-select.component.css"],
    selector: "abnormalMover-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AbnormalMoverComponent implements ControlValueAccessor,OnInit {
    abnormalMover: SelectItem[];

    @Input()
    defaultLabel: string = "请选择…";

    @Input()
    multiSelect: boolean = false;

    @Input()
    width: string = "";

    @Input()
    height: string = "";

/*    @Input()
    waybillId: string;*/

    @Input()
    styleClass: String;

    @Output()
    onChange:EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onFocus:EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onBlur:EventEmitter<any> = new EventEmitter<any>();

    constructor(public api: API) {
    }

    ngOnInit() {
        this.abnormalMover = [];
        //if(this.waybillId){
        this.query();
        /*}*/
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

    onChangeHandler(event){
        this.onChange.emit(event);
    }

    onFocusHandler(event){
        this.onFocus.emit(event);
    }

    onBlurHandler(event){
        this.onBlur.emit(event);
    }

    //query(waybillId: string="") {
    query() {
        let queryParams = {
            "code": "yztpt"
        }
        console.info(queryParams)
        this.api.call("CompanyController.departUserQueryByCode", queryParams).ok((json) => {
            let result: any = json.result || {};
            //console.info(json);
            this.abnormalMover = result|| [];
            //console.info(result);
            this.abnormalMover.forEach((abnMov)=>{
                abnMov.label = abnMov["realName"] + " " + abnMov["mobile"];
                abnMov.value = abnMov["id"];
            });
        })
    }
}