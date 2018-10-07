/**
 * Created by giscafer on 2017/4/26.
 */
import {Component, OnInit} from "@angular/core";
import {Router, NavigationStart} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{

  constructor(public router:Router){
  }

  ngOnInit(): void {
    //实例化全局的eventproxy
    window['epInstance']=new EventProxy();
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        localStorage["request-token"]="rt_"+new Date().getTime();
      }
    });
  }
}
