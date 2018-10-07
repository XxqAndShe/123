import {Injectable} from "@angular/core";
import {API} from "../../../../../share/lib/api/api";
import {AbnormalTaskRequestVo} from "../vo/abnormal-task-request.vo";
import {AfterDispatchRequestVo} from "../../scheduling/vo/after-dispatch-request.vo";
import {AfterDispatchResponseVo} from "../../scheduling/vo/after-dispatch-response.vo";
import {TrackRequestVo} from "../vo/track-request.vo";
import {data} from "../../../../base-set/page/intel-manage/page/intel-addr-manage/data";

@Injectable()
export class AbnormalTaskService {

    public afterDispatchResponseVo: AfterDispatchResponseVo;

    public abnormalTaskRequestVo: AbnormalTaskRequestVo;

    constructor(public api: API) {
    }

    /**
     * 获取任务列表,包括全部、维修、补件、返货、其他
     */
    public findAbnormalTask(fn: Function, abnormalTaskRequestVo: AbnormalTaskRequestVo) {
        this.api.call("AbnormalAfterSaleController.findAbnormalAfterSale",{first:0,rows:10}, abnormalTaskRequestVo)
            .ok(json => {
               // debugger;
                ////console.log("----success:" + json.result);
                fn(json.result);
            })
            .fail(json => {
                // debugger;
                console.error("---error:" + json.result);
                alert("net error");
            });
    }

    /**
     * 获取售后调度列表,包括维修调度、返货调度
     */
    public findAfterDispatch(fn: Function, afterDispatchRequestVo: AfterDispatchRequestVo) {
        ////console.log(afterDispatchRequestVo);

        this.api.call("abnormalTaskApiController.findAfterDispatch", afterDispatchRequestVo)
            .ok(data => {
                this.afterDispatchResponseVo = Object.assign(new AfterDispatchResponseVo(), data.result);
                // fn(this.afterDispatchResponseVo);

                fn(data.result);

                ////console.log(this.afterDispatchResponseVo);
            })
            .fail(data => {
                // alert("net error");  
                console.error(data);
            });
    }

    public rowData:any;

    /**
     * 添加跟踪信息
     */
    public addTrackRemark(vo: any) {
        vo.abId = this.rowData.id;
        ////console.log(vo);
        this.api.call("AbnormalTaskApiController.waybillInsTaskTrack", vo)
            .ok(data => {
                ////console.log("AddTrackRemark SUCCESS");
                alert("保存成功");
            })
            .fail(data => {
                 alert("保存失败");
            });
    }

}