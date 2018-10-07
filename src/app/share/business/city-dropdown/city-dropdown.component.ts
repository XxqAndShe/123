/*tslint:disable*/
import { Component, forwardRef, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { API } from "app/share/lib/api/api";


const noop = () => {
};


@Component({
    templateUrl: "./city-dropdown.component.html",
    styleUrls: ["./city-dropdown.component.css"],
    selector: "city-dropdown"
})
export class CityDropDownComponent implements OnInit {

    @Input()
    defaultLabel: string = "请选择…";

    @Input()
    multiSelect: boolean = false;

    @Input()
    width: string = "150px";

    @Input()
    height: string = "";

    @Input()
    type: string;

    @Input()
    filterOptions: any[] = [];

    @Input()
    styleClass: String;

    @Input()
    province: string;

    @Input()
    city: string;

    @Input()
    district: string;

    @Input()
    provinceLabel: string = "省/直辖市";

    @Input()
    cityLabel: string = "市/市辖区";

    @Input()
    districtLabel: string = "区县";

    @Input()
    marginLeft: string = "10px";


    @Output()
    onChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onFocus: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onBlur: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    provinceChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    cityChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    districtChange: EventEmitter<any> = new EventEmitter<any>();

    provinces: any[] = [];
    districts: any[] = [];
    citys: any[];

    constructor(public api: API) {
    }

    ngOnInit() {
        this.citys = [];
        this.filterOptions = this.filterOptions || [];
        this.query()
    }


    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public innerValue;


    // 写入值
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }


    onProvinceChangeHandler(event) {
        //获取选中的字典对象
        let value = event.value;
        value = _.isArray(value) ? value : [value];
        this.query(1, value[0]);
        this.provinceChange.emit(value[0]);
        this.citys = [];
        let selectedMeta = [];
        for (let item of this.citys) {
            if (value.includes(item.value)) {
                selectedMeta.push(item);
            }
        }
        this.onChange.emit({
            event: event,
            selected: selectedMeta
        });
    }

    onCityChangeHandler(event) {
        //获取选中的字典对象
        let value = event.value;
        value = _.isArray(value) ? value : [value];
        this.query(2, value[0]);
        this.cityChange.emit(value[0]);

        let selectedMeta = [];
        for (let item of this.citys) {
            if (value.includes(item.value)) {
                selectedMeta.push(item);
            }
        }
        this.onChange.emit({
            event: event,
            selected: selectedMeta
        });
    }
    onDistrictChangeHandler(event) {
        //获取选中的字典对象
        let value = event.value;
        value = _.isArray(value) ? value : [value];

        this.districtChange.emit(value[0]);

        let selectedMeta = [];
        for (let item of this.citys) {
            if (value.includes(item.value)) {
                selectedMeta.push(item);
            }
        }
        this.onChange.emit({
            event: event,
            selected: selectedMeta
        });
    }

    onFocusHandler(event) {
        this.onFocus.emit(event);
    }

    onBlurHandler(event) {
        this.onBlur.emit(event);
    }

    /**
     *
     */
    query(cityLevel?, code?) {

        let queryParams = {
            "code": code || "000000000000"
        }


        this.api.call("commonController.findAreasByParent", queryParams).ok((json) => {
            let content = json.result || [];
            let data = [];
            content.map((area) => {
                data.push({
                    label: area.name,
                    level: area.level,
                    value: area.code
                });
            });

            if (cityLevel == 2) {
                this.districts = data;
            } else if (cityLevel == 1) {
                this.citys = data;
            } else {
                this.provinces = data;
            }
        });
    }

}
