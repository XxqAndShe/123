/**
 * Created by hua on 2017-01-23.
 */
import {Component, ViewChild, OnInit, AfterContentInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ReturnSchedulingComponent} from "app/modules/sale-center/page/scheduling/page/return-scheduling/return-scheduling.component";
import {RepairSchedulingComponent} from "app/modules/sale-center/page/scheduling/page/repair-scheduling/repair-scheduling.component";
import {API} from "../../../../share/lib/api/api";
import {CarrierReturnComponent} from "./page/carrier-Return/carrier-return.component";
@Component({
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit, AfterContentInit {

    // nav插件引用设置
    navs = ["维修调度", "服务商返货", "承运商返货"];
    navNumber:number[]=[0,0,0];//标签数量
    curIndex = 0;
    routeParamIndex:string="";
    @ViewChild(ReturnSchedulingComponent)
    public returnScheduling: ReturnSchedulingComponent;

    @ViewChild(RepairSchedulingComponent)
    public repairScheduling: RepairSchedulingComponent;

    @ViewChild(CarrierReturnComponent)
    public carrierReturn: CarrierReturnComponent;

    constructor(public _activatedRoute: ActivatedRoute,
                public api:API) {
    }

    ngOnInit() {
        this.routeParamIndex = this._activatedRoute.snapshot.params['index'];
        let num=Number(this.routeParamIndex);
        if(!isNaN(num)){
            this.chanCurIndex(num);
        }
    }
    ngAfterContentInit(): void {
        setTimeout(()=>{
            if(this.curIndex===1){
                this.returnScheduling.changeBlock(1);
            }else if(this.routeParamIndex=='0'){
                this.repairScheduling.changeBlock(1);
            }else if(this.curIndex === 2){
                this.carrierReturn.changeBlock(1);
            }
        },500);
    }
    chanCurIndex(index: number) {
        this.curIndex = index;
    }
}
