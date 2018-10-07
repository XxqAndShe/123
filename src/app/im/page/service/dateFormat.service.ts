/**
 * Created by hxb on 2017/4/28.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class DateFormatService {
    /*时间格式*/
    FormatDate (strTime) {
        let date = new Date(strTime);

        let month = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
        let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        let minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        let second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

        return date.getFullYear()+"-"+month+"-"+day+ " "+hour+":"+minute+":"+second;
    }
}
