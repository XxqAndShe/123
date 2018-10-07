import {HomeResponseVo} from "../vo/home-response.vo";
import {HomeDayResponseVo} from "../vo/home-day-response";
import {HomeRequestVo} from "../vo/home-request.vo";
import {Injectable} from "@angular/core";

@Injectable()
export class HomeService {
    shareInputData:string;

    shareInputDataAppend(data){
        this.shareInputData = data;
    }
    constructor() {
    }

    /**
     * 任务统计
     * @param request
     * @returns {HomeResponseVo}
     */
    public getHomeInfo(request: HomeRequestVo): HomeResponseVo {

        //this.load($event);

        let homeRequestVo: HomeResponseVo = new HomeResponseVo();

        homeRequestVo.waitTrack=0;
        homeRequestVo.waitDispatch=0;
        homeRequestVo.waitFix=12;
        homeRequestVo.waitReturn=0;
        homeRequestVo.waitAbnormal=6666;
        homeRequestVo.waitAgingAnomaly=0;

        return homeRequestVo;
    }

    /**
     * 任务统计-按天
     * @param request
     * @returns {HomeDayResponseVo}
     */
    public getHomeInfoDay(request: HomeRequestVo): HomeDayResponseVo {
        //请求后台接口返回数据



        let homeDayResponseVo: HomeDayResponseVo = new HomeDayResponseVo();

        homeDayResponseVo.fix=0;
        homeDayResponseVo.fix2=888;

        homeDayResponseVo.manual=0;
        homeDayResponseVo.manual2=0;

        homeDayResponseVo.intelligence=5;
        homeDayResponseVo.intelligence2=0;

        homeDayResponseVo.jztUser=0;
        homeDayResponseVo.jztUser2=0;

        return homeDayResponseVo;
    }

    /**/


}