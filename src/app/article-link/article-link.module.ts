import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleLinkComponent} from "./article-link.component";
import {API} from "app/share/lib/api/api";
import {AppConfig} from "../app.config";
import {ShareModule} from "app/share/share.module";

@NgModule({
    imports: [
        CommonModule,
        ShareModule
    ],
    declarations: [
        ArticleLinkComponent
    ],
    providers: [
        API,
        AppConfig,
    ]
})
export class ArticleLinkModule {
}
