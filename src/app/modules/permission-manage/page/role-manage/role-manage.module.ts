/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';
import {TreeModule} from 'primeng/primeng';

import { RoleManageRoutingModule } from './role-manage-routing.module';
import { RoleManageComponent } from './role-manage.component';
import { PageRoleManageComponent } from './page/page-role-manage.component';
import {RoleAddComponent} from './page/role-add.component'
import {RoleModifyComponent} from './page/role-modify.component'
import {PowerSettingComponent} from './page/power-setting.component'
import {RoleSearchComponent} from './page/role-search.component'
import {RoleDelComponent} from './page/role-del.component'
@NgModule({
  imports: [
    RoleManageRoutingModule,
    ShareModule,
    TreeModule
  ],
  declarations: [
    RoleManageComponent,
    PageRoleManageComponent,
    RoleAddComponent,
    RoleModifyComponent,
    PowerSettingComponent,
    RoleSearchComponent,
    RoleDelComponent
  ],
  providers: [
  ],
})
export class RoleManageModule{ }
