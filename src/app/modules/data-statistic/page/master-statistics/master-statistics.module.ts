/**
 * Created by Administrator on 2017/4/19.
 */

import { NgModule } from '@angular/core';

import { MasterStatisticRoutingModule }from'./master-statistics-routing.module';

import { MasterStatisticsComponent } from './master-statistics.component';
import { ShareModule } from "../../../../share/share.module";

/* 三级组件 */
import { MasterOrderInformation } from './page/master-order-information/order-information.component';
import { MasterOrderTrend } from './page/master-order-trend/order-trend.component';
import { MasterQuantity } from './page/master-quantity/master-quantity.component';
import { RevenueTrends } from './page/master-revenue-trends/revenue-trends.component';


@NgModule({
    imports: [
        MasterStatisticRoutingModule,
        ShareModule
    ],
    declarations: [
        MasterStatisticsComponent,
        MasterOrderInformation,
        MasterOrderTrend,
        MasterQuantity,
        RevenueTrends
    ],
    providers: [
    ],
})
export class MasterStatisticModule{ }