/**
 * Created by hua on 2017-01-17.
 */
import {Component, OnInit, transition, trigger, state, style, animate, Input, Output} from '@angular/core';
import {ControlInfoBoxService} from "../../../share/app-service/control-info-box.service";

@Component({
   selector:'order-detail',
   templateUrl:'./order-detail.component.html',
   styleUrls:['./order-detail.component.css'],
    animations:[trigger('orderState',[
        state("show",style({
            right:'0',
            display:'block'
        })),
        state("hide",style({
            right:'-92%',
            display:'none'
        })),
        transition('hide<=>show',animate('220ms ease-in'))
    ])
    ]
})
export class OrderDetailComponent implements OnInit{
  constructor(public infoBox:ControlInfoBoxService){}
    currentStat:any;
  dealStatusTime:any = new Date();

  public winHeight:number;
  /*输入的订单信息*/
  @Input() orderInfo:any;
  /*输入订单基本信息*/
  @Input() orderBaseInfo:any;
  /*输入提货信息*/
  @Input() pickupGoodInfo:any;
  /*输入签收信息*/
  @Input() signInfo:any;
  /*详情导航*/

  /*
    控制，基本，日志，售后等信息的导航
   */
  public logInfoNav:boolean[]=[true,false,false,false,false];
  public box:any;
  @Input() public orderState:string;
  ngOnInit(){
    this.winHeight=document.documentElement.clientHeight||document.body.clientHeight;
    let container=document.getElementById('order_detail');
    container.style.height=(this.winHeight-50)+'px';
  }
  selectNav(index:number){
      for(let i=0,len=this.logInfoNav.length;i<len;i++){
          this.logInfoNav[i]=false;
      }
      this.logInfoNav[index]=true;
  }
  setHeight(index:number){
    let h={
      'height':(this.winHeight-210)+'px',
      'display':this.logInfoNav[index]?'block':'none'
    };
    return h;
  }
}
