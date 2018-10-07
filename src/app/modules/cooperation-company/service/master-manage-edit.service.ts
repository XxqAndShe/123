import {API} from "../../../share/lib/api/api";
import {Injectable} from "@angular/core";
/**
 * Created by jianconglee on 2017-02-24.
 */

@Injectable()
export class MasterManageEditService{
    constructor(public api:API){

    }
    /**
     * 保存操作
     */
    doSave( requestVo: any, path: string):any {
        this.api.call(path, requestVo)
            .ok(data => {
                // data.push(2222);
                // fn(data);//返回查询结果，component，doSearch方法处理
                ////console.log(data.result);
            })
            .fail(data => {
                ////console.log(data.result);
            });
    }
}