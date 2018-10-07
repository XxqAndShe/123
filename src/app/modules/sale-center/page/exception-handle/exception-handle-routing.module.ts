/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExceptionHandleComponent } from './exception-handle.component';

/* 三级组件 */
import { ExceptionDealComponent } from './page/exception-deal/exception-deal.component';

const ExceptionHandleRouter:Routes=[
  {
    path: '',
    component: ExceptionHandleComponent,
    children: [
      {
        path: '',
        component: ExceptionDealComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ExceptionHandleRouter)],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})
export class ExceptionHandleRoutingModule{ }
