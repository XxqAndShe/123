/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasicManageComponent } from './basic-manage.component';

/* 三级组件 */
import { BasicSettingComponent } from './page/basic-setting/basic-setting.component';
import { ExceptionDataComponent } from './page/exception-data/exception-data.component';
import { RemindSettingComponent } from './page/remind-setting/remind-setting.component';

const basicManageRouter:Routes=[
  {
    path: '',
    component: BasicManageComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-setting',
        pathMatch: 'full'
      },
      {
        path: 'basic-setting',
        component: BasicSettingComponent
      },
      {
        path: 'exception-data',
        component: ExceptionDataComponent
      },
      {
        path: 'remind-setting',
        component: RemindSettingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(basicManageRouter)],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})
export class BasicManageRoutingModule{ }
