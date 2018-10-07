import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GrowlModule} from "primeng/components/growl/growl";

import {AppConfig} from "app/app.config";
import {API} from "app/share/lib/api/api";
import {SecurityComponent} from "./security.component";
import {SecurityRoutingModule} from "./security-routing.module";
import {UserService} from "./service/user.service";
import {ForgetPwdComponent} from "app/security/page/forget-pwd/forget-pwd.component";
import {SecurityLoginComponent} from "app/security/page/login/security-login.component";
import {AuthService} from "app/share/auth-service/auth.service";


@NgModule({
    imports: [
        SecurityRoutingModule,
        HttpModule,
        CommonModule,
        FormsModule,
        GrowlModule
    ],
    declarations: [
        SecurityComponent,
        ForgetPwdComponent,
        SecurityLoginComponent
    ],
    providers: [
        API,
        UserService,
        AppConfig,
        AuthService
    ],
})
export class SecurityModule {
}