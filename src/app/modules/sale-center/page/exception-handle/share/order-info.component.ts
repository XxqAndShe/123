/**
 * Created by hua on 2017-02-22.
 */
import {
    Component, OnInit, trigger, state, style, transition, animate, Input, OnChanges,
    SimpleChanges
} from "@angular/core";
import {ControlInfoBoxService} from "../../../../../share/app-service/control-info-box.service";
import {API} from "../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../share/app-service/request-token.service";

@Component({
    selector:'order-info',
    templateUrl:'./order-info.component.html',
    styleUrls:['./order-info.component.css'],
    animations:[trigger('orderInfoState',[
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
export class OrderInfoComponent implements OnInit,OnChanges{
    ngOnChanges(changes: SimpleChanges): void {
        //console.log(this.selectedAbnormal);
    }

    @Input()
    waybill:any;
    goods:any[];
    @Input()
    selectedAbnormal:any;

    constructor(public infoBox:ControlInfoBoxService,
                public api:API,
                public requestTokenService: RequestTokenService
    ){}
   ngOnInit(){
    this.requestTokenService.createToken();
   }
   /*信息导航*/
   public navInfo:boolean[]=[true,false,false];
   selectNavInfo(cur){
       for(let i=0,len=this.navInfo.length;i<len;i++){
           if(this.navInfo[i]){
               this.navInfo[i]=false;
           }
       }
       this.navInfo[cur]=true;
   }


}