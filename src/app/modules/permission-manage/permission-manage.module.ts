
import { CommonModule }   from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import {ShareModule} from '../../share/share.module';

import { PermisssionManageRoudingModule } from './permission-manage-routing.module';

import { PermisssionManageComponent} from './permission-manage.component';

@NgModule ({
  imports: [
    CommonModule,
    FormsModule,
    PermisssionManageRoudingModule,
    ShareModule
  ],
  declarations: [
    PermisssionManageComponent,
  ],
  providers: [],
})
export class PermisssionManageModule { }
