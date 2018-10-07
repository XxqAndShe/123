import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FlowRequestVo} from "../vo/flow-request.vo";
import {FlowResponseVo} from "../vo/flow-response.vo";
import {TotalMoneyVo} from "../vo/total-money.vo";
import {DatepickerService} from "../../../share/app-service/datepicker.service";
import {API} from "../../../share/lib/api/api";
import {DateFormatsService} from "../../../share/app-service/dateFormats.service";
import {DatePipe} from "@angular/common";
import {getDate} from "../../../share/utils/DateUtil";

@Component({
  selector: 'account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements OnInit{

  constructor(public datePickerService: DatepickerService,
              public api:API,
              public datePipe:DatePipe){}
  @Input() saleRunning:boolean;
  @Input() loading;
  ngOnInit(): void {
    this.flowRequestVo = new FlowRequestVo();
    this.flowResponseVo = [];
    this.totalMoneyVo = new TotalMoneyVo();
    this.flowRequestVo.status = "All"
    this.doQuery();

  }

  // 师傅流水查询请求vo
  flowRequestVo:FlowRequestVo;

  // 师傅流水查询响应vo
  flowResponseVo:FlowResponseVo[];

  // 师傅提现金额详情vo
  totalMoneyVo:TotalMoneyVo;


  @Output() findMasterFlow = new EventEmitter<any>();

  @Output() findSaleRunningFlow = new EventEmitter<any>();


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
  //   this.dateText1 = dateStr;
  //   this.hidden1 = true;
  //   this.masterFlowRequestVo.signTime = this.dateText1;
  //
  // }
  //
  // changeDateText2(dateStr: string) {
  //   this.dateText2 = dateStr;
  //   this.hidden2 = true;
  //   this.masterFlowRequestVo.endTime = this.dateText2;
  // }

  // 日历组件
  zh: any=this.datePickerService.locale();
  inputStyle: any={ // 输入框样式
    // 'width': 121+'px',
    'height': 30+'px',
    'textAlign': 'left',
    'cursor': 'default'
  };
  yearRange: string="2000:2020";

  /**
   * 文本下拉框临时数据
   */
  public temp:string;
  public suggestionResult:string[];//查询建议结果

  searchResult(event,type?) {
    if(type='receive'){
      //查询收货人
    }
    if(event.query.startsWith("a")){
      this.suggestionResult = ["aaa","aab","aac"];
    }
    else if(event.query.startsWith("b")){
      this.suggestionResult = ["bbb","bba","bbc"];
    }
  }
  doQuery(): any {
    // this.loading = true;
    if(this.saleRunning){

        if (this.flowRequestVo.endTime != null && this.flowRequestVo.endTime != "") {
            let endTime = this.datePipe.transform(this.flowRequestVo.endTime, 'yyyy-MM-dd 23:59:59');
            this.flowRequestVo.endTime = getDate(endTime);
        }
      this.findSaleRunningFlow.emit(this.flowRequestVo);
    }else{
      //师傅流水查询
      this.findMasterFlow.emit(this.flowRequestVo);
    }
  }
  isFasle(){
      this.loading = false;
  }

}
