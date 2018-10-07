/**
 * Created by huxiubin on 2017/4/28.
 */
import {DatePipe} from "@angular/common";
import { Injectable } from '@angular/core';

@Injectable()
export class DateFormatsService {

    constructor(public datePipe: DatePipe){}

    /*时间格式*/
    formatDate (request: any, ...timeArr: any[]) {
        let Request = request || {};
        //克隆新对象
        let requestVo=_.clone(Request);
        // 遍历每一个日期类型
        for(let t of timeArr){
            //取出日期
            let time = requestVo[t];
            //转换格式
            requestVo[t]= this.datePipe.transform(time,'yyyy-MM-dd HH:mm:ss');
        }

        return requestVo;
    }
}
