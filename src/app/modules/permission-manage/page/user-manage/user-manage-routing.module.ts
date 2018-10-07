/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserManageComponent } from './user-manage.component';

import { PageUserManageComponent } from './page/page-user-manage.component';

const userRouter:Routes=[
  {
     path:'',
     component:UserManageComponent,
     children: [
       {
         path: '',
         redirectTo: 'user-manage',
         pathMatch: 'full'
       },
       {
          path: 'user-manage',
          component:PageUserManageComponent
       }
     ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class UserManageRoutingModule{ }
