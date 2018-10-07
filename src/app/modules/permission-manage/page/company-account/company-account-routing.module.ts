/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompanyAccountComponent} from "./company-account.component";
import { PageCompanyAccountComponent } from './page/page-company-account.component';

const accountRouter:Routes=[
    {
        path:'',
        component:CompanyAccountComponent,
        children: [
            {
                path:'',
                redirectTo:'company-account',
                pathMatch:'full'
            },
            {
                path: 'company-account',
                component: PageCompanyAccountComponent
            }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(accountRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class CompanyAccountRoutingModule{ }
