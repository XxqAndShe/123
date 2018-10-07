/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManageComponent } from './role-manage.component';
import { PageRoleManageComponent } from './page/page-role-manage.component';
const roleRouter:Routes=[
  {
     path:'',
     component:RoleManageComponent,
     children: [
       {
         path: '',
         redirectTo: 'role-manage',
         pathMatch: 'full'
       },
       {
          path: 'role-manage',
          component:PageRoleManageComponent
       }
     ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(roleRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class RoleManageRoutingModule{ }
