import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {WaybillAbnormalVo} from "../../vo/waybill-abnormal.vo";
import {AbnormalDutyRequestVo} from "../../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-duty-request.vo";
import {AbnormalTypeRequestVo} from "../../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {AbnormalTaskRequestVo} from "../../vo/abnormal-task-request.vo";

@Component({
    selector: 'search-top',
    templateUrl: './search-top.component.html',
    styleUrls: ['./search-top.component.css']
})
export class SearchTopComponent implements OnInit{
    @Input() selected;
    @Output() cancelSelect= new EventEmitter<boolean>();

    //输入框组件
    public temp:string;
    public suggestionResult:string[];//查询建议结果
    public suggestionResult2:string[];//查询建议结果
    //区域组件样式
    metaWidth:string;
    //开单网点
    departmentWidth:string;
    searchResult(event,type?) {
        if(type='receive'){
            //查询收货人
        }
        if(event.query.startsWith("a")){
            this.suggestionResult = ["aaa","aab","aac"];
            this.suggestionResult2 = ["aaa","aab","aac"];
        }
        else if(event.query.startsWith("b")){
            this.suggestionResult = ["bbb","bba","bbc"];
            this.suggestionResult2 = ["bbb","bba","bbc"];
        }
    }

    @Input() abnormalTaskRequestVo:AbnormalTaskRequestVo;
    @Output() doSearchEvent=new EventEmitter();
    @Input() loading;
    doSearch(){
        //debugger;
        this.doSearchEvent.emit();
    }
    ngOnInit(){
        this.abnormalTaskRequestVo["handelWay"] = 'All';
        this.abnormalTaskRequestVo["serviceType"] = 'All';
        if(document.body.offsetWidth>1366){
            this.metaWidth = "125px";
            this.departmentWidth = "125px"
        }else {
            this.metaWidth = "95px";
            this.departmentWidth = "95px"
        }
        // this.abnormalTaskRequestVo.vWaybillAbnormal = new WaybillAbnormalVo();
        // this.abnormalTaskRequestVo.vWaybillAbnormal.vAbnormalDuty = new AbnormalDutyRequestVo();
        // this.abnormalTaskRequestVo.vWaybillAbnormal.vAbnormalType = new AbnormalTypeRequestVo();
    }
    // // 时间插件
    // today = new Date();
    // y = this.today.getFullYear();
    // mTemp = this.today.getMonth() + 1;
    // m = this.mTemp<10? '0'+this.mTemp : this.mTemp;
    // dTemp = this.today.getDate();
    // d = this.dTemp<10? '0'+this.dTemp : this.dTemp;
    //
    // hasHidden1 = true;
    // hidden1 = true;
    // dateText1 = this.y + '/' + this.m + '/'+ this.d;
    //
    // hasHidden2 = true;
    // hidden2 = true;
    // dateText2 = this.dateText1;
    //
    // changeDateText1(dateStr: string) {
    //     this.dateText1 = dateStr;
    //     this.hidden1 = true;
    //
    // }
    //
    // changeDateText2(dateStr: string) {
    //     this.dateText2 = dateStr;
    //     this.hidden2 = true;
    // }

    // 日历组件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        // 'width': 122+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    //开单网点样式
    width:string = "95px";
    // 地址组件
    addrSelectHidden = true;
    areaText = "";
    changeAddrText(result: any) {
        this.areaText = result.areaText;
        this.addrSelectHidden = result.addrSelectHidden;
    }


    @Output() isExplane= new EventEmitter<boolean>();
    isshowSX=false;
    showShaixuan(){
        this.isshowSX=!this.isshowSX;
        this.isExplane.emit(this.isshowSX);
        ////console.log(11)
    }
    showTitle(){
        this.cancelSelect.emit();
    }
    constructor(public datePickerService: DatepickerService){}
    @Output() showTraceWin=new EventEmitter<boolean>();
    showTraceModal(){
        this.showTraceWin.emit(true);
    }
}
