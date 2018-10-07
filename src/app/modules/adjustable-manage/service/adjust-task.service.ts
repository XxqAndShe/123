import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";
import {TaskQueryResponseVo} from "../vo/task-query-response.vo";
import {TaskQueryRequestVo} from "../vo/task-query-request.vo";
import {TaskCountResponseVo} from "../vo/task-count-response.vo";
import {TaskNodeType} from "../vo/task-node-type";

@Injectable()
export class AdjustTaskService {

    public taskQueryResponseVo: TaskQueryResponseVo;
    public taskCountResponseVo: TaskCountResponseVo;
    public taskNodeType: TaskNodeType = new TaskNodeType();

    constructor(public api: API) {
    }

    /**
     * 获取节点任务数
     * @param fn
     */
    public getNodeType(fn: Function) {
        this.api.call("dispatchTaskApiController.getTaskCountList")
            .ok(data => {
                for (var i = 0; i <= data.result.length; i++) {
                    this.taskCountResponseVo = Object.assign(new TaskCountResponseVo(), data.result[i]);
                    if (this.taskCountResponseVo.taskNodeType == "waitDistribution") {
                        this.taskNodeType.waitDistribution = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "distributionWaitAccept") {
                        this.taskNodeType.distributionWaitAccept = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "waitAppointment") {
                        this.taskNodeType.waitAppointment = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "waitSign") {
                        this.taskNodeType.waitSign = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "doSign") {
                        this.taskNodeType.doSign = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "invalid") {
                        this.taskNodeType.invalid = this.taskCountResponseVo.count;
                    }

                    else if (this.taskCountResponseVo.taskNodeType == "all") {
                        this.taskNodeType.all = this.taskCountResponseVo.count;
                    }
                }
                fn(this.taskNodeType);
                ////console.log(this.taskNodeType);
            })
            .fail(data => {
                ////console.log(data);
            });
    }

    /**
     * 请求查询
     * @param fn
     * @param taskQueryRequestVo
     */
    // public getDispatchTaskList(fn: Function, taskQueryRequestVo: TaskQueryRequestVo) {
    //     this.api.call("dispatchTaskApiController.queryDisTask", taskQueryRequestVo)
    //         .ok(data => {
    //             this.taskQueryResponseVo = Object.assign(new TaskQueryResponseVo(), data.result);
    //             ////console.log(this.taskQueryResponseVo);
    //             fn(this.taskQueryResponseVo);
    //         })
    //         .fail(data => {
    //             ////console.log(data);
    //         });
    // }

    /**
     * 确认分配师傅
     *
     */
/*    public setDispatchTask(fn: Function, adjustableDisJztUservo: adjustableDisJztUservo) {
        this.api.call("DispatchTaskNodeOpApiController.disJztUser", adjustableDisJztUservo)
            .ok(data => {
                this.taskQueryResponseVo = Object.assign(new TaskQueryResponseVo(), data.result);
                ////console.log(this.taskQueryResponseVo);
                fn(this.taskQueryResponseVo);
            })
            .fail(data => {
                ////console.log(data);
            });
    }*/


}