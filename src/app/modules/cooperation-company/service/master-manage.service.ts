import {API} from "../../../share/lib/api/api";
import {Injectable} from "@angular/core";
/**
 * Created by jianconglee on 2017-02-24.
 */
@Injectable()
export class MasterManageService {
    constructor(public api: API) {

    }

    // /**
    //  * 查询操作
    //  */
    // doSearch(fn: Function, requestVo: any, path: string): any {
    //     this.api.call(path, requestVo)
    //         .ok(data => {
    //             fn(data);//返回查询结果，component，doSearch方法处理
    //             ////console.log(data.result);
    //         })
    //         .fail(data => {
    //             ////console.log(data.result);
    //         });
    // }
}