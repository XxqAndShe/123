/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';

import {FormDataRoutingModule } from './form-data-routing.module';

import { FormDataComponent } from './form-data.component';

/* 三级组件 */
import { ExportDataComponent } from './page/export-data/export-data.component';
import { MyFormsComponent } from './page/my-forms/my-forms.component';
import { ViewDataComponent } from './page/view-data/view-data.component';

// 弹框引入
import {DeleteFormComponent}from './page/my-forms/delete-form.component';
import {AddTableWinComponent} from './page/export-data/add-table-win.component';
import {ViewDataWinComponent} from './page/share/view-data-win.component';
import {SaveFormComponent} from './page/my-forms/save-form.component';
/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';

@NgModule({
    imports: [
        FormDataRoutingModule,
        ShareModule,
    ],
    declarations: [
        FormDataComponent,
        ExportDataComponent,
        MyFormsComponent,
        ViewDataComponent,
        DeleteFormComponent,
        AddTableWinComponent,
        ViewDataWinComponent,
        SaveFormComponent
    ],
    providers: [
    ],
})
export class FormDataModule{ }