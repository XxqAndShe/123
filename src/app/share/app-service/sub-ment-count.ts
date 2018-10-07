/**
 * Created by Administrator on 2017/5/22 0022.
 */
import { Injectable } from '@angular/core';
import { API } from "../lib/api/api";
@Injectable()
export class subMenuCount {
    constructor(public api:API) {}
    menuCount:any = 0;
    changCount() {
        this.api.call('taskTraceController.findToTraceTaskCount')
            .ok(data => {
                this.menuCount = data.result.traceTaskCount;
            })
            .fail(err => {
            });
    }
}