/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BaseSetComponent} from "./base-set.component";
import {AddrManageComponent} from './page/addr-manage/addr-manage.component'
import {IntimeRuleSetComponent} from './page/intime-rule-set/intime-rule-set.component'
import {CreditManageComponent} from './page/credit-manage/credit-manage.component'
import {CityManageComponent} from './page/city-manage/city-manage.component'
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";
import { AppManageComponent } from "app/modules/base-set/page/app-manage/app-manage.component";
import { AddAppManageComponent } from "app/modules/base-set/page/app-manage/add-app-manage/add-app-manage.component";
import {ComplaintManageComponent} from "app/modules/base-set/page/complaint-manage/complaint-manage.component";
const baseRouter: Routes = [
    {
        path: '',
        component: BaseSetComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'intel-manage',
                pathMatch: 'full'
            },
            {
                path: 'intel-manage',
                loadChildren: './page/intel-manage/intel-manage.module#IntelManageModule'
            },
            {
                path: 'price-manage',
                loadChildren: './page/price-manage/price-manage.module#PriceManageModule'
            },
            {
                path: 'basic-manage',
                loadChildren: './page/basic-manage/basic-manage.module#BasicManageModule'
            },
            {path: 'addr-manage', component: AddrManageComponent},
            {path: 'intime-rule', component: IntimeRuleSetComponent},
            {path: 'credit-manage', component: CreditManageComponent},
            {path: 'app-manage', component: AppManageComponent},
            {path: 'complaint-manage', component: ComplaintManageComponent},
            {path: 'city-manage', component: CityManageComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(baseRouter)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})

export class BaseSetRoutingModule {
}
