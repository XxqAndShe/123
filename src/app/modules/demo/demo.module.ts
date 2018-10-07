import {NgModule} from "@angular/core";
import {ShareModule} from "../../share/share.module";
import {DemoRoutingModule} from "./demo-routing.module";
import {DemoComponent} from "./demo.component";
import {DemoTestComponent} from "./page/test/demo-test.component";
import {SelectBoxTestComponent} from "./page/select-box-test/select-box-test.component";
import {GridTestComponent} from "./page/grid-test/grid-test.component";
import {ConfirmDialogComponent} from "./page/confirm-dialog/confirm-dialog.component";
import {AreaComponentTest} from "./page/business/area-component/area-component.test";
import { PicUploadTestComponent } from './page/business/pic-upload-test/pic-upload-test.component';
import {TreeTestComponent} from "./page/tree-test/tree-test.component";
import { ExceptionSelectTestComponent } from './page/business/exception-select-test/exception-select-test.component';
import { ShipperSelectTestComponent } from './page/business/shipper-select-test/shipper-select-test.component';
import { CneeSelectTestComponent } from './page/business/cnee-select-test/cnee-select-test.component';
import { WorkersSelectTestComponent } from './page/business/workers-select-test/workers-select-test.component';
import { DepartmentSelectTestComponent } from './page/business/department-select-test/department-select-test.component';
import { EchartsTestComponent } from './page/echarts-test/echarts-test.component';
import { MasterSelectTestComponent } from './page/business/master-select-test/master-select-test.component';
import { RepairGoodsSelectTestComponent } from './page/business/repair-goods-select-test/repair-goods-select-test.component';
import { GoodSelectTestComponent } from './page/business/good-select-test/good-select-test.component';

@NgModule({
    imports: [
        ShareModule,
        DemoRoutingModule
    ],
    declarations: [
        DemoComponent,
        DemoTestComponent,
        SelectBoxTestComponent,
        GridTestComponent,
        TreeTestComponent,
        ConfirmDialogComponent,
        AreaComponentTest,
        PicUploadTestComponent,
        ExceptionSelectTestComponent,
        ShipperSelectTestComponent,
        CneeSelectTestComponent,
        WorkersSelectTestComponent,
        DepartmentSelectTestComponent,
        EchartsTestComponent,
        MasterSelectTestComponent,
        RepairGoodsSelectTestComponent,
        GoodSelectTestComponent
    ],
    providers: [
    ],
})
export class DemoModule{ }