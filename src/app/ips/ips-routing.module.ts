/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IPSHomeComponent } from "./ips.component";
import { AuthGuardService } from "app/share/auth-service/auth-guard.service";
const homeRouter: Routes = [
    {
        path: '',
        component: IPSHomeComponent,
        children: [
            {
                path: 'home',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/home/home.module#HomeModule'
            },
            {
                path: 'personal-center',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/personal-center/personal-center.module#PersonalCenterModule'
            },
            {
                path: 'financial-center',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/financial-center/financial-center.module#FinancialCenterModule'
            },
            {
                path: 'sale-center',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/sale-center/sale-center.module#SaleCenterModule',
            },
            {
                path: 'examine-manage',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/examine-manage/examine-manage.module#ExamineManageModule',
            },
            {
                path: 'data-statistic',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/data-statistic/data-statistic.module#DataStatisticModule',
            },
            {
                path: 'cooperation-company',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/cooperation-company/cooperation-company.module#CooperationCompanyModule',
            }
            ,
            {
                path: 'base-set',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/base-set/base-set.module#BaseSetModule'
            }
            ,
            {
                path: 'adjustable-manage',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/adjustable-manage/adjustable-manage.module#AdjustableManageModule',
            },
            {
                path: 'demo',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/demo/demo.module#DemoModule',
            },

            {
                path: 'permission-manage',
                canActivate: [AuthGuardService],
                loadChildren: 'app/modules/permission-manage/permission-manage.module#PermisssionManageModule',
            },
            {
                path: 'service-information',
                //临时解决方案，数据库没有配置资料库权限
                // canActivate: [AuthGuardService],
                loadChildren: 'app/modules/service-information/service-information.module#ServiceInformationModule',
            },
            {
                path: '**',
                redirectTo: 'home',
                pathMatch: 'full'
            },
        ]
    }

];
@NgModule({
    imports: [RouterModule.forChild(homeRouter)
    ],
    declarations: [],
    providers: [],
})
export class IPSHomeRoutingModule {
}
