/**
 * Created by xiaoluo on 2017/4/19.
 */
export function getMapData(opt) {
    if(!opt){
        throw new Error('opt 参数必填')
    }

  return {
      title: {
          text: opt.title,
          left: 'center'
      },
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          selectedMode:false,
          data:[opt.legend]
      },
      visualMap: {
          min: 0,
          max: opt.max || 200,
          left: 'left',
          top: 'bottom',
          text: ['高','低'],           // 文本，默认为数值文本
          inRange: {
              color: ['#e0ffff', '#006edd']
          },
          calculable: true
      },
      series: [
          {
              name: opt.legend,
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                  normal: {
                      show: true
                  },
                  emphasis: {
                      show: true
                  }
              },
              itemStyle: {
                  normal:{
                      borderColor: 'rgba(0, 0, 0, 0.2)'
                  },
                  emphasis:{
                      areaColor: null,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowBlur: 20,
                      borderWidth: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              },
              data:opt.series
          },
      ]
  }
}