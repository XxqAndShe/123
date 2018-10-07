/**
 * Created by hua on 2017-01-23.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './page/home.component';
const homeRouter: Routes = [
    /*{
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    },*/
    {
        path: '',
        component: HomeComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(homeRouter)
    ],
    declarations: [],
    providers: [],
})
export class HomeRoutingModule {
}
