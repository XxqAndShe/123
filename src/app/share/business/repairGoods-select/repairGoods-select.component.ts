import {
    Component,
    forwardRef,
    Input,
    OnInit,
    EventEmitter,
    Output,
    AfterViewInit,
    IterableDiffers
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {API} from "app/share/lib/api/api";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RepairGoodsComponent),
    multi: true
};

@Component({
    templateUrl: "./repairGoods-select.component.html",
    styleUrls: ["./repairGoods-select.component.css"],
    selector: "repairGoods-select",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class RepairGoodsComponent implements ControlValueAccessor,OnInit,AfterViewInit{

    repairGoods: SelectItem[];

    @Input()
    defaultLabel: string = "请选择…";

    @Input()
    multiSelect: boolean = false;

    @Input()
    width: string = "";

    @Input()
    height: string = "";

    @Input()
    waybillId: string;

    @Input()
    styleClass: String;

    @Output()
    onChange:EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onFocus:EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onBlur:EventEmitter<any> = new EventEmitter<any>();

    public differ: any;

    constructor(public api: API, differs: IterableDiffers) {

        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {
        this.repairGoods = [];
    }
    ngAfterViewInit(): void {
        if(this.waybillId){
            this.query(this.waybillId)
        }
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
        let values=event.value;
        let selectedGoods=[];
        for(let v of values){
            for(let item of this.repairGoods){
                if(item.value===v){
                    selectedGoods.push(item);
                }
            }
        }

        this.onChange.emit({
            event:event,
            selectedGoods:selectedGoods
        });
    }

    onFocusHandler(event){
        this.onFocus.emit(event);
    }

    onBlurHandler(event){
        this.onBlur.emit(event);
    }

    query(waybillId: string="") {
        let queryParams = {
            "waybillId": waybillId
        };
        // console.info(queryParams)
        this.api.call("AbnormalRegistController.waybillQuery", queryParams).ok((json) => {
            let result: any = json.result || {};
            console.info(json);
            this.repairGoods = result.waybillGoodsInfo || [];
            console.info(result.waybillGoodsInfo);
            this.repairGoods.forEach((repairGood)=>{
                repairGood.label = repairGood["goodsName"];
                repairGood.value = repairGood["wayBillGoodsId"];
            });
        })
    }
}