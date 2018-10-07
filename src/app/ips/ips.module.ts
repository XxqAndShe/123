//app module
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {JsonpModule} from "@angular/http";
//app component
// 引入头部组件
import {HeaderTopComponent} from "../share/view/header-menu/header-top.component";
//引入二级菜单组件
import {MenuBarComponent} from "../share/view/header-menu/menu-bar.component";
import {SubMenuComponent} from "../share/view/header-menu/sub-menu.component";

//app service
import {DragBoxService} from "../share/app-service/drag-box.service";
import {ShowOrHideMaskService} from "../share/app-service/show-or-hide-mask.service";
import {ControlInfoBoxService} from "../share/app-service/control-info-box.service";
import {AbnormalTaskService} from "../modules/sale-center/page/abnormal-sale/service/abnormal-task.service";
import {AuthService} from "../share/auth-service/auth.service";
import {AuthGuardService} from "../share/auth-service/auth-guard.service";
import {AppConfig} from "../app.config";
import {API} from "../share/lib/api/api";
import {InputTextModule} from "primeng/primeng";
import {IPSHomeRoutingModule} from "./ips-routing.module";
import {IPSHomeComponent} from "./ips.component";
import {HomeService} from "../modules/home/service/home.service";
import {ShareModule} from "../share/share.module";
import {DateFormatService} from "../im/page/service/dateFormat.service";
import {DateFormatsService} from "../share/app-service/dateFormats.service";
import {TransferESCService} from "../im/page/service/transferESC.service";
// 引入im组件
import {ImChatComponent} from "../im/page/im-box/im-box.component";
import {ImBoxListModule} from "../im/page/im-box/im-box-list/im-box-list.component";
import {DialigBoxModule} from "../im/page/dialog-box/dialog-box.component";
import {UploadFileService} from "app/im/service/upload-file.service";
import {RequestTokenService} from "app/share/app-service/request-token.service";


@NgModule({
    imports: [
        FormsModule,
        ShareModule,
        JsonpModule,
        RouterModule,
        InputTextModule,
        IPSHomeRoutingModule,
        DialigBoxModule,
        ImBoxListModule
    ],
    declarations: [
        IPSHomeComponent,
        HeaderTopComponent,
        MenuBarComponent,
        SubMenuComponent,
        ImChatComponent,
    ],
    providers: [
        API,
        HomeService,
        AppConfig,
        DragBoxService,
        ShowOrHideMaskService,
        RequestTokenService,
        ControlInfoBoxService,
        AuthService,
        AuthGuardService,
        AbnormalTaskService,
        DateFormatService,
        TransferESCService,
        DateFormatsService,
        UploadFileService
    ]
})
export class IPSModule {
}
