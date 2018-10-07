/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { FinancialCenterRoutingModule } from './financial-center-routing.module';
import {ShareModule} from '../../share/share.module';

import { FinancialCenterComponent } from './financial-center.component';
// 提现管理模块导入
import { DepositApplyComponent } from './page/deposit-manager/deposit-apply.component';
import { DepositAssessComponent } from './page/deposit-manager/deposit-assess.component';
import { DepositManagerComponent } from './page/deposit-manager/deposit-manager.component';
import {  StateSearchComponent } from './page/deposit-manager/state-search.component';
import {PayDetailComponent} from './page/deposit-manager/pay-detail.component';
import {TaskDetailComponent} from './page/deposit-manager/task-detail.component';
import {MasterDepositComponent} from "./page/deposit-manager/master-deposit.component";
import {DepositOpposeComponent} from "./page/deposit-manager/deposit-oppose-win.component";

// 师傅流水模块
import { MasterRunningComponent } from './page/master-running/master-running.component';
import{RunningDetailComponent} from './page/master-running/running-detail.component'
//营业流水模块
import { SaleRunningComponent } from './page/sale-running/sale-running.component';

// 公共模块
import { AccountSearchComponent } from './page/account-search.component';
import { FinancialCenterTopComponent } from './page/financial-center-top.component';

/**
 * 导入服务
 */


// // 引入时间插件
// import {DatePickerComponent} from '../../share/view/time-address-component/date-picker.component'
// // 引入页脚
// import{SystemBottomComponent} from '../../share/view/system-bottom.component'


@NgModule({
  imports: [
    FinancialCenterRoutingModule,
    ShareModule
  ],
  declarations: [
    FinancialCenterComponent,

    FinancialCenterTopComponent,
    MasterDepositComponent,
    DepositApplyComponent,
    DepositAssessComponent,
    DepositManagerComponent,
    StateSearchComponent,
    MasterRunningComponent,
    SaleRunningComponent,
    AccountSearchComponent,
    PayDetailComponent,
    TaskDetailComponent,
    RunningDetailComponent,
    DepositOpposeComponent

    // DatePickerComponent,
    // SystemBottomComponent
  ],
  providers: [
  ],
})
export class FinancialCenterModule{ }
