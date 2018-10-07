import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ServiceInformationComponent} from "app/modules/service-information/service-information.component";
const serviceInformationRouter: Routes = [
    {
        path: '',
        component: ServiceInformationComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(serviceInformationRouter)
    ],
    declarations: [],
    providers: [],
})
export class serviceInformationRoutingModule {
}
