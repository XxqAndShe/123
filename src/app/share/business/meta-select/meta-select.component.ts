import {Component, forwardRef, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {API} from "app/share/lib/api/api";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MetaSelectComponent),
    multi: true
};

@Component({
    templateUrl: "./meta-select.component.html",
    styleUrls: ["./meta-select.component.css"],
    selector: "meta-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class MetaSelectComponent implements ControlValueAccessor,OnInit {
    metas: SelectItem[];

    @Input()
    defaultLabel: string = "请选择…";

    @Input()
    multiSelect: boolean = false;

    @Input()
    width: string = "";

    @Input()
    height: string = "";

    @Input()
    type: string;

    @Input()
    filterOptions: any[]=[];

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
        this.metas = [];
        this.filterOptions=this.filterOptions || [];
        this.query(this.type)
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
        //获取选中的字典对象
        let value=event.value;
        value=_.isArray(value)?value:[value];
        let selectedMeta=[];
        for(let item of this.metas){
            if(value.includes(item.value)){
                selectedMeta.push(item);
            }
        }
        this.onChange.emit({
            event:event,
            selected:selectedMeta
        });
    }

    onFocusHandler(event){
        this.onFocus.emit(event);
    }

    onBlurHandler(event){
        this.onBlur.emit(event);
    }

    /**
     * @param metaType
     * eg:
     * service-服务类型
     * repair-维修类型
     * fhreturn-返货类型
     * riskReason-出险原因
     * specifyLogistics-指定物流
     * abnormalDuty-异常责任方
     * complement-补件-任务类型
     * transportCompany-物流公司
     * goodsunit-商品单位
     * abnormalHandleWay-异常处理方式
     */
    query(metaType: string="") {
        let queryParams = {
            "type": metaType
        };
        //console.log(this.filterOptions)
        this.api.call("CommonController.findMeta", {
            first:0,
            rows:9999
        }, queryParams).ok((json) => {
            let result: any = json.result || {};
            let content = result.content || [];
            this.metas=content.filter((meta)=>{
                //过滤filterOptions
                if(this.filterOptions.indexOf(meta["label"])==-1){
                    meta.value = meta["name"];
                    return meta;
                }
            });
        })
    }
}
