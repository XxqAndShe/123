/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';

import { DepartmentManageRoutinModule } from './department-manage-routing.module';
import { DepartmentManageComponent } from './department-manage.component';
import { PageDepartmentManageComponent } from './page/page-department-mangae.component';
import { DepartmentAddComponent } from './page/department-add.component';
import { DepartmentDelComponent } from './page/department-del.component';
import { DepartmentModifyComponent } from './page/department-modify.component';
import { DepartmentSearchComponent } from './page/department-search.component';
import { PowerSettingComponent } from './page/power-setting.component';

@NgModule({
  imports: [
    DepartmentManageRoutinModule,
    ShareModule
  ],
  declarations: [
    DepartmentManageComponent,
    PageDepartmentManageComponent,
    DepartmentAddComponent,
    DepartmentDelComponent,
    DepartmentModifyComponent,
    DepartmentSearchComponent,
    PowerSettingComponent
  ],
  providers: [
  ],
})
export class DepartmentManageModule{ }
