/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AbnormalSaleComponent } from './abnormal-sale.component';

/* 三级组件 */
import { AbnormalOtherComponent} from './page/abnormal-other/abnormal-other.component';
import { AbnormalRepairComponent } from './page/abnormal-repair/abnormal-repair.component';
import { AbnormalReturgoodComponent } from './page/abnormal-returgood/abnormal-returgood.component';
import { AbnormalSupgoodComponent } from './page/abnormal-supgood/abnormal-supgood.component';
import { AbnormalTraceComponent} from './page/abnormal-trace/abnormal-trace.component';
import { AllAbnormalComponent } from './page/all-abnormal/all-abnormal.component';

const AbnormalSaleRouter:Routes=[
    {
        path: '',
        component: AbnormalSaleComponent,
        children: [
            {
                path: '',
                redirectTo: 'all-abnormal',
                pathMatch: 'full'
            },
            {
                path: 'all-abnormal',
                component: AllAbnormalComponent
            },
            {
                path: 'abnormal-repair',
                component: AbnormalRepairComponent
            },
            {
                path: 'abnormal-returgood',
                component: AbnormalReturgoodComponent
            },
            {
                path: 'abnormal-supgood',
                component: AbnormalSupgoodComponent
            }
            ,
            {
                path: 'abnormal-other',
                component: AbnormalOtherComponent
            }
            ,
            {
                path: 'abnormal-trace',
                component: AbnormalTraceComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(AbnormalSaleRouter)],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class AbnormalSaleRoutingModule{ }
