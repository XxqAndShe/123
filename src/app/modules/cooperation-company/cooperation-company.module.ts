/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import { CooperationCompanyRoutingModule } from './cooperation-company-routing.module';

import { CooperationCompanyComponent } from './cooperation-company.component';

/* 二级组件 */
import { CertifyManageComponent } from './page/certify-manage/certify-manage.component';
import { DataChangeComponent } from './page/data-change/data-change.component';
import { MasterManageComponent } from './page/master-manage/master-manage.component';

/* 二级组件弹框 */
import { MasterManageCheckComponent } from './page/master-manage/master-manage-check.component';
import { MasterManageEditComponent,FileUploadDemo } from './page/master-manage/master-manage-edit.component';
import { DataChangeModalComponent } from './page/data-change/data-change-modal.component';
import { MasterAdressComponent }from'./page/share/master-adress/master-adress.component';


/* 引用share组件 */
import { ShareModule } from '../../share/share.module';
import {MasterManageEditService} from "./service/master-manage-edit.service";
import {DataChangeService} from "./service/data-change.service";
import {MasterManageService} from "./service/master-manage.service";
import {CertifyManageService} from "./service/certify-manage.service";
import {DataChangeModalService} from "./service/data-change-modal.service";
/*  导入服务*/


@NgModule({
  imports: [
    CooperationCompanyRoutingModule,
    ShareModule,
  ],
  declarations: [
    CooperationCompanyComponent,
    CertifyManageComponent,
    DataChangeComponent,
    MasterManageComponent,
    MasterManageCheckComponent,
    MasterManageEditComponent,
    DataChangeModalComponent,
    MasterAdressComponent,
  ],
  providers: [
    MasterManageEditService,
    DataChangeService,MasterManageService,CertifyManageService,DataChangeModalService
  ],
})
export class CooperationCompanyModule{ }
