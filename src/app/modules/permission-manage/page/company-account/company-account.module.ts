/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';

import { CompanyAccountRoutingModule } from './company-account-routing.module';
import { CompanyAccountComponent } from './company-account.component';
import { PageCompanyAccountComponent } from './page/page-company-account.component';
@NgModule({
  imports: [
    CompanyAccountRoutingModule,
    ShareModule
  ],
  declarations: [
      CompanyAccountComponent,
      PageCompanyAccountComponent
  ],
  providers: [
  ],
})
export class CompanyAccountModule{ }
