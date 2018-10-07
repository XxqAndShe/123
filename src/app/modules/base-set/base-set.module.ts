/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';

import { BaseSetRoutingModule } from './base-set-routing.module';

import { BaseSetComponent } from './base-set.component';
import { AddrManageComponent } from './page/addr-manage/addr-manage.component'
import { IntimeRuleSetComponent } from './page/intime-rule-set/intime-rule-set.component'
import { CreditManageComponent } from './page/credit-manage/credit-manage.component'
import { CityManageComponent } from './page/city-manage/city-manage.component'
import { IntimeAsideComponent } from './page/intime-rule-set/intime-aside.component'
import { timelySettingComponent } from "./page/intime-rule-set/timely-setting.component"
//import {StateSearchService} from "../financial-center/page/deposit-manager/state-search.service";
import { AddModifyCreditModule } from "./page/add-modify-credit/add-modify-credit.component";
import { AddAreaComponent } from "./page/addr-manage/add-area.component";
import { AddCityComponent } from "./page/addr-manage/add-city.component";
import { AddAppManageComponent } from "app/modules/base-set/page/app-manage/add-app-manage/add-app-manage.component";
import { AppManageComponent } from "app/modules/base-set/page/app-manage/app-manage.component";
import {AddWallComponent} from "./page/addr-manage/add-wall.component";
import {ComplaitAddComponent} from "./page/complaint-manage/add-and-modify/add/complait-add.component";
import {AddAndModifyComponent} from "./page/complaint-manage/add-and-modify/add-and-modify.component";
import {ComplaitDelComponent} from "./page/complaint-manage/del/complait-del.component";
import {ComplaintManageComponent} from "./page/complaint-manage/complaint-manage.component";



@NgModule({
  imports: [
    CommonModule,
    BaseSetRoutingModule,
    ShareModule,
    AddModifyCreditModule
  ],
  exports: [
    AddModifyCreditModule,
    AddAppManageComponent,
  ],
  declarations: [
    BaseSetComponent,
    AddrManageComponent,
    IntimeRuleSetComponent,
    CreditManageComponent,
    CityManageComponent,
    IntimeAsideComponent,
    timelySettingComponent,
    AddAreaComponent,
    AppManageComponent,
    AddAppManageComponent,
    AddCityComponent,
    AddWallComponent,
    ComplaitAddComponent,
    AddAndModifyComponent,
    ComplaitDelComponent,
    ComplaintManageComponent
  ],
  providers: [
  ]
})
export class BaseSetModule { }
