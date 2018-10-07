/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchedulingComponent } from './scheduling.component';

/* 三级组件 */
import { RepairSchedulingComponent } from './page/repair-scheduling/repair-scheduling.component';
import { ReturnSchedulingComponent } from './page/return-scheduling/return-scheduling.component';

const SchedulingRouter:Routes=[
  {
    path: '',
    component: SchedulingComponent,
    children: [
      {
        path: '',
        redirectTo: 'repair-scheduling',
        pathMatch: 'full'
      },
      {
        path: 'repair-scheduling',
        component: RepairSchedulingComponent
      },
      {
        path: 'return-scheduling',
        component: ReturnSchedulingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(SchedulingRouter)],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})
export class SchedulingRoutingModule{ }
