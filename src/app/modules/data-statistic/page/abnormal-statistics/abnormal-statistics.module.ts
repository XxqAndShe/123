import { NgModule } from '@angular/core';

/*路由模块*/

import { ShareModule } from "../../../../share/share.module";

import { AbnormalStatisticsRoutingModule } from "./abnormal-statistics-routing.module";
import { AbnormalStatisticsComponent } from "./abnormal-statistics.component";
import { AbnormalDealStaticComponent } from "./page/abnormal-deal-static/abnormal-deal-static.component";
import { AbnormalQuantityTrendComponent } from "./page/abnormal-quantity-trend/abnormal-quantity-trend.component";
import { AbnormalQuantityStaticComponent } from './page/abnormal-quantity-static/abnormal-quantity-static.component';

//引入公共模块

@NgModule({
    imports: [
        ShareModule,
        AbnormalStatisticsRoutingModule
    ],
    declarations: [
        AbnormalStatisticsComponent,
        AbnormalDealStaticComponent,
        AbnormalQuantityTrendComponent,
        AbnormalQuantityStaticComponent
    ],
    providers: [
    ],
})
export class AbnormalStatisticsModule{ }
