/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {ShareModule} from '../../../../share/share.module';
import {AuthorityBatchRoutingModule} from "./authority-batch-routing.module";
import {AuthorityBatchComponent} from "./authority-batch.component";
import {AuthorityImportComponent} from "app/modules/permission-manage/page/authority-batch/pages/authority-import/authority-import-component";
@NgModule({
  imports: [
    AuthorityBatchRoutingModule,
    ShareModule
  ],
  declarations: [
    AuthorityBatchComponent,
    AuthorityImportComponent
  ],
  providers: [
  ],
})
export class AuthorityBatchModule{

}
