/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntelManageComponent } from './intel-manage.component';

/* 三级组件 */
import { IntelAddrManageComponent } from './page/intel-addr-manage/intel-addr-manage.component';
import { IntelRuleSettingComponent } from './page/intel-rule--setting/intel-rule-setting.component';
import { AddrPointMasterComponent } from './page/addr-point-master/addr-point-master.component';
import { PeoPointMasterComponent } from './page/peo-point-master/peo-point-master.component';

const IntelManageRouter:Routes=[
    {
        path: '',
        component: IntelManageComponent,
        children: [
            {
                path: '',
                redirectTo: 'intel-addr-manage',
                pathMatch: 'full'
            },
            {
                path: 'intel-addr-manage',
                component: IntelAddrManageComponent
            },
            {
                path: 'intel-rule-manage',
                component: IntelRuleSettingComponent
            },
            {
                path: 'addr-point-master',
                component: AddrPointMasterComponent
            },
            {
                path: 'peo-point-master',
                component: PeoPointMasterComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(IntelManageRouter)],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class IntelManageRoutingModule{ }
