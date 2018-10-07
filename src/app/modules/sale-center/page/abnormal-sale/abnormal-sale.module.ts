/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { AbnormalSaleRoutingModule } from './abnormal-sale-routing.module';

import { AbnormalSaleComponent } from './abnormal-sale.component';

/* 三级组件 */
import { AbnormalOtherComponent} from './page/abnormal-other/abnormal-other.component';
import { AbnormalRepairComponent } from './page/abnormal-repair/abnormal-repair.component';
import { AbnormalReturgoodComponent } from './page/abnormal-returgood/abnormal-returgood.component';
import { AbnormalSupgoodComponent } from './page/abnormal-supgood/abnormal-supgood.component';
import { AbnormalTraceComponent} from './page/abnormal-trace/abnormal-trace.component';
import { AllAbnormalComponent } from './page/all-abnormal/all-abnormal.component';
import {TableGridComponent} from './page/share/table-grid.component'
//引入顶部搜索
import{SearchTopComponent} from './page/share/search-top.component'

/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';


@NgModule({
    imports: [
        AbnormalSaleRoutingModule,
        ShareModule,
    ],
    declarations: [
        AbnormalSaleComponent,
        AbnormalOtherComponent,
        AbnormalRepairComponent,
        AbnormalReturgoodComponent,
        AbnormalSupgoodComponent,
        AbnormalTraceComponent,
        AllAbnormalComponent,
        SearchTopComponent,
        TableGridComponent
    ],
    providers: [

    ],
})
export class AbnormalSaleModule{ }
