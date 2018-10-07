/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { ExceptionHandleRoutingModule } from './exception-handle-routing.module';

import { ExceptionHandleComponent } from './exception-handle.component';

/* 三级组件 */
import { ExceptionDealComponent } from './page/exception-deal/exception-deal.component';

/* 三级组件弹框 */

/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';
import {ExceptionDealService} from "./service/exception-deal.service";
import {BasicSettingService} from "../../../base-set/page/basic-manage/service/basic-setting.service";
import {ExceptionDataService} from "../../../base-set/page/basic-manage/service/exception-data.service";
import {AbnormalModifyComponent} from "./share/abnormal-modify.component";
import {OrderInfoComponent} from "./share/order-info.component";
import {AreaService} from "../../../../share/app-service/area.service";
import {AcceptedComponent} from "./share/accepted.component";

@NgModule({
  imports: [
    ExceptionHandleRoutingModule,
    ShareModule
  ],
  declarations: [
      ExceptionHandleComponent,
      ExceptionDealComponent,
      AbnormalModifyComponent,
      OrderInfoComponent,
      AcceptedComponent
  ],
  providers: [
      ExceptionDealService,
      BasicSettingService,
      ExceptionDataService,
      AreaService
  ],
})
export class ExceptionHandleModule{ }
