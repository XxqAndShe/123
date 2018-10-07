/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormDataComponent } from './form-data.component';

/* 三级组件 */
import { ExportDataComponent } from './page/export-data/export-data.component';
import { MyFormsComponent } from './page/my-forms/my-forms.component';
import { ViewDataComponent } from './page/view-data/view-data.component';

const FormDataRouter:Routes=[
    {
        path: '',
        component: FormDataComponent,
        children: [
            {
                path: '',
                redirectTo: 'export-data',
                pathMatch: 'full'
            },
            {
                path: 'export-data',
                component:  ExportDataComponent
            },
            {
                path: 'my-forms',
                component: MyFormsComponent
            },
            {
                path: 'view-data',
                component: ViewDataComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(FormDataRouter)],
    exports: [
        RouterModule
    ],
    declarations: [
    ],
    providers: [
    ],
})
export class FormDataRoutingModule{ }
