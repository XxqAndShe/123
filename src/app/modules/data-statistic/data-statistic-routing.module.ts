/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {DataStatisticComponent} from "./data-statistic.component";
/*引入二级组件*/
import {OrderStatisticsComponent} from "./page/order-statistics/order-statistics.component";
import {AbnormalReportComponent} from "./page/abnormal-report/abnormal-report.component";
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const dataRouter: Routes = [
    {
        path: '',
        component: DataStatisticComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'order-statistics',
                pathMatch: 'full'
            },
            {
                path: 'order-statistics',
                component: OrderStatisticsComponent
            },
            {
                path: 'bus-statistics',
                loadChildren: './page/bus-statistics/bus-statistics.module#BugStasticsModule'
            },
            {
                path: 'master-statistics',
                loadChildren: './page/master-statistics/master-statistics.module#MasterStatisticModule'
            },
            {
                path: 'abnormal-statistics',
                loadChildren: './page/abnormal-statistics/abnormal-statistics.module#AbnormalStatisticsModule'
            },
            {
                path: 'adjust-statistics',
                loadChildren: './page/adjust-statistics/adjust-statistics.module#AdjustStatisticsModule'
            },
            {
                path: 'abnormal-adjust',
                component: AbnormalReportComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(dataRouter)
    ],
    exports: [RouterModule], //这样关联模块的组件可以访问路由的声明
    declarations: [],
    providers: [],
})
export class DataStatisticRoutingModule {
}
