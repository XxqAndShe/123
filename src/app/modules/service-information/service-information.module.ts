
import { NgModule } from '@angular/core';
import { ServiceInformationComponent } from './service-information.component';

/* 引用share组件 */
import {ServiceAddComponent} from "./share/service-add/service-add.component";
import {AddFolderComponent} from "./share/add-folder/add-folder.component";
import {ShareServiceComponent} from "./share/share-service/share-service.component";
import {ServiceRenameComponent} from "./share/service-rename/service-rename.component";
import {MoveFileComponent} from "./share/move-file/move-file.component";
import {ShareModule} from "../../share/share.module";
import {serviceInformationRoutingModule} from "./service-information-routing.module";
import {ServiceDelComponent} from "./share/service-del/service-del.component";
import {ServiceImportComponent} from "./share/service-import/service-import.component";

@NgModule({
    imports: [
        ShareModule,
        serviceInformationRoutingModule
    ],
    declarations: [
        ServiceInformationComponent,
        ServiceAddComponent,
        AddFolderComponent,
        ShareServiceComponent,
        ServiceDelComponent,
        ServiceRenameComponent,
        MoveFileComponent,
        ServiceImportComponent

    ],
    exports:[
        ServiceInformationComponent,
        ServiceAddComponent,
        AddFolderComponent,
        ShareServiceComponent,
        ServiceDelComponent,
        ServiceRenameComponent,
        MoveFileComponent,
        ServiceImportComponent
    ],
    providers: [

    ],
})
export class ServiceInformationModule{ }
