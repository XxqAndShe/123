/**
 * Created by Administrator on 2017/4/21.
 */

export const MasterTrendData= {
    title: {
        text: '异常单量趋势'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['服务单','售后单','异常单']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['4-15','4-16','4-17','4-18','4-19','4-20','4-21','4-22','4-23','4-24','4-25','4-26','4-27','4-28']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'服务单',
            type:'line',

            data:[120, 132, 101, 134, 90, 230, 210,121,744,444,47,454,774,747]
        },
        {
            name:'售后单',
            type:'line',

            data:[22, 18, 19, 23, 29, 33, 30,8,33,1,1,22,11]
        },
        {
            name:'异常单',
            type:'line',

            data:[15, 22, 21, 14, 19, 3, 2,7,8,4,5,22,7,5]
        },
    ]
};
