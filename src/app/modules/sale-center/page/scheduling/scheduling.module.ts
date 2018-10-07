/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { SchedulingRoutingModule } from './scheduling-routing.module';

import { SchedulingComponent } from './scheduling.component';

/* 三级组件 */
// import { RepairSchedulingComponent } from './page/repair-scheduling/repair-scheduling.component';
// import { ReturnSchedulingComponent } from './page/return-scheduling/return-scheduling.component';

/* 三级组件弹框 */
// import { CarrierDetailComponent } from './page/share/carrier-detail.component';
// import { ExceptionInfoComponent } from './page/share/exception-info.component';
// import { FollowInfoComponent } from './page/share/follow-info.component';
// import { RepairDetailComponent } from './page/share/repair-detail.component';
// import { ResuppliedGoodComponent } from './page/share/resupplied-good.component';
// import { SupplierDetailComponent } from './page/share/supplier-detail.component';
// import { TrailInfoComponent } from './page/share/trail-info.component';

/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';
import {RepairSchedulingComponent} from "./page/repair-scheduling/repair-scheduling.component";
import {ReturnSchedulingComponent} from "./page/return-scheduling/return-scheduling.component";
import {VerifyDistributeComponent} from "./page/share/verify-distribute.component";
import {AcceptComponent} from "./page/share/accept.component";
import {TraceTimeComponent} from "./page/share/trace-time.component";
import {PickGoodComponent} from "./page/share/pick-good.component";
import {MaintenanceCompleteComponent} from "./page/share/maintenance-complete.component";
import {cancelAllocationComponent} from "./page/share/cancel-allocation.component";
import {PickGoodsFinishComponent} from "./page/share/pick-goods-finish.component";
import {CarrierReturnComponent} from "./page/carrier-Return/carrier-return.component";
import {GoodsOutComponent} from "./page/carrier-Return/modal/goods-out.component";
import {GoodsOrClientComponent} from "./page/share/goods-or-client.component";
import {GoodsReturnComponent} from "./page/carrier-Return/modal/goods-return.component";
/* 导入服务 */


@NgModule({
  imports: [

    ShareModule
  ],
  declarations: [
    SchedulingComponent,
    RepairSchedulingComponent,
    ReturnSchedulingComponent,
      CarrierReturnComponent,
    VerifyDistributeComponent,
    AcceptComponent,
    TraceTimeComponent,
    PickGoodComponent,
    MaintenanceCompleteComponent,
    cancelAllocationComponent,
    PickGoodsFinishComponent,
      GoodsOutComponent,
      GoodsOrClientComponent,
      GoodsReturnComponent
  ],
  exports:[
    SchedulingComponent,
    RepairSchedulingComponent,
    ReturnSchedulingComponent,
      CarrierReturnComponent,
    VerifyDistributeComponent,
    AcceptComponent,
    TraceTimeComponent,
    PickGoodComponent,
      GoodsOutComponent,
      GoodsOrClientComponent,
      GoodsReturnComponent
  ],
  providers: [

  ],
})
export class SchedulingModule{ }
