/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExamineManageComponent} from './examine-manage.component';

/* 二级组件 */
import {AreaKpiComponent} from './page/area-kpi/area-kpi.component';
import {MasterKpiComponent} from './page/master-kpi/master-kpi.component';
import {CreditManageComponent} from './page/credit-manage/credit-manage.component';
import {ShipperKpiComponent} from './page/shipper-kpi/shipper-kpi.component';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";


const examineRouter: Routes = [
    {
        path: '',
        component: ExamineManageComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'area-kpi',
                pathMatch: 'full'
            },
            {
                path: 'shipper-kpi',
                component: ShipperKpiComponent
            },
            {
                path: 'area-kpi',
                component: AreaKpiComponent
            },
            {
                path: 'master-kpi',
                component: MasterKpiComponent
            },
            {
                path: 'credit-manage',
                component: CreditManageComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(examineRouter)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})

export class ExamineManageRoutingModule {
}
