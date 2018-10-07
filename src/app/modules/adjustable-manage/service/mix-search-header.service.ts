/**
 * Created by 李鹏程 on 2017-02-24.
 * 调度任务-综合查询service
 */
import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";

@Injectable()
export class MixSearchHeaderService{

    constructor(public api:API){}

    /**
     * 查询操作
     */
    doSearch(fn: Function, requestVo: any, path: string):any {
        this.api.call(path, requestVo)
            .ok(data => {
                fn(data);//返回查询结果，component，doSearch方法处理
            })
            .fail(data => {
                ////console.log(data.result);
            });
    }

}