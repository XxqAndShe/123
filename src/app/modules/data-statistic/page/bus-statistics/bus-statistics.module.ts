import { NgModule } from '@angular/core';

/*路由模块*/
import { BugStasticsRoutingModule } from "./bus-statistics-routing.module";

import { BusStatisticsComponent } from "./bus-statistics.component";

/*商家排名*/
import { BusRankingComponent } from "./page/bus-ranking/bus-ranking.component";
/*商家数量*/
import { MerchantQuantityComponent } from "./page/merchant-quantity/merchant-quantity.component";
/*商家订单*/
import { BusOrderComponent } from "./page/bus-order/bus-order.component";
/*商家趋势*/
import { ExpendTrendsComponent } from "./page/expenditure-trends/expend-trends.component";
import { ShareModule } from "../../../../share/share.module";
import { SearchTopComponent } from "../../../sale-center/page/abnormal-sale/page/share/search-top.component";
import { ArbitrationWinComponent } from "../../../sale-center/page/arbitration-handle/share/arbitration-win.component";
import { TableGridComponent } from "../../../sale-center/page/arbitration-handle/share/table-grid.component";

//引入公共模块

@NgModule({
    imports: [
        ShareModule,
        BugStasticsRoutingModule
    ],
    declarations: [
        BusStatisticsComponent,
        BusRankingComponent,
        MerchantQuantityComponent,
        BusOrderComponent,
        ExpendTrendsComponent
    ],
    providers: [
    ],
})
export class BugStasticsModule{ }
