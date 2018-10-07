/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';

import { CompanyManageRoutingModule } from './company-manage-routing.module';
import { CompanyManageComponent } from './company-manage.component';
import { PageComponentAccountComponent } from './page/page-company-manage.component';

//dialog
import { RestartUseComponent } from './dialog/restart-use.component';
import {AddCompanyComponent} from "./dialog/add-company.component";
import {StopUseComponent} from "./dialog/stop-use.component";
import {ModifyCompanyComponent} from "./dialog/modify-company.component";
import {SearchCompanyComponent} from "./dialog/search-company.component";
import {HistoryInfoComponent} from "./dialog/history-info.component";
@NgModule({
  imports: [
    CompanyManageRoutingModule,
    ShareModule
  ],
  declarations: [
      CompanyManageComponent,
      PageComponentAccountComponent,
      RestartUseComponent,
      AddCompanyComponent,
      StopUseComponent,
      ModifyCompanyComponent,
      SearchCompanyComponent,
      HistoryInfoComponent
  ],
  providers: [
  ],
})
export class CompanyManageModule{ }
