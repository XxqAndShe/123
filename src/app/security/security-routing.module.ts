import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SecurityComponent} from "./security.component";
import {ForgetPwdComponent} from "app/security/page/forget-pwd/forget-pwd.component";
import {SecurityLoginComponent} from "app/security/page/login/security-login.component";

const routes:Routes=[
    {
        path:'',
        component:SecurityComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: SecurityLoginComponent
            },
            {
                path: 'forgotpwd',
                component: ForgetPwdComponent
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
export class SecurityRoutingModule{

}