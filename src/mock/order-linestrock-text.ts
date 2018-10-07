/**
 * Created by giscafer on 2017/4/18.
 */
export const OrderLineStackDataText= {
    title: {
        // text: '堆叠区域图'
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
            data : ['2016年7月','2016年8月','2016年9月','2016年10月','2016年11月','2016年12月','2017年1月','2017年2月','2017年3月','2017年4月']
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
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data:[720, 932, 901, 934, 1290, 1130, 1220, 980, 1050, 1340]
        },
        {
            name:'售后单',
            type:'line',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data:[420, 382, 291, 154, 290, 330, 310, 520, 410, 280]
        },
        {
            name:'异常单',
            type:'line',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data:[120, 132, 101, 134, 90, 230, 210, 180, 143, 60]
        }
    ]
};