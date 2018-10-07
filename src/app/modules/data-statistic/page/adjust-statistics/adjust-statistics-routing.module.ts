/**
 * Created by xiaoluo on 2017/4/20.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

//引入主组件
import {AdjustStatisticsComponent} from './adjust-statistics.component';
import {DistributionStaticComponent} from "./page/distribution-static/distribution-static.component";
import {DistributionTrendComponent} from "./page/distribution-trend/distribution-trend.component";
import {DispatcherConditionComponent} from "./page/dispatcher-condition/dispatcher-condition.component";


const AdjustStatisticsRouter: Routes = [
  {
    path: '',
    component: AdjustStatisticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'distribution-static',//默认路由
        pathMatch: 'full'
      },
      {
        path: 'distribution-static',
        component: DistributionStaticComponent,
      },
      {
        path: 'distribution-trend',
        component: DistributionTrendComponent,
      },
      {
        path: 'dispatcher-condition',
        component: DispatcherConditionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AdjustStatisticsRouter)],
  exports: [RouterModule],
  declarations: [],
  providers: []
})
export class AdjustStatisticsRoutingModule {
}