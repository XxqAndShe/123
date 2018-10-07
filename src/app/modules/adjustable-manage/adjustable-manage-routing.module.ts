/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdjustableManageComponent} from './adjustable-manage.component';
import {PageAdjustTaskComponent} from './page/adjust-task/page-adjust-task.component';
import {PageWaitTrackingComponet} from './page/wait-tracking/page-wait-tracking.component';
import {PageTimeAbnormalComponent} from './page/time-abnormal/page-time-abnormal.component';
import {PageMixSearchComponent} from './page/mix-search/page-mix-search.component';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const adjustableRouter: Routes = [
    {
        path: '',
        component: AdjustableManageComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'adjustable-task',
                pathMatch: 'full'
            },
            {
                path: 'adjustable-task',
                component: PageAdjustTaskComponent
            },
            {
                path: 'wait-tracking',
                component: PageWaitTrackingComponet
            },
            {
                path: 'time-abnormal',
                component: PageTimeAbnormalComponent
            },
            {
                path: 'mix-search',
                component: PageMixSearchComponent
            },
            {
                path: 'mix-search/:inputWaybill',
                component: PageMixSearchComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(adjustableRouter)
    ],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class AdjustableManageRoutingModule {
}
