import { Component, OnInit } from '@angular/core';

//data数据
import * as data from './data';


@Component({
  selector: 'app-echarts-test',
  templateUrl: './echarts-test.component.html',
  styleUrls: ['./echarts-test.component.css']
})
export class EchartsTestComponent implements OnInit {

  // data1:
  chartOption1 = data.LineChartOptions1;

  // data2:
  chartOption2 = data.BarChartOptions1();
  dataset = data.BarChartDataset1;

  // data3:
  chartOption3 = data.PieChartOptions1;
  chartLoading = false;

  // data4:
  chartOption4 = data.BarChartOptions2;

  // data5:
  chartOption5: any = data.BarChartOptions1();
  revert: boolean = false;

  //堆叠图
  lineChartStackOption: any =data.LineStackDemoData;
  //堆叠图
  mapDemoOption: any =data.MapDemoOption;

  chartOption:any;

  constructor() { }

  ngOnInit() {

    this.getOptions();
  }

  /**
   * 切换加载效果
   */
  toggleLoading() {
    this.chartLoading = !this.chartLoading;
  }


  changeOptions() {
    this.chartOption5 = Object.assign({}, this.chartOption5);
    this.chartOption5.legend = { show: true };
    this.chartOption5.legend.data = [{ name: '直接访问', icon: 'circle' }];
    this.chartOption5.series = [];
    this.chartOption5.series[0] = {
      name: '直接访问',
      type: 'line',
      markPoint: {
        data: [
          { type: 'min', name: '最小值' },
          { type: 'max', name: '最大值' },
        ]
      }
    };
    this.revert = true;
  }

  /**
   * 图表单机事件
   * @param params
   */
  onChartClick(params) {
    ////console.log('click event: ', params);
    alert('你点击了'+params.seriesName)
  }
  /**
   * 图表双击事件
   * @param params
   */
  onChartDblClick(params) {
    ////console.log('dblclick event: ', params);
    alert('你双击了'+params.seriesName)
  }

  chageDataset() {
    this.dataset = (this.dataset == data.BarChartDataset2) ? data.BarChartDataset1 :  data.BarChartDataset2;
  }

  revertOptions() {
    this.chartOption5 = data.BarChartOptions1();
    this.revert = false;
  }

  getOptions(){
    // this.chartOption =
  }
}
