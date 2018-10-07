/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApiManageComponent } from './api-manage.component';
import { PageApiManageComponent } from './page/page-api-manage.component';
const apiRouter:Routes=[
  {
     path:'',
     component:ApiManageComponent,
     children: [
      {
         path:'',
         redirectTo:'api-manage',
         pathMatch:'full'
       },
      {
        path: 'api-manage',
        component: PageApiManageComponent
      }
     ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(apiRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class ApiManageRoutingModule{ }
