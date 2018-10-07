/**
 * Created by xiaoluo on 2017/4/20.
 */
import {NgModule} from '@angular/core';

/*路由模块*/

import {ShareModule} from "../../../../share/share.module";
import {DistributionStaticComponent} from './page/distribution-static/distribution-static.component';
import {DistributionTrendComponent} from './page/distribution-trend/distribution-trend.component';
import {DispatcherConditionComponent} from './page/dispatcher-condition/dispatcher-condition.component';
import {AdjustStatisticsRoutingModule} from "./adjust-statistics-routing.module";
import {AdjustStatisticsComponent} from "./adjust-statistics.component";


//引入公共模块

@NgModule({
  imports: [
    ShareModule,
    AdjustStatisticsRoutingModule
  ],
  declarations: [
    AdjustStatisticsComponent,
    DistributionStaticComponent,
    DistributionTrendComponent,
    DispatcherConditionComponent],
  providers: [],
})
export class AdjustStatisticsModule {
}
