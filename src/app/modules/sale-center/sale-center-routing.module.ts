/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SaleCenterComponent} from './sale-center.component';
import {ArbitrationHandleComponent} from "./page/arbitration-handle/arbitration-handle.component";
import {SchedulingComponent} from "./page/scheduling/scheduling.component";
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";
import {ComplainComponent} from "app/modules/sale-center/page/complain-manage/page/complain.component";


const saleCenterRouter: Routes = [
    {
        path: '',
        component: SaleCenterComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'exception-handle',
                pathMatch: 'full'
            },
            {
                path: 'scheduling',
                component: SchedulingComponent
                // loadChildren: './page/scheduling/scheduling.module#SchedulingModule'
            },
            {
                path: 'scheduling/:index',
                component: SchedulingComponent
                // loadChildren: './page/scheduling/scheduling.module#SchedulingModule'
            },
            {
                path: 'arbitration-handle',
                component: ArbitrationHandleComponent
                // : './page/arbitration-handle/arbitration-handle.module#ArbitrationHandleModule'
            },
            {
                path: 'exception-handle',
                loadChildren: './page/exception-handle/exception-handle.module#ExceptionHandleModule'
            },
            {
                path: 'exception-handle/:id',
                loadChildren: './page/exception-handle/exception-handle.module#ExceptionHandleModule'
            },
            {
                path: 'form-data',
                loadChildren: './page/form-data/form-data.module#FormDataModule'
            },
            {
                path: 'abnormal-sale',
                loadChildren: './page/abnormal-sale/abnormal-sale.module#AbnormalSaleModule'
            },
            {
                path: 'complain-manage',
                component: ComplainComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(saleCenterRouter)],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})

export class SaleCenterRoutingModule {
}
