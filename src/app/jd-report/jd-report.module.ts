import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShareModule} from "../share/share.module";
import {JdReportComponent} from "./jd-report.component";
import {API} from "app/share/lib/api/api";
import {AppConfig} from "../app.config";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";

@NgModule({
    imports: [
        CommonModule,
        ShareModule
    ],
    declarations: [
        JdReportComponent
    ],
    providers: [
        API,
        AppConfig,
        ShowOrHideMaskService,
    ]
})
export class JdReportModule {}
