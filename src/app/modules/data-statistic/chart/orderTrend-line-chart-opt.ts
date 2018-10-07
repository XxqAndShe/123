/**
 * Created by giscafer on 2017/4/19.
 */
/**
 * Created by Administrator on 2017/4/19.
 */

export function getMultiLineOption(opt) {
  if (!opt) {
    throw new Error('opt 参数必填')
  }

  return {
    title: {
      text: opt.title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['服务单','售后单','异常单']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: opt.xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name:'服务单',
        type:'line',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        data:opt.series[0]
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
        data:opt.series[1]
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
        data:opt.series[2]
      }
    ]
  };
}


