import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbnormalStatisticsComponent } from "./abnormal-statistics.component";
import { AbnormalQuantityTrendComponent } from "./page/abnormal-quantity-trend/abnormal-quantity-trend.component";
import { AbnormalDealStaticComponent } from "./page/abnormal-deal-static/abnormal-deal-static.component";
import {AbnormalQuantityStaticComponent} from "./page/abnormal-quantity-static/abnormal-quantity-static.component";

const AbnormalStatisticsRouter:Routes = [
    {
        path: '',
        component: AbnormalStatisticsComponent,
        children: [
          {
              path: '',
              redirectTo: 'abnormal-quantity-static',//默认路由
              pathMatch: 'full'
          },
          {
              path: 'abnormal-quantity-static',
              component: AbnormalQuantityStaticComponent
          },
          {
              path: 'abnormal-quantity-trend',
              component: AbnormalQuantityTrendComponent
          },
          {
              path: 'abnormal-deal-static',
              component: AbnormalDealStaticComponent
          }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(AbnormalStatisticsRouter)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})
export class AbnormalStatisticsRoutingModule {}