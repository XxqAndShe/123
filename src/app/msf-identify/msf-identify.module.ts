//app module
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {JsonpModule} from "@angular/http";

//app service
import {AppConfig} from "../app.config";
import {API} from "../share/lib/api/api";
import {ShareModule} from "../share/share.module";
import {MsfIdentifyComponent} from "./msf-identify.component";




@NgModule({
    imports: [
        FormsModule,
        ShareModule,
        JsonpModule,
        RouterModule,
    ],
    declarations: [
        MsfIdentifyComponent
    ],
    providers: [
        API,
        AppConfig,
    ]
})
export class MsfIdentifyModule {
}
