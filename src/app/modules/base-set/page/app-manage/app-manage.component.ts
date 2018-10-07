import {Component, OnInit} from '@angular/core';
import {AppManageVo} from "./vo/app-manage.vo";
import { API } from "app/share/lib/api/api";

@Component({
    selector: 'app-app-manage',
    templateUrl: './app-manage.component.html',
    styleUrls: ['./app-manage.component.css']
})
export class AppManageComponent implements OnInit {
    loading: boolean = true;
    appManageVo: AppManageVo = new AppManageVo();
    //header
    header = [
        "升级标题-titleName",
        "升级内容-describe",
        "版本号-versionNumber",
        "上传时间-updateTime",
        "操作人-registerPerson",
    ];
    //设置表格
    columns: any[] = [];
    //表格数据
    data: any;
    // 选择记录
    selectRows: any[] = [];
    selections: any[] = [];

    //控制弹框
    showAdd: boolean = false;

    constructor(public api: API) {
    }

    ngOnInit() {
        for (let i = 0; i < this.header.length; i++) {
            let arr = this.header[i].split('-');
            this.columns[i] = {};
            this.columns[i].field = arr[1];
            this.columns[i].header = arr[0];
            this.columns[i].sortable = false;
            this.columns[i].filter = true;
        }
    }

    load(event) {
        this.loading = true;
        this.api.call("appUpdateController.findAppUpate", {
                "versionNumber": this.appManageVo.versionNumber,
                "titleName": this.appManageVo.titleName
            },
            event).ok(json => {
            this.data = json.result;
            this.loading = false;
        }).fail(err=>{
             this.loading = false;
        });
    }

    /**
     * 查询
     */
    doSearch() {
        this.selectRows=[];
        this.load({first: 0, rows: 10});
    }

    /**
     * 显示新增弹框
     */
    showWin(type:number) {
        if(type===1){ //新增
            this.selectRows=[];
            this.selections=[];
        }
        this.showAdd = true;
    }

    /**
     * 关闭弹窗
     * @param $event 是否刷新列表
     * @param type
     */
    closeWin() {
        this.showAdd = false;
    }

    /**
     * 新增成功
     */
    success() {
        this.showAdd = false;
        this.load({first: 0, rows: 10});
    }

    rowSelect($event){
        this.selectRows=$event;
    }
}

