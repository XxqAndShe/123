/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CooperationCompanyComponent} from './cooperation-company.component';

/* 二级组件 */
import {CertifyManageComponent} from './page/certify-manage/certify-manage.component';
import {DataChangeComponent} from './page/data-change/data-change.component';
import {MasterManageComponent} from './page/master-manage/master-manage.component';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const cooperationRouter: Routes = [
    {
        path: '',
        component: CooperationCompanyComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'master-manage',
                pathMatch: 'full'
            },
            {
                path: 'master-manage',
                component: MasterManageComponent
            },
            {
                path: 'certify-manage',
                component: CertifyManageComponent
            },
            {
                path: 'data-change',
                component: DataChangeComponent
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(cooperationRouter)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})
export class CooperationCompanyRoutingModule {
}
