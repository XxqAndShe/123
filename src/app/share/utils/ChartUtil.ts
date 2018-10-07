/**
 * Created by giscafer on 2017/4/27.
 *
 * 图表相关公用方法
 */


/**
 * 获取折线图多组数据的总和
 * @param data {Array}   需要展示的数据
 * @param dayCount {number}  需要展示在图上的天数
 * @returns {number}
 */
export function getMultiLineSum(data, dayCount):number {
    let sum = 0;
    for(let i = 0; i < data.length; i++){
        if(data[i].length<dayCount){
            for(let j = 0; j < data[i].length; j++){
                sum += +data[i][j];
            }
        }else {
            for(let j = 0; j < dayCount; j++){
                sum += +data[i][j];
            }
        }
    }
    return sum;
}


/**
 * 获取折线图一组数据的总和
 * @param data 需要展示的数据
 * @param dayCount 需要展示在图上的天数
 * @returns {number}
 */
export function getSingleLineSum(data, dayCount): number {
    let sum = 0;
    if(data.length<dayCount){
        for (let j = 0; j < data.length; j++) {
            sum += +data[j];
        }
    }else {
        for (let j = 0; j < dayCount; j++) {
            sum += +data[j];
        }
    }
    return sum;
}


/**
 * 将全国地图的订单数量累加
 * @param data 需要查询的日期
 * @returns {{sum: number, ave: any}} 返回一个总数和省平均值
 */
export function getMapSum(data) {
    let sum = 0, ave;
    for (let i = 0; i < data.length; i++) {
        sum += +data[i].value;
    }
    ave = Math.ceil(sum / 34)||0;
    return {
        sum: sum,
        ave: ave
    };
}


/**
 * 根据后台返回的数据获取到对应日期的订单量,也就是绘制折线图的数据
 * @param lineData  后天I
 * @param monthData 需要查询的日期
 * @returns {Array} 返回一个数组
 */
export function getLineArr(lineData, monthData) {
    let temp = [], lineDataArr = [];
    for (let i = 0; i < lineData.length; i++) {
        lineDataArr.push(lineData[i].group_date);
    }
    for (let i = 0; i < monthData.length; i++) {
        let index = lineDataArr.indexOf(monthData[i]);
        if (index == -1) {
            temp.push(0);
        } else {
            temp.push(lineData[index].value);
        }
    }
    return temp;
}