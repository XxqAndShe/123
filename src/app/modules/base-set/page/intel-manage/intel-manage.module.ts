
import { NgModule } from '@angular/core';

import { IntelManageRoutingModule } from './intel-manage-routing.module';

import { IntelManageComponent } from './intel-manage.component';
import {TreeModule} from 'primeng/primeng';

/* 三级组件 */
import { IntelAddrManageComponent } from './page/intel-addr-manage/intel-addr-manage.component';
import { IntelRuleSettingComponent } from './page/intel-rule--setting/intel-rule-setting.component';
import { AddrPointMasterComponent } from './page/addr-point-master/addr-point-master.component';
import { PeoPointMasterComponent } from './page/peo-point-master/peo-point-master.component';
import {IntelMatchAreaComponent} from './page/intel-addr-manage/intel-match-area.component'
import {AddAsideComponent} from "./page/peo-point-master/add-aside.component"
import {AddrAsideComponent} from "./page/addr-point-master/addr-aside.component"
import {ShareModule} from "../../../../share/share.module";
import { intelligentMatchingComponent }from'./page/intel-rule--setting/intelligent-matching.component';
import { ModifyMasterComponent }from"./page/peo-point-master/add-modify-master.component";
import { IntelModifyMasterComponent }from"./page/addr-point-master/intel-modify-master.component"




@NgModule({
    imports: [
        IntelManageRoutingModule,
        ShareModule,
        TreeModule,
    ],
    declarations: [
        IntelManageComponent,
        IntelAddrManageComponent,
        IntelRuleSettingComponent,
        AddrPointMasterComponent,
        PeoPointMasterComponent,
        IntelMatchAreaComponent,
        AddAsideComponent,
        AddrAsideComponent,
        intelligentMatchingComponent,
        ModifyMasterComponent,
        IntelModifyMasterComponent
    ],

    providers: [
    ]
})
export class IntelManageModule{ }
