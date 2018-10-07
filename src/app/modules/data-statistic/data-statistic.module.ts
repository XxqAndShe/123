/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
//引入路由模块
import { DataStatisticRoutingModule } from './data-statistic-routing.module';
//引入数据统计的主模块
import { DataStatisticComponent } from './data-statistic.component';


/*引入二级组件*/
import { OrderStatisticsComponent } from './page/order-statistics/order-statistics.component';

//import { AdjustStatisticsComponent } from './page/adjust-statistics/adjust-statistics.component';

import { AbnormalReportComponent } from './page/abnormal-report/abnormal-report.component';

/* 引用share组件 */
import { ShareModule } from '../../share/share.module';


@NgModule({
  imports: [
    CommonModule,
    DataStatisticRoutingModule,
    ShareModule
  ],
  declarations: [
    DataStatisticComponent,
    OrderStatisticsComponent,
    //BusStatisticsComponent,
    //AdjustStatisticsComponent,
    AbnormalReportComponent
  ],
  providers: [
  ],
})
export class DataStatisticModule{ }
