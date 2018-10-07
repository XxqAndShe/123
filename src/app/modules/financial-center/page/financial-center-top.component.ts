import {Component, OnInit, Input} from '@angular/core';
import {API} from "../../../share/lib/api/api";
import {FlowRequestVo} from "../vo/flow-request.vo";
import {TotalMoneyVo} from "../vo/total-money.vo";

@Component({
  selector: 'financial-center-top',
  templateUrl: './financial-center-top.component.html',
  styleUrls: ['./financial-center-top.component.css']
})
export class FinancialCenterTopComponent implements OnInit{
  isshow=new Array();
  public masterFlowRequestVo:FlowRequestVo;

  constructor(public api:API){
  }

  totalMoneyVo:TotalMoneyVo;
  // 初始化
  ngOnInit():void{
    for(let i=0;i<5;i++){
      this.isshow[i]=false;
    }
    this.masterFlowRequestVo=new FlowRequestVo();
    //console.info(this.totalMoneyVo)
    this.totalMoneyVo=new TotalMoneyVo();
    this.doQuery();
  }

  showExplanation(index:number){
    for(let i=0;i<5;i++){
      this.isshow[i]=false;
    }
    this.isshow[index]=true;
  }

  doQuery(){
    /*查询所有师傅流水----(后续修改)*/
    this.api.call("financialCenterController.countAllUserWorkerMoney").ok(json => {
      this.totalMoneyVo = json.result;
    }).fail((err)=>{
      //console.log(err);
    });
  }
}
