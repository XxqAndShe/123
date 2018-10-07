/**
 * Created by giscafer on 2017/4/22.
 * @Discription 时间工具类
 */

/**
 * 获取 两个日期之间的时间字符数组
 * @param startDate {Date}  开始日期
 * @param endDate {Date}  结束日期
 * @returns {Array}
 */
export function getMonthDate(startDate: Date, endDate: Date) {

    var arr = [];
    var day = 1000 * 60 * 60 * 24;
    var diff = (endDate.getTime() - startDate.getTime()) / day;
    for (var i = 0; i <= diff; i++) {
        var xx = startDate.getTime() + day * i;
        var yy = new Date(xx);
        let date=yy.getDate()>=10?yy.getDate():(0+''+yy.getDate());
        let month=yy.getMonth() + 1;
        let monthString=month>=10?month:(0+''+month);
        arr.push(yy.getFullYear() + "-" + monthString + "-" + date);
    }
    return arr;
}


/**
 * 获取到单独的月份
 * @param data
 * @returns {string}
 */
export function getMonth(data: Date){
    let month=data.getMonth() + 1;
    let monthString=month>=10?month:(0+''+month);
    return data.getFullYear() + "-" + monthString;
}


/**
 * 生成日期对象数据
 * @param dateArray  {Array}
 */
export function dateToObject(dateArray:any[]):any {
    let obj={};
    dateArray.forEach(item=>{
        obj[item]=0;
    });
    return obj;
}

/**
 * 获取最近12个月份的日期数据
 * @returns {Array}
 */
export function getTwelveMonth(){
    let result = [];
    let curDate = new Date();
    let y = curDate.getFullYear();
    let m = curDate.getMonth() + 1;
    //第一次装入当前月(格式yyyy-mm)
    result[0] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
    m--;
    //第一次已经装入,可以直接传参
    for (let i = 1; i < 12; i++, m--) {
        if (m == 0) {
            y--;//到1月后,后推一年
            m = 12; //再从12月往后推
        }
        result[i] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
    }
    return result;
}

/**
 * 获取本月的第一天
 * @returns {Date}
 */
export function getCurrentMonthFirst() {
    let date = new Date();
    date.setDate(1);
    return date;
}


/**
 * 获取离当天日期之前七天的日期
 * @param data  当前的日期
 * @returns {Date} 转换为七天之前的日期
 */
export function  getSevenDays(data){
    let foreSeven = data.getTime() - 7*24*60*60*1000;
    return new Date(foreSeven);
}


/**
 * 将字符串的日期转换为标准日期格式
 * @param strDate  需要转换的字符串格式日期
 * @returns {Date}  返回一个标准格式日期
 */
export function getDate(strDate): any {
    strDate = strDate.replace(/-/g,"/");
    return  new Date(strDate);
}