/**
 * Created by giscafer on 2017/4/26.
 */
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ImRoutingModule} from "./im-routing.module";
import {ImChatComponent} from "./page/chat/im-chat.component";
import {CommonModule} from "@angular/common";
import {DialigBoxModule} from "./page/dialog-box/dialog-box.component";
import {DateFormatService} from "./page/service/dateFormat.service";
import {TransferESCService} from "./page/service/transferESC.service";
import {API} from "../share/lib/api/api";
import {CalendarModule,GrowlModule} from "primeng/primeng";
import { ImBoxListModule} from "./page/im-box/im-box-list/im-box-list.component";
import {UploadFileService} from "app/im/service/upload-file.service";
import {AppConfig} from "app/app.config";
import { UserService } from "../security/service/user.service";


@NgModule({
    imports: [
        ImRoutingModule,
        FormsModule,
        CommonModule,
        DialigBoxModule,
        ImBoxListModule,
        CalendarModule,
        GrowlModule
    ],
    declarations: [
        ImChatComponent
    ],
    providers: [
        UploadFileService,
        DateFormatService,
        TransferESCService,
        AppConfig,
        API,
        UserService
    ],
})
export class ImModule {
}
