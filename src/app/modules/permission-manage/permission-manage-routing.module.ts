/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermisssionManageComponent} from "./permission-manage.component";
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const permissionRouter: Routes = [{
    path: '',
    component: PermisssionManageComponent,
    canActivateChild: [AuthGuardService],
    children: [{
        path: '',
        redirectTo: 'company-manage',
        pathMatch: 'full'
    },
        {
            path: 'api-manage',
            loadChildren: './page/api-manage/api-manage.module#ApiManageModule',
        },
        {
            path: 'account-manage',
            loadChildren: './page/company-account/company-account.module#CompanyAccountModule',
        },
        {
            path: 'company-manage',
            // component: CompanyManageComponent
            loadChildren: './page/company-manage/company-manage.module#CompanyManageModule',
        },
        {
            path: 'department-manage',
            loadChildren: './page/department-manage/department-manage.module#DepartmentManageModule',
        },
        {
            path: 'role-manage',
            loadChildren: './page/role-manage/role-manage.module#RoleManageModule',
        },
        {
            path: 'user-manage',
            loadChildren: './page/user-manage/user-manage.module#UserManageModule',
        },
        {
            path: 'authority-batch',
            loadChildren: './page/authority-batch/authority-batch.module#AuthorityBatchModule',
        }
    ]
}];
@NgModule({
    imports: [RouterModule.forChild(permissionRouter)],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class PermisssionManageRoudingModule {
}
