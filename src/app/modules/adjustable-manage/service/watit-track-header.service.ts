/**
 * Created by zhaojinglong on 2017-02-22.
 */
import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";
import {InsTaskTrackResponseVo} from "../vo/instask-track-response.vo";
import {InsTaskTrackRequestVo} from "../vo/instask-track-request.vo";

@Injectable()
export class WaitTrackHeaderService{

    public insTaskTrackResponseVo:InsTaskTrackResponseVo;

    constructor(public api:API ){}

    /**
     * 获取我跟踪的任务列表
     */
    public findMyTrackRemark(fn:Function, insTaskTrackRequestVo:InsTaskTrackRequestVo){
        ////console.log(insTaskTrackRequestVo);

        this.api.call("insTaskTrackApiController.findMyTrackRemark",insTaskTrackRequestVo)
            .ok(data => {
                this.insTaskTrackResponseVo = Object.assign(new InsTaskTrackResponseVo(), data.result);
                fn(this.insTaskTrackResponseVo);

                ////console.log(this.insTaskTrackResponseVo);
            })
            .fail(data=>{
                //console.error(data);
            });
    }

}