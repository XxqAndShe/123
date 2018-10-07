/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import { ArbitrationHandleComponent } from './arbitration-handle.component';


//引入顶部搜索
import{SearchTopComponent} from './share/search-top.component'
// 引入弹窗
import{ArbitrationWinComponent} from './share/arbitration-win.component'
import {TableGridComponent} from './share/table-grid.component'

/* 引用share组件 */
import { ShareModule } from '../../../../share/share.module';
// 服务

@NgModule({
    imports: [
        ShareModule,
    ],
    declarations: [
        ArbitrationHandleComponent,
        SearchTopComponent,
        TableGridComponent,
        ArbitrationWinComponent
    ],
    exports:[
        ArbitrationHandleComponent,
        SearchTopComponent,
        ArbitrationWinComponent,
    ],
    providers: [

    ],
})
export class ArbitrationHandleModule{ }
