import {Component, Input, animate, trigger, state, transition, style, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from "environments/environment.prod";
import {AuthService} from "app/share/auth-service/auth.service";
@Component({
    selector: 'menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css'],
    animations: [trigger('menuBarWidthSpread', [
        state("show", style({
            width: '150px'
        })),
        state("hide", style({
            width: '45px'
        })),
        transition('hide=>show', animate('180ms ease-in')),
        transition('show=>hide', animate('180ms ease-in'))
    ])]
})
export class MenuBarComponent {


    //一级菜单点击颜色变色（改变其class）
    isMenuClick: any[] = [];

    isshowTip: any[] = [];//当有isshowTip[i]=true时，提示框显示

    //一级菜单是否变宽
    @Input('widthSpread') widthSpread: boolean;

    //输出选中的模块内容事件
    @Output() selectMenu = new EventEmitter<any>();

    menuContent: any[] = [];

    initMenus = [
        {text: '首页', routerLink: '/modules/home', menuIndex: 'home-7'},
        {text: '调度管理', routerLink: '/modules/adjustable-manage', menuIndex: 'adjustable-0'},
        // {text: '考核管理', routerLink: '/modules/examine-manage', menuIndex: 'examine-1'},
        {text: '合作商', routerLink: '/modules/cooperation-company', menuIndex: 'cooperation-2'},
        {text: '售后中心', routerLink: '/modules/sale-center', menuIndex: 'sale-3'},
        {text: '财务中心', routerLink: '/modules/financial-center', menuIndex: 'financial-4'},
        // {text: '数据统计', routerLink: '/modules/data-statistic', menuIndex: 'data-5'},
        {text: '基础设置', routerLink: '/modules/base-set', menuIndex: 'base-6'},
        {text: '权限管理', routerLink: '/modules/permission-manage', menuIndex: 'permission-8'},
        {text: '知识库', routerLink: '/modules/service-information', menuIndex: 'service-9'},
    ];

    constructor(public router: Router, public authService: AuthService) {

        let permissionMenus = authService.getPermissionInfo();
        if (!permissionMenus.length) {
            this.menuContent = [{
                text: '首页',
                routerLink: '/modules/home',
                menuIndex: 'home-7'
            }];
            return;
        }
        /**
         * 根据权限显示一级菜单
         */
        this.menuContent = this.initMenus.filter(menu => {
            let name = menu.routerLink.split('/')[2];
            //临时解决方案，数据库没有配置资料库权限
            permissionMenus.push("service-information");
            if (permissionMenus.includes(name)) {
                return menu;
            }
        })
        console.log(this.menuContent);
    }

    ngOnInit(): void {
        for (var i = 0; i < this.menuContent.length; i++) {
            this.isMenuClick[i] = false;
            this.isshowTip[i] = false;
        }
        this.isMenuClick[0] = true;
    }

    /**
     * 菜单点击
     * @param index
     * @param toModule
     * @param subMenu
     */
    menuclick(index: number, toModule, subMenu) {
        //console.log(index, toModule, subMenu)
        this.router.navigate([toModule]);
        this.selectMenu.emit(subMenu);
        for (var i = 0; i < this.isMenuClick.length; i++) {
            this.isMenuClick[i] = false;
            if (i === index) {
                this.isMenuClick[i] = true;
            }
        }
    }

    /**
     * 节点存放
     * @param hover 提示框
     * @returns {any[]}
     */
    saveLi(hover) {
        var liNode = new Array();//存放li节点对象
        for (var i = 0; i < hover.childNodes.length; i++) {
            if (hover.childNodes[i].nodeName == 'LI') {
                liNode.push(hover.childNodes[i]);
            }
        }
        return liNode;
    }

    /**
     * 显示
     * @param index
     * @param hover
     */
    showHoverTip(index: number, hover) {
        var liNode = this.saveLi(hover);
        for (var i = 0; i < liNode.length; i++) {
            liNode[i].style.display = "none";
        }
        //当一级菜单收缩时，才有hover事件
        if (this.widthSpread === false) {
            liNode[index].style.display = "block";
        }
    }

    /**
     * 隐藏
     * @param hover
     */
    hideHoverTip(hover) {
        var liNode = this.saveLi(hover);
        for (var i = 0; i < liNode.length; i++) {
            liNode[i].style.display = "none";
        }
    }

    getIcon(className: string) {
        switch (className) {
            case 'home-7':
                return 'home';
            case 'adjustable-0':
                return 'adjustable';
            case 'examine-1':
                return 'examine';
            case 'cooperation-2':
                return 'cooperation';
            case 'sale-3':
                return 'sale';
            case 'financial-4':
                return 'financial';
            case 'data-5':
                return 'data';
            case 'base-6':
                return 'base';
            case 'permission-8':
                return 'permission';
            case 'service-9':
                return 'service';
        }
    }
}
