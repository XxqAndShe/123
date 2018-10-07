import {Component, OnInit, Output, EventEmitter,Input} from '@angular/core';
import {WithdrawRequestVo} from "../../vo/withdraw-request.vo";
import {WithdrawResponseVo} from "../../vo/withdraw-response.vo";
import {UserRequestVo} from "../../vo/user-request.vo";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {DatePipe} from "@angular/common";
import {getDate} from "../../../../share/utils/DateUtil";

@Component({
    selector: 'state-search',
    templateUrl: './state-search.component.html',
    styleUrls: ['./state-search.component.css']
})
export class StateSearchComponent implements OnInit {

    ngOnInit(): void {
        this.userRequestVo = new UserRequestVo();
        this.withdrawRequestVo = new WithdrawRequestVo();
        this.withdrawRequestVo.user = this.userRequestVo;
        // this.withdrawRequestVo.beginTime = this.dateText1;
        // this.withdrawRequestVo.endTime = this.dateText2;

        this.withdrawResponseVo = [];
        this.doQuery();
        this.withdrawRequestVo["auditStatus"] = 'All';//赋予默认值
        this.withdrawRequestVo["withdrawStatus"] = 'All';//赋予默认值

    }

    constructor(public datePickerService: DatepickerService, public datePipe: DatePipe) {

    }

    //财务中心-提现管理-查询请求vo
    withdrawRequestVo: WithdrawRequestVo;

    userRequestVo: UserRequestVo;

    //响应vo数组

    withdrawResponseVo: WithdrawResponseVo[];
    //声明事件对象
    @Output() searchAllWithdraw = new EventEmitter<any>();
    @Input() loading;

    // 日历组件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 124+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

// 文本下拉框
    public temp: string;
    public suggestionResult: string[];//查询建议结果

    searchResult(event, type?) {
        if (type = 'receive') {
            //查询收货人
        }
        if (event.query.startsWith("a")) {
            this.suggestionResult = ["aaa", "aab", "aac"];
        }
        else if (event.query.startsWith("b")) {
            this.suggestionResult = ["bbb", "bba", "bbc"];
        }
    }


    doQuery(): any {

        if (this.withdrawRequestVo.endTime != null && this.withdrawRequestVo.endTime != "") {
            let endTime = this.datePipe.transform(this.withdrawRequestVo.endTime, 'yyyy-MM-dd 23:59:59');
            this.withdrawRequestVo.endTime = getDate(endTime);
        }

        this.searchAllWithdraw.emit(this.withdrawRequestVo);
    }

}
