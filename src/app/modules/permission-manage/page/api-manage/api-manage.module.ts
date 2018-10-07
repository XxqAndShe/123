/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';

import { ApiManageRoutingModule } from './api-manage-routing.module';
import { ApiManageComponent } from './api-manage.component'
import { PageApiManageComponent } from './page/page-api-manage.component'

@NgModule({
  imports:[
    ApiManageRoutingModule,
    ShareModule
  ],
  declarations: [
    ApiManageComponent,
    PageApiManageComponent
  ],
  providers: [
  ],
})
export class ApiManageModule{ }
