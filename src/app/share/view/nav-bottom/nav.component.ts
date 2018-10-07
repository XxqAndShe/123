import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';


@Component({
    selector: 'my-nav',
    templateUrl: './nav.component.html',
    styleUrls: [
        './nav.component.css'
    ]
})

export class NavComponent implements OnInit {
    @Input() navs = new Array();  // 导航栏数组
    @Input() nodeNumber = new Array();//数量
    @Input() curIndex: number;   // 当前active标签下标，从0开始计算
    @Input() navHrefs = new Array(); //导航栏链接数组

    curArr = [];  // 记录哪个标签有current类样式

    constructor(public router: Router) {
    }

    ngOnInit(): void {
        for (let i = this.navs.length - 1; i >= 0; --i) {
            if (i == this.curIndex) {
                this.curArr[i] = true;
            } else {
                this.curArr[i] = false;
            }
        }
    }

    changeNav(index) {
        /*for(let i=this.navs.length-1; i>=0; --i) {
         this.curArr[i] = false;
         if(i==index){
         this.curArr[i] = true;
         }
         }*/
        ////console.log(this.navHrefs[index])
        this.router.navigate([this.navHrefs[index]]);

    }

}


/*
 ----------html部分
 <my-nav [navs]="navs" [curIndex]="curIndex"></my-nav>

 ----------ts部分
 navs = ["基础设置表","异常基础资料","提醒设置"];
 curIndex = 0;


 */
