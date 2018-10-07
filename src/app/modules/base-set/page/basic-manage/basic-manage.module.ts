/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from "@angular/core";
import {BasicManageRoutingModule} from "./basic-manage-routing.module";
import {BasicManageComponent} from "./basic-manage.component";
/* 三级组件 */
import {BasicSettingComponent} from "./page/basic-setting/basic-setting.component";
import {ExceptionDataComponent} from "./page/exception-data/exception-data.component";
import {RemindSettingComponent} from "./page/remind-setting/remind-setting.component";
/* 引用share组件 */
import {ShareModule} from "../../../../share/share.module";
import {BasicSettingService} from "./service/basic-setting.service";
import {ExceptionDataService} from "./service/exception-data.service";

import {ExceptionDataModalComponent} from './page/exception-data/exception-data-modal.component'

@NgModule({
  imports: [
    BasicManageRoutingModule,
    ShareModule
  ],
  declarations: [
    BasicManageComponent,
    BasicSettingComponent,
    ExceptionDataComponent,
    RemindSettingComponent,
    ExceptionDataModalComponent
  ],
  providers: [
    BasicSettingService,
    ExceptionDataService
  ],
})
export class BasicManageModule{ }
