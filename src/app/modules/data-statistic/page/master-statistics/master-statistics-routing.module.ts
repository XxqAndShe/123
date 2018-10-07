/**
 * Created by Administrator on 2017/4/19.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterStatisticsComponent }from'./master-statistics.component';

/*三级组件*/
import { MasterOrderInformation }from'./page/master-order-information/order-information.component';
import { MasterOrderTrend }from'./page/master-order-trend/order-trend.component';
import { MasterQuantity }from'./page/master-quantity/master-quantity.component';
import { RevenueTrends }from'./page/master-revenue-trends/revenue-trends.component';

const MasterStatisticRouter:Routes=[
    {
        path: '',
        component: MasterStatisticsComponent,
        children: [
            {
                path: '',
                redirectTo: 'master-order-trend',
                pathMatch: 'full'
            },
            {
                path: 'master-order-trend',
                component: MasterOrderTrend
            },
            {
                path: 'master-order-information',
                component: MasterOrderInformation
            },
            {
                path: 'master-quantity',
                component: MasterQuantity
            },
            {
                path: 'master-revenue-trends',
                component: RevenueTrends
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(MasterStatisticRouter)],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class MasterStatisticRoutingModule{ }