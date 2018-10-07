import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DemoTestComponent} from "./page/test/demo-test.component";
import {DemoComponent} from "./demo.component";
import {SelectBoxTestComponent} from "./page/select-box-test/select-box-test.component";
import {GridTestComponent} from "./page/grid-test/grid-test.component";
import {ConfirmDialogComponent} from "./page/confirm-dialog/confirm-dialog.component";
import {AreaComponentTest} from "./page/business/area-component/area-component.test";
import {PicUploadTestComponent} from "app/modules/demo/page/business/pic-upload-test/pic-upload-test.component";
import {TreeTestComponent} from "./page/tree-test/tree-test.component";
import {ExceptionSelectTestComponent} from "app/modules/demo/page/business/exception-select-test/exception-select-test.component";
import {ShipperSelectTestComponent} from "app/modules/demo/page/business/shipper-select-test/shipper-select-test.component";
import {CneeSelectTestComponent} from "app/modules/demo/page/business/cnee-select-test/cnee-select-test.component";
import {DepartmentSelectTestComponent} from "app/modules/demo/page/business/department-select-test/department-select-test.component";
import {EchartsTestComponent} from "app/modules/demo/page/echarts-test/echarts-test.component";
import {MasterSelectTestComponent} from "app/modules/demo/page/business/master-select-test/master-select-test.component";
import {RepairGoodsSelectTestComponent} from "app/modules/demo/page/business/repair-goods-select-test/repair-goods-select-test.component";
import {GoodSelectTestComponent} from "app/modules/demo/page/business/good-select-test/good-select-test.component";
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const routes:Routes=[
    {
        path:'',
        component:DemoComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                redirectTo: 'test',
                pathMatch: 'full'
            },
            {
                path: 'test',
                component: DemoTestComponent
            },
            {
                path: 'select-box-test',
                component: SelectBoxTestComponent
            },
            {
                path: 'grid-test',
                component: GridTestComponent
            },
            {
                path: 'tree-test',
                component: TreeTestComponent
            },
            {
                path: 'confirm-dialog',
                component: ConfirmDialogComponent
            },
            {
                path: 'area-component-test',
                component: AreaComponentTest
            },
            {
                path: 'tree-test',
                component: TreeTestComponent
            },
            {
                path: 'pic-upload-test',
                component: PicUploadTestComponent
            },
            {
                path: 'cnee-select-test',
                component: CneeSelectTestComponent
            },
            {
                path: 'shipper-select-test',
                component: ShipperSelectTestComponent
            },
            {
                path: 'exception-select-test',
                component: ExceptionSelectTestComponent
            },
            {
                path: 'master-select-test',
                component: MasterSelectTestComponent
            },
            {
                path: 'department-select-test',
                component: DepartmentSelectTestComponent
            },
            {
                path: 'echarts-select-test',
                component: EchartsTestComponent
            },
            {
                path: 'repair-goods-select-test',
                component: RepairGoodsSelectTestComponent
            },
            {
                path: 'good-select-test',
                component: GoodSelectTestComponent
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class DemoRoutingModule{

}
