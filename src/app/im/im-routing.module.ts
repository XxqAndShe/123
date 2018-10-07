/**
 * Created by giscafer on 2017/4/26.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ImChatComponent } from "./page/chat/im-chat.component";

const homeRouter: Routes = [
    {
        path:'',
        component:ImChatComponent,
    }
];
@NgModule({
    imports: [RouterModule.forChild(homeRouter)
    ],
    declarations: [],
    providers: [],
})
export class ImRoutingModule {
}
