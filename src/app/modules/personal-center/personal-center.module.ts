
import { CommonModule }   from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

//个人中心模块
import { PersonalCenterRoutingModule } from './personal-center-routing.module';

import { PersonalCenterComponent } from './personal-center.component';
import {PersonalComponent} from './page/personal-center/personal.component'
import {PersonalService} from "./service/personal.service";
import {UserService} from "app/security/service/user.service";
import { GrowlModule } from "primeng/primeng";
@NgModule ({
  imports: [
    CommonModule,
    PersonalCenterRoutingModule,
    FormsModule,
    GrowlModule
  ],
  declarations: [
    //个人中心
    PersonalComponent,
    PersonalCenterComponent
  ],
  providers: [PersonalService,UserService],
})
export class PersonalCenterModule { }
