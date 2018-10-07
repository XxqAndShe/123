import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";
/**
 * Created by jianconglee on 2017-02-27.
 */

@Injectable()
export class DataChangeModalService{
    constructor(public api:API){

    }

    /**
     * 获取信息(修改后)
     */
    getAfterData(fn: Function, requestVo: any, path: string): any {
        this.api.call(path, requestVo).ok(data => {
                fn(data);//返回查询结果，component，doSearch方法处理
                 //////console.log(data.result);

            }).fail(data => {
                 ////console.log(data.result);
            });
    }

    /**
     * 获取信息(修改前)
     */
    getBeforeData(fn: Function, requestVo: any, path: string): any {
        this.api.call(path, requestVo).ok(data => {
                fn(data);//返回查询结果，component，doSearch方法处理
                 //////console.log(data.result);

            }).fail(data => {
                 ////console.log(data.result);
            });
    }
}