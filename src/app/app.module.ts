
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ShareModule} from "app/share/share.module";

import {AppComponent} from "app/app.component";
import {AppRoutingModule} from './app-routing.module';
import {AuthGuardService} from "app/share/auth-service/auth-guard.service";
import {AuthService} from "app/share/auth-service/auth.service";
import {API} from "app/share/lib/api/api";
import {AppConfig} from "app/app.config";
import {MsfIdentifyModule} from "./msf-identify/msf-identify.module";
import {ArticleLinkModule} from "./article-link/article-link.module";
import { TaskAddComponent } from './task-add/task-add.component';
import {JdReportModule} from "app/jd-report/jd-report.module";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        ShareModule,
        MsfIdentifyModule,
        ArticleLinkModule,
        JdReportModule

    ],
    declarations: [
        AppComponent,
        TaskAddComponent
    ],
    providers: [AuthGuardService,AuthService,API,AppConfig],
    bootstrap: [AppComponent]
})
export class AppModule {
}
