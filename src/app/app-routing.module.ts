import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuardService}      from './share/auth-service/auth-guard.service';
import {AppComponent} from "app/app.component";
import {MsfIdentifyComponent} from "./msf-identify/msf-identify.component";
import {ArticleLinkComponent} from "./article-link/article-link.component";
import {TaskAddComponent} from "./task-add/task-add.component";
import {JdReportComponent} from "./jd-report/jd-report.component";

const appRoutes: Routes = [

    {
        path: '',
        component: AppComponent,
        children: [

            {
                path: 'modules',
                loadChildren: 'app/ips/ips.module#IPSModule'
            },
            {
                path: 'security',
                canActivate: [AuthGuardService],
                loadChildren: 'app/security/security.module#SecurityModule',
            },
            {
                path: 'im',
                canActivate: [AuthGuardService],
                loadChildren: 'app/im/im.module#ImModule',
            },
            {
                path: 'msf-identify',
                component: MsfIdentifyComponent,
            },
            {
                path: 'task-add',
                component: TaskAddComponent,
            },
            {
                path: 'msf',
                component: MsfIdentifyComponent,
            },
            {
                path: 'article',
                component: ArticleLinkComponent,
            },
            {
                path: 'article/:articleId',
                component: ArticleLinkComponent
            },
            {
                path: 'jd-report',
                component: JdReportComponent
            },
            {
                path: '**',
                redirectTo: 'modules',
                pathMatch: 'full'
            }
        ]
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})

export class AppRoutingModule {
}
