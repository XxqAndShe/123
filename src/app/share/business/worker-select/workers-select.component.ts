/**
 * 师傅选择
 */
import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {API} from "app/share/lib/api/api";


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WorkersSelectComponent),
    multi: true
};

@Component({
    templateUrl: "./workers-select.component.html",
    styleUrls: ["./workers-select.component.css"],
    selector: "workers-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class WorkersSelectComponent implements ControlValueAccessor,OnInit {
    /**
     * 师傅数组
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
    type: String;
    @Input()
    styleClass: String;

    constructor(public api: API) {
    }

    ngOnInit() {
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
        v = v && v.id?v.name:v;
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
     * 查询数据
     * @param $event
     */
    queryWorker($event: any) {
        let value = $event.query;
        let queryParams={
            "workerName":value
        }
        console.info('查询条件:'+value)
        this.api.call("CustomerWorkerController.queryWorker",{
            workerName:value
        }).ok(json=>{
            let marsterList=json.result || [];
            /*for(let marster of marsterList){
                marster.label=marster.realName;
                marster.value=marster.id;
            }*/
            this.suggestions=marsterList;
            ////console.log(this.suggestions)
        })
    }

}