/**
 * Created by giscafer on 2017/4/19.
 */
/**
 * Created by Administrator on 2017/4/19.
 */

export function getLineOption(opt) {
    if(!opt){
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
            data: [opt.legend]
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
                name: opt.legend,
                type: 'line',

                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: opt.seriesData
            }
        ]
    };
}



