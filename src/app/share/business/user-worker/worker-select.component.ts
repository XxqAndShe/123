import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AreaService} from "../../app-service/area.service";
import {SelectItem} from "primeng/components/common/api";
import {API} from "../../lib/api/api";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WorkerSelectComponent),
    multi: true
};

@Component({
    templateUrl:"./worker-select.component.html",
    styleUrls:["./worker-select.component.css"],
    selector:"worker-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class WorkerSelectComponent implements ControlValueAccessor,OnInit{
    metas: SelectItem[];

    @Input()
    defaultLabel:string="请选择…";
    @Input()
    multiSelect:boolean=false;
    @Input()
    width:string="";
    @Input()
    height:string="";
    @Input()
    type:String;
    @Input()
        styleClass:String;
    @Input()
        selectObject:string;

        constructor(public api:API){

        }
        ngOnInit(){
            this.metas=[];


            this.api.call("AreaWorkerController.listWorker").ok(json=>{
                this.metas=json.result;
            })
            //
            // this.metas.push({label:'师傅1', value:'value1'});
            // this.metas.push({label:'师傅2', value:'value2'});
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

}