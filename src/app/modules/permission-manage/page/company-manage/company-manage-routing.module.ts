/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyManageComponent } from './company-manage.component';
import { PageComponentAccountComponent } from './page/page-company-manage.component';
const baseRouter:Routes=[
  {
     path:'',
     component:CompanyManageComponent,
     children: [
       {
         path: '',
         redirectTo: 'company-manage',
         pathMatch: 'full'
       },
       {
          path: 'company-manage',
          component:PageComponentAccountComponent
       }
     ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(baseRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class CompanyManageRoutingModule{ }
