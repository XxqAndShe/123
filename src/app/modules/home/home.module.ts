/**
 * Created by hua on 2017-01-23.
 */
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './page/home.component';
import { HomeRoutingModule } from './home-routing.module'
import {HomeService} from "./service/home.service";
import { GrowlModule } from "primeng/primeng";
@NgModule({
  imports: [
    HomeRoutingModule,
    FormsModule,
    GrowlModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
      HomeService
  ],
})
export class HomeModule{ }
