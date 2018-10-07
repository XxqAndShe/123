import {Component, forwardRef, OnInit, ViewChild, Input, ElementRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {API} from "app/share/lib/api/api";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DepartmentSelectComponent),
    multi: true
};

@Component({
    selector: 'department-select',
    templateUrl: './department-select.component.html',
    styleUrls: ['./department-select.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DepartmentSelectComponent implements OnInit,ControlValueAccessor {

    @Input()
    width: string = '200px';

    multiple: boolean = false;

    options: Array<any> = [];

    selection: Array<string>;

    label:any;

    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public innerValue;

    @ViewChild('pac') autoCompenentEl: ElementRef;

    constructor(public api: API) {
    }

    ngOnInit(): void {


    }

    // 获取属性
    get value(): any {
        return this.innerValue;
    };

    // 设置属性，并触发监听器
    set value(v: any) {
        this.label=v && v.name || '';
        if (v !== this.innerValue) {
            this.innerValue = v;
            //返回code
            this.onChangeCallback(v.code || v);
        }
    }

    writeValue(value: any): void {
        this.innerValue=value;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    changed(event) {

    }

    queryData($event): void {
        let qryParams = {
            name: $event.query
        };
        let page = {
            first: 0,
            rows: 9999
        };
        this.api.call("CommonController.findCompanyDepartment", page, qryParams).ok(json => {
            let result: any = json.result || {};

            let dataList = result.content || [];
            this.options = [];
            for (let company of dataList) {

                if (!company.compayName) continue;

                let obj = {
                    "code": company.compayId,
                    "name": company.compayName,
                    "children": company.departments
                }
                this.options.push(obj);
            }
        }).fail(err => {
            throw new Error(err);
        });
    }

}
