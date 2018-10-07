/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { ExamineManageRoutingModule } from './examine-manage-routing.module';

import { ExamineManageComponent } from './examine-manage.component';
import {RatingModule} from 'primeng/primeng';
/* 二级组件 */
import { AreaKpiComponent } from './page/area-kpi/area-kpi.component';
import { MasterKpiComponent } from './page/master-kpi/master-kpi.component';
import { CreditManageComponent } from './page/credit-manage/credit-manage.component';
import { ShipperKpiComponent } from './page/shipper-kpi/shipper-kpi.component';

/* 二级组件弹框 */
import { CreditManageModalComponent } from './page/credit-manage/credit-manage-modal.component';
import { ShipperKpiModalComponent } from './page/shipper-kpi/shipper-kpi-modal.component';
import { MasterKpiModalComponent } from './page/master-kpi/master-kpi-modal.component';
import {CreditStandardComponent} from "./page/credit-manage/credit-standard.component";

/* 引用share组件 */
import { ShareModule } from '../../share/share.module';

/*导入服务*/


@NgModule({
  imports: [
    ExamineManageRoutingModule,
    ShareModule,
    RatingModule
  ],
  declarations: [
    ExamineManageComponent,
    AreaKpiComponent,
    MasterKpiComponent,
    ShipperKpiComponent,
    CreditManageComponent,
    CreditManageModalComponent,
    CreditStandardComponent,
    ShipperKpiModalComponent,
    MasterKpiModalComponent
  ],
  providers: [

  ],
})
export class ExamineManageModule{ }
