import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*引入组件*/
import { BusStatisticsComponent } from "./bus-statistics.component";


import { BusRankingComponent } from "./page/bus-ranking/bus-ranking.component";
import { MerchantQuantityComponent } from "./page/merchant-quantity/merchant-quantity.component";
import { BusOrderComponent } from "./page/bus-order/bus-order.component";
import { ExpendTrendsComponent } from "./page/expenditure-trends/expend-trends.component";

const BuStasticsRouter:Routes = [
    {
        path: '',
        component: BusStatisticsComponent,
        children: [
            {
                path: '',
                redirectTo: 'bus-ranking',//默认路由
                pathMatch: 'full'
            },
            {
                path: 'bus-ranking',
                component: BusRankingComponent
            },
            {
                path: 'merchant-quantity',
                component: MerchantQuantityComponent
            },
            {
                path: 'bus-order',
                component: BusOrderComponent
            },
            {
                path: 'expenditure-trends',
                component: ExpendTrendsComponent
            },
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(BuStasticsRouter)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})
export class BugStasticsRoutingModule {}