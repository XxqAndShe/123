import { ComplaintDetailComponent } from './page/complain-manage/modal/complaint-detail/complaint-detail.component';
/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {CommonModule}   from '@angular/common';
import {ShareModule} from "../../share/share.module";
import {ArbitrationHandleModule} from "./page/arbitration-handle/arbitration-handle.module";

import {SaleCenterRoutingModule} from './sale-center-routing.module';

import {SaleCenterComponent} from './sale-center.component';
import {SchedulingModule} from "./page/scheduling/scheduling.module";
import {ComplainComponent} from "./page/complain-manage/page/complain.component";
import {AddComplainComponent} from "./page/complain-manage/modal/add-complain/add-complain.component";
import {AppealComponent} from "./page/complain-manage/modal/appeal/appeal.component";
import {BackVisitComponent} from "./page/complain-manage/modal/back-visit/back-visit.component";
import {HandleComplainComponent} from "./page/complain-manage/modal/handle-complain/handle-complain.component";
import { AppealDetailComponent } from './page/complain-manage/modal/appeal-detail/appeal-detail.component';


@NgModule({
    imports: [
        CommonModule,
        SaleCenterRoutingModule,
        ArbitrationHandleModule,
        SchedulingModule,
        ShareModule
    ],
    declarations: [
        SaleCenterComponent,
        ComplainComponent,
        AddComplainComponent,
        AppealComponent,
        BackVisitComponent,
        HandleComplainComponent,
        AppealDetailComponent,
        ComplaintDetailComponent
    ],
    providers: []
})
export class SaleCenterModule {
}
