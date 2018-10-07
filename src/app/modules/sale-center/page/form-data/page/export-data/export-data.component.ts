import { Component, style, state, trigger, transition, animate} from '@angular/core';
import { Router } from '@angular/router';
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {AddTableWinComponent} from "./add-table-win.component";

@Component({
    templateUrl: './export-data.component.html',
    styleUrls: [
        '../share/form-data.css'
    ],
    animations: [
        // 加入报表动画
        trigger('winState',[
            state('hide', style({
                transform: 'scale(0)',
                display: 'none',
                position: 'absolute',
                top: '42%',
                left: '42%'
            })),
            state('show', style({
                transform: 'scale(1)',
                display: 'block',
                position: 'absolute',
                top: '50%',
                left: '50%'
            })),
            transition('hide => show', animate('200ms ease-in')),
            transition('show => hide', animate('200ms ease-out'))
        ])
    ]
})

export class ExportDataComponent{
    // 日历组件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        'width': 86+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";

    // nav插件引用设置
    navs = ["数据导出","我的报表"];
    navHrefs = [
        '/sale-center/form-data/export-data',
        '/sale-center/form-data/my-forms'
    ];
    curIndex = 0;


    itemNumber=0;
    itemsUl=[];
    addItem(event:any){
        this.itemNumber++;
        this.itemsUl.push(event.target.innerHTML);
    }
//点击×，删除已选项
    removeItem(i:number){
        this.itemNumber--;
        this.itemsUl.splice(i,1);
    }

    constructor(
        public router:Router,
        public datePickerService: DatepickerService,
        public mask: ShowOrHideMaskService
    ){}
    // 预览数据
    winInit: boolean = false;
    viewData(){
        // this.router.navigate([this.navHrefs[2]]);
        this.mask.show();
        this.winInit = true;
    }
    // 关闭预览
    closeWin1(){
        this.mask.hide();
        this.winInit = false;
    }


    // 重置
    clean(){
        this.itemNumber=0;
        this.itemsUl=[];
    }
    // 加入报表弹框
    winState: string = 'hide';
    addTable(){
        this.winState = 'show';
        this.mask.show();
    }
    closeWin(){
        this.winState = 'hide';
        this.mask.hide();
    }
}
