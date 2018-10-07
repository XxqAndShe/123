/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FinancialCenterComponent} from './financial-center.component';


import {DepositManagerComponent} from './page/deposit-manager/deposit-manager.component';
import {MasterRunningComponent} from './page/master-running/master-running.component';
import {SaleRunningComponent} from './page/sale-running/sale-running.component';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";


const financialRouter: Routes = [
    {
        path: '',
        component: FinancialCenterComponent,
        canActivateChild: [AuthGuardService],
        children: [
            {path: '', redirectTo: 'deposit-manager', pathMatch: 'full'},
            {path: 'deposit-manager', component: DepositManagerComponent},
            {path: 'sale-running', component: SaleRunningComponent},
            {path: 'master-running', component: MasterRunningComponent}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(financialRouter)
    ],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class FinancialCenterRoutingModule {
}
