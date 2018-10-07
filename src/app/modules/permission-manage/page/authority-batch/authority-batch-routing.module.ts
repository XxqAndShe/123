/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthorityImportComponent} from "./pages/authority-import/authority-import-component";
import {AuthorityBatchComponent} from "./authority-batch.component";

const authorityRouter:Routes=[
    {
        path:'',
        component:AuthorityBatchComponent,
        children: [
            {
                path:'',
                redirectTo:'import',
                pathMatch:'full'
            },
            {
                path: 'import',
                component: AuthorityImportComponent
            }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(authorityRouter)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
  ],
})

export class AuthorityBatchRoutingModule{ }
