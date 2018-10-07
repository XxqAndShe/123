import { Component} from '@angular/core';
import { Router } from '@angular/router';
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";

@Component({
    templateUrl: './view-data.component.html',
    styleUrls: [
        '../share/form-data.css',
        './view-data.component.css'
    ]
})

export class ViewDataComponent{
    isSelect:boolean;
    // nav插件引用设置
    navs = ["数据导出","我的报表","数据预览"];
    navHrefs = [
        '/sale-center/form-data/export-data',
        '/sale-center/form-data/my-forms',
        '/sale-center/form-data/view-data'
    ];
    curIndex = 2;
    // 预览数据
    constructor(public router:Router, public datePickerService: DatepickerService){}
    viewData(){
        this.router.navigate([this.navHrefs[2]]);
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

    // 表格
    columns: any[] = [];
    initColumns=[
        this.columns.push({
            field: '',
            header: '体积',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: '',
            header: '异常状态',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: '',
            header: '异常类型',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: '',
            header: '异常大类',
            sortable: true,
            filter: true
        }),
        this.columns.push({
            field: '',
            header: '运单号',
            sortable: true,
            filter: true
        })
    ]
}