
import { NgModule } from '@angular/core';

import { PriceManageRoutingModule } from './price-manage-routing.module';

import { PriceManageComponent } from './price-manage.component';

/* 三级组件 */
import { InstallPriceComponent } from './page/install-price/install-price.component';
import {LateralBuyPriceComponent} from "./page/lateral-buy-price/lateral-buy-price.component";
import {LateralStandardPriceComponent} from "./page/lateral-standard-price/lateral-standard-price.component";
import {AddOrEditPriceComponent} from "./page/add-or-edit/add-or-edit.component";

/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';
import {LateralFormComponent} from "./page/lateral-price/lateral-form.component";
import {LateralPriceComponent} from "./page/lateral-price/lateral-price.component";

@NgModule({
    imports: [
        PriceManageRoutingModule ,
        ShareModule
    ],
    declarations: [
        PriceManageComponent,
        InstallPriceComponent,
        LateralBuyPriceComponent,
        LateralStandardPriceComponent,
        AddOrEditPriceComponent,

        LateralFormComponent,
        LateralPriceComponent
    ],
    providers: [
    ],
})
export class PriceManageModule{ }