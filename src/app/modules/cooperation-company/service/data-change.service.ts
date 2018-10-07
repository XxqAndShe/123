import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";
/**
 * Created by jianconglee on 2017-02-24.
 */

@Injectable()
export class DataChangeService{
    constructor(public api:API){

    }

    /**
     * 查询操作
     */
    doSearch(fn:Function,requestVo: any, path: string):any {
        this.api.call(path, requestVo)
            .ok(data => {
                fn(data);//返回查询结果，component，doSearch方法处理
                ////console.log(data.result);
            })
            .fail(data => {
                ////console.log(data.result);
            });
    }
    // public getDispatchTaskList(fn:Function, taskQueryRequestVo: TaskQueryRequestVo) {
    //     this.api.call("dispatchTaskApiController.queryDisTask", taskQueryRequestVo)
    //         .ok(data => {
    //             this.taskQueryResponseVo = Object.assign(new TaskQueryResponseVo(), data.result);
    //             fn(this.taskQueryResponseVo);
    //             ////console.log(this.taskQueryResponseVo);
    //         })
    //         .fail(data => {
    //             ////console.log(data);
    //         });
    // }

}