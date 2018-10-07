import { Component, ViewChild, style, state, transition, trigger, animate } from '@angular/core';
import { Router } from '@angular/router';
import {  ShowOrHideMaskService } from '../../../../../../share/app-service/show-or-hide-mask.service';
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {SaveFormComponent} from "./save-form.component";

@Component({
    templateUrl: './my-forms.component.html',
    styleUrls: [
        '../share/form-data.css'
    ],
    animations: [
        trigger('delWinState',[
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

export class MyFormsComponent{
    // nav插件引用设置
    navs = ["数据导出","我的报表"];
    navHrefs = [
        '/sale-center/form-data/export-data',
        '/sale-center/form-data/my-forms'
    ];
    curIndex = 1;
    thisIndex: number;

    constructor(
        public router:Router,
        public mask:ShowOrHideMaskService,
        public datePickerService: DatepickerService
    ){}
    // 预览数据
    winInit: boolean = false;
    theItems: any = [];
    viewData(i: number){
        this.winInit = true;
        this.mask.show();
        this.theItems = this.myForms[i].items;
        ////console.log(this.itemsUl)
    }
    // 修改报表页面的预览数据
    editViewData(){
        this.winInit = true;
        this.mask.show();
    }
    // 关闭预览数据
    closeWin1(){
        this.winInit = false;
        this.mask.hide();
    }
    // 关闭保存报表弹框
    closeWin2(){
        this.saveWinState = 'hide';
        this.mask.hide();
    }
    // 删除报表
    isDelShow:boolean = false;
    formName: string;
    showDeleteForm(i:number){// 显示删除弹框
        this.thisIndex = i;
        this.mask.show();
        this.formName = this.myForms[i].name;
        this.isDelShow = true;
    }
    hideDelForm(isshow:boolean){// 隐藏删除弹框
        this.isDelShow = false;
        this.mask.hide();
    }
    deleteForm(){// 确认删除
        this.myForms.splice(this.thisIndex,1);
    }

    // 日历组件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        'width': 86+'px',
        'height': 30+'px',
        'textAlign': 'center',
        'cursor': 'default'
    };
    yearRange: string="2000:2020";

    // 修改报表部分start
    itemNum = 0;
    itemsUl = [];
    // 添加小标签
    addItem(event:any){
        this.itemNum++;
        this.itemsUl.push(event.target.innerHTML);
    }
    // 删除小标签
    removeItem(i:number){
        this.itemNum--;
        this.itemsUl.splice(i, 1);
    }
    // 重置
    clean(){
        this.itemNum = 0;
        this.itemsUl = [];
        this.theItems = [];
    }
    showMyForms: boolean = true;   // 默认显示我的报表
    showEditForm: boolean = false;   // 修改报表默认隐藏
    // 修改报表
    editForm(i: number){
        this.showEditForm = true;
        this.showMyForms = false;
        this.itemNum = this.myForms[i].items.length;
        this.itemsUl = this.myForms[i].items;
        this.formName = this.myForms[i].name;
        this.thisIndex = i;
    }
    // 保存报表弹框
    saveWinState: string = 'hide';
    saveForm(){
        this.saveWinState = 'show';
        this.mask.show();
    }
    // 确认保存修改后显示我的报表
    @ViewChild(SaveFormComponent) newName: SaveFormComponent;
    saveEdit(){
        this.showMyForms = true;
        this.showEditForm = false;
        this.myForms[this.thisIndex].name = this.newName.formName;
        // 此时itemUl已经成为修改报表页的，需重置
        this.itemsUl = [];
    }
    // 修改报表部分end

    // 我的报表模拟数据
    myForms=[
        {
            name: '异常汇总报表',
            addTime: '2017-03-25 17:54',
            items: ['体积', '异常状态', '运单号']
        },
        {
            name: '售后报表',
            addTime: '2017-03-23 21:56',
            items: ['运单号', '异常类型', '运单号', '体积', '异常状态']
        },
        {
            name: '财务报表',
            addTime: '2017-03-23 19:23',
            items: ['体积', '异常小类', '运单号', '异常类型']
        },
        {
            name: '销售报表',
            addTime: '2017-03-21 17:21',
            items: ['体积', '异常小类', '运单号', '异常类型', '运单号']
        },
        {
            name: '报销报表',
            addTime: '2017-03-22 16:47',
            items: ['体积', '异常小类', '运单号']
        },
        {
            name: '运单报表',
            addTime: '2017-03-23 14:32',
            items: ['体积', '异常小类', '运单号', '异常类型', '运单号']
        }
    ]

}
