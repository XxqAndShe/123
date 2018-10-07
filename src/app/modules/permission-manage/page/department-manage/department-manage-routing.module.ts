/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentManageComponent } from './department-manage.component';
import { PageDepartmentManageComponent } from './page/page-department-mangae.component';
const departmentRouter:Routes=[
  {
     path:'',
     component:DepartmentManageComponent,
     children: [
       {
         path: '',
         redirectTo: 'department-manage',
         pathMatch: 'full'
       },
       {
          path: 'department-manage',
          component:PageDepartmentManageComponent
       }
     ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(departmentRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class DepartmentManageRoutinModule{ }
