import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router}from '@angular/router'
import {HomeService} from "../service/home.service";
import {HomeDayResponseVo} from "../vo/home-day-response";
import {API} from "../../../share/lib/api/api";

@Component({
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    //data: any = {};
    homeResponseVo: any = {};
    homeDayResponseVo: any = {};
    homeRequestVo: any = {};
    change: boolean = false;
    inputData: string;
    msgs: any;
    curIndex: any = 1;
    selectMenu = {//此对象将传给submenu子菜单组件显示
        content: ['调度任务', '待跟踪', '时效异常'],
        router: '/home',
        subRouter: ['adjustable-task', 'maintain-task', 'back-task', 'track', 'abnormal'],
        title: '调度管理'
    };

    constructor(public homeService: HomeService, public router: Router, public api: API) {

    }

    /**
     * 初始化数据
     */
    ngOnInit(): void {
        /**
         * 总任务数
         * @type {HomeRequestVo}
         */
        //let homeRequestVo: HomeRequestVo = new HomeRequestVo();
        //homeRequestVo.companyID = "yztpt";
        //this.homeResponseVo = this.homeService.getHomeInfo(homeRequestVo);
        ////console.log("invoke load function");
        this.load();

        /**
         * 总任务数，按天统计
         * @type {HomeDayResponseVo}
         */
        //let homeDayResponseVo: HomeDayResponseVo = new HomeDayResponseVo();
        //homeRequestVo.companyID = "yztpt";
        //this.homeDayResponseVo = this.homeService.getHomeInfoDay(homeRequestVo);
        ////console.log("invoke load function");
        this.loadDay();
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    //统计任务数
    load(): any {
        this.api.call("TaskDetailContorller.findHomeTask", this.homeRequestVo).ok(json => {
            this.homeResponseVo = json.result;
        });
    }

    //统计任务数-按天
    loadDay(): any {
        this.api.call("TaskDetailContorller.findHomeTaskDay", this.homeRequestVo).ok(json => {
            this.homeDayResponseVo = json.result;
        });
    }

    //输出选中的模块内容事件
    // @Output() selectMenu=new EventEmitter<any>();

    menuclick(toModule, type?: any) {
        //this.homeService.shareInputData = this.inputData;
        ////console.log(this.homeService.shareInputData);
        if (type === 'tasksearch') {
            if (!this.inputData) {
                this.showSuccess("warn", "提示", '请输入单号');
                return;
            }
        } else {
            this.router.navigate([toModule]);
            this.routeChangeFromHome(toModule)
            return;
        }
        if (this.inputData) {
            this.router.navigate([toModule, this.inputData]);
        } else {
            this.router.navigate([toModule]);
        }

    }

    /**
     * 首页跳转高亮菜单左侧
     * @param toModule
     */
    routeChangeFromHome(toModule) {
        let menus = "adjustable-0";
        let index = 0;
        if (toModule.includes('/adjustable-manage/time-abnormal')) {
            index = 2;
        } else if (toModule.includes('adjustable-manage/adjustable-task')) {
            index = 0;
        } else if (toModule.includes('adjustable-manage/wait-tracking')) {
            index = 1;
        } else if (toModule.includes('/sale-center/exception-handle')) {
            menus = 'sale-3';
            index = 0;
        } else if (toModule.includes('sale-center/scheduling')) {
            menus = 'sale-3';
            index = 3;
        }
        window['epInstance'].emit('route_change_at_home', [menus, index])

    }
}
