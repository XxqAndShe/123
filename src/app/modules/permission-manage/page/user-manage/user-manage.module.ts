/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';
import {TreeModule} from 'primeng/primeng';

import { UserManageRoutingModule } from './user-manage-routing.module';

import { UserManageComponent } from './user-manage.component';
import { PageUserManageComponent } from './page/page-user-manage.component';

/**
 * 导入弹框
 */
import { AddMemberComponent } from './page/add-member.component';
import { BasicDataComponent } from './page/basic-data.component';
import { DeleteTipComponent } from './page/delete-tip.component';
import { DataAuthorityComponent } from './page/data-authority.component';
import { SearchComponent } from './page/search.component';
import { SetDimissionComponent } from './page/set-dimission.component';

@NgModule({
  imports: [
    UserManageRoutingModule,
    ShareModule,
    TreeModule
  ],
  declarations: [
    UserManageComponent,
    PageUserManageComponent,
    AddMemberComponent,
    BasicDataComponent,
    DeleteTipComponent,
    DataAuthorityComponent,
    SearchComponent,
    SetDimissionComponent
  ],
  providers: [
  ],
})
export class UserManageModule{ }
