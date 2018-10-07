/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PersonalCenterComponent} from './personal-center.component';
import {PersonalComponent} from './page/personal-center/personal.component';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";

const personalRouter: Routes = [{
    path: '',
    component: PersonalCenterComponent,
    canActivateChild: [AuthGuardService],
    children: [{
        path: '',
        redirectTo: 'personal',
        pathMatch: 'full'
    }, {
        path: 'personal',
        component: PersonalComponent
    }]
}];
@NgModule({
    imports: [RouterModule.forChild(personalRouter)],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class PersonalCenterRoutingModule {
}
