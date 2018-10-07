import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PriceManageComponent } from './price-manage.component';

/* 三级组件 */
import { InstallPriceComponent } from './page/install-price/install-price.component';
import {LateralBuyPriceComponent} from "./page/lateral-buy-price/lateral-buy-price.component";
import {LateralStandardPriceComponent} from "./page/lateral-standard-price/lateral-standard-price.component";

const PiceManageRouter:Routes=[
    {
        path: '',
        component: PriceManageComponent,
        children: [
            {
                path: '',
                redirectTo: 'install-price',
                pathMatch: 'full'
            },
            {
                path: 'install-price',
                component: InstallPriceComponent
            },
            {
                path: 'lateral-buy-price',
                component:  LateralBuyPriceComponent
            },
            {
                path: 'lateral-standard-price',
                component:  LateralStandardPriceComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(PiceManageRouter)],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class PriceManageRoutingModule{ }
