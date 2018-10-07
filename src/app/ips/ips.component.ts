import { Component, ViewChild, AfterViewInit, animate, trigger, state, transition, style, OnInit } from "@angular/core";
import { SubMenuComponent } from "../share/view/header-menu/sub-menu.component";
import { MenuBarComponent } from "../share/view/header-menu/menu-bar.component";
import { AppConfig } from "../app.config";
import { HeaderTopComponent } from "../share/view/header-menu/header-top.component";
import { HomeComponent } from "app/modules/home/page/home.component";
//成员列表以形参形式传递
import { ImChatComponent } from "app/im/page/im-box/im-box.component";
import { AuthService } from "app/share/auth-service/auth.service";

declare var introJs: any;

@Component({
    selector: 'ips-root',
    templateUrl: './ips.component.html',
    animations: [trigger('submenushow', [
        state("show", style({
            left: '40px'
        })),
        state("hide", style({
            left: '-139px'
        })),
        transition('hide=>show', animate('180ms ease-in')),
        transition('show=>hide', animate('180ms ease-in'))
    ])
    ]
})
export class IPSHomeComponent implements OnInit, AfterViewInit {

    /*头部成员数据*/
    memberData: any;
    historyData: any;
    teamerData: any;
    ips_dialog: string = 'ips_dialog';

    //点击menu-bar宽度变化
    widthSpread = false;
    public containerLeft: number = 45;

    selectMenu = {//此对象将传给submenu子菜单组件显示
        content: ['调度任F务', '待跟踪', '时效异常'],
        router: '/modules',
        subRouter: ['adjustable-task', 'maintain-task', 'back-task', 'track', 'abnormal'],
        title: '调度管理'
    };
    basePath: string = "/modules/home";
    servicePath: string = "/modules/service-information";

    @ViewChild(SubMenuComponent)
    public subMenu: SubMenuComponent;

    @ViewChild(MenuBarComponent)
    public menuBar: MenuBarComponent;

    @ViewChild(HomeComponent)
    public home: HomeComponent;

    @ViewChild(HeaderTopComponent)
    public header: HeaderTopComponent;

    @ViewChild(ImChatComponent)
    public imBox: ImChatComponent;

    headerTop: boolean;
    hasIMPermission: boolean=false;//IM权限拦截

    //点击第二列导航栏宽度变化处理
    isLeftChange = false;

    constructor(public appConfig: AppConfig, public authService: AuthService) {
    }

    ngOnInit(): void {
        this.setIMPermission();
        //监听首页跳转高亮菜单左侧
        window['epInstance'].unbind('route_change_at_home');
        window['epInstance'].on('route_change_at_home', (path: any[]) => {
            this.navPerson(path);
        });
    }

    /**
     * 让菜单栏高亮跟浏览器url一致显示
     */
    ngAfterViewInit(): void {
        let module = location.pathname.split('/');
        //如果在首页，则返回
        let lastPathName = module[module.length - 1];
        let menuPath = module[2];
        let subMenuPath = module[3] || '';

        if (lastPathName === 'home' || location.pathname == '/') {
            this.menuBar.isMenuClick[0] = true;
            // return;
        } else {
            for (let i = 0, len = this.menuBar.menuContent.length; i < len; i++) {
                this.menuBar.isMenuClick[i] = false;
                let arr = this.menuBar.menuContent[i].routerLink.split('/');
                //console.log(arr)
                if (arr[2] == menuPath) {//定位到模块高亮
                    this.menuBar.isMenuClick[i] = true;
                    this.changeMenu(this.menuBar.menuContent[i].menuIndex, 1);
                    let subLen = this.appConfig.menuContent[this.menuBar.menuContent[i].menuIndex][1].length;
                    for (let j = 0; j < subLen; j++) {
                        if (this.appConfig.menuContent[this.menuBar.menuContent[i].menuIndex][1][j] == subMenuPath) {//定位到子菜单高亮
                            this.subMenu.redirectSub(j);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        /**
         * 如果用户登录并且是首次进入系统，展示系统介绍
         */
        if (localStorage.getItem('currentUser') && localStorage.getItem('introjs_flag') !== 'introjs') {
            this.startIntro();
        }
    }

    private imgsrc: string;

    getImg(e) {
        this.imgsrc = e;
    }

    headerHome(hea) {
        this.headerTop = hea;
    }

    setContentStyle() {
        let classObj = {
            'width': ' calc( 100% - ' + this.containerLeft + 'px )',
            'left': this.containerLeft + 'px'
        };
        return classObj;
    }

    widthChange(isWidthChange: boolean) {
        this.widthSpread = isWidthChange;
        if (this.widthSpread === false) {
            this.containerLeft = this.containerLeft - 105;
        } else {
            this.containerLeft = this.containerLeft + 105;
        }
    }

    leftChange(isLeftChange: any) {
        this.isLeftChange = isLeftChange;
        if (this.isLeftChange === false) {
            this.containerLeft = this.containerLeft - 140;
        } else {
            this.containerLeft = this.containerLeft + 140;
        }
    }

    //导航到个人中心||首页
    navPerson(path) {
        if (this.subMenu.subMenuState === 'show') {//导航到个人中心时，隐藏子菜单
            let hideSub = document.getElementById('hide-sub');
            this.subMenu.hideSubMenu(null, 'mark');
        }
        for (let i = 0, len = this.menuBar.isMenuClick.length; i < len; i++) {
            this.menuBar.isMenuClick[i] = false;
        }
        //如果为首页
        if (path[0] == '/home') {
            this.menuBar.isMenuClick[0] = true;
            this.changeMenu('home-7', 1);
        } else if (path[0]) {
            this.menuBar.isMenuClick[1] = true;
            this.changeMenu(path[0], path[1]);
        }
    }

    // public isHide: string = 'hide';
    //点击菜单栏触发
    changeMenu(tar, index?: any) {
        console.log(tar);
        this.selectMenu.content = this.subMenuPermission(tar);
        this.selectMenu.subRouter = this.appConfig.menuContent[tar][1];
        this.selectMenu.router = this.appConfig.menuContent['title'][1][parseInt(tar.split("-")[1])];
        this.selectMenu.title = this.appConfig.menuContent['title'][0][parseInt(tar.split("-")[1])];
        let showSub = document.getElementById('show_sub');
        console.log(this.appConfig.menuContent['title'][1][parseInt(tar.split("-")[1])]);
        if (this.selectMenu.router === this.basePath && this.subMenu.subMenuState === 'show') {//导航到首页时，隐藏子菜单
            this.subMenu.hideSubMenu(showSub, 'mark');
        }
        if (this.selectMenu.router === this.servicePath && this.subMenu.subMenuState === 'show') {//导航到知识库时，隐藏子菜单
            this.subMenu.hideSubMenu(showSub, 'mark');
        }
        if (this.selectMenu.router !== this.basePath && this.selectMenu.router !== this.servicePath && this.subMenu.subMenuState === 'hide') {//导航到非首页时显示子菜单
            this.subMenu.showSubMenu(null, showSub);
        }

        this.subMenu.redirectSub(index || 0);
    }

    /**
     * 根据权限过滤二级菜单展示
     * @param tar
     * @returns {[string]}
     */
    subMenuPermission(tar) {
        let menuRoutes = this.appConfig.menuContent[tar][1];
        let menuNames = this.appConfig.menuContent[tar][0];
        let permissionMenus = this.authService.getPermissionInfo(3);
        if (!permissionMenus.length || !menuRoutes) {
            return [""];
        }
        /**
         * 根据权限显示2级菜单
         */
        let subMenus = [];
        menuRoutes.forEach((r, i) => {
            if (permissionMenus.includes(r) || r==='app-manage' ||　r==='complaint-manage' || r==='complain-manage') {//|| r==='service-information'
                subMenus.push(menuNames[i]);
            }
        })
        return subMenus
    }
    setIMPermission(){
        let permissionMenus = JSON.parse(localStorage.getItem('permissions')) || [];
        this.hasIMPermission=permissionMenus.includes('/im');
    }
    /*
     * im消息列表弹出
     * */
    isCanOpen: boolean = true;

    openChatList() {
        if (this.isCanOpen) {
            $(".im_lift_box").animate({ right: "0px" }, 200);
            $(".im_lift_box").css({ display: "block" });
        }
    }

    canOpen(flag: boolean) {
        this.isCanOpen = flag;
    }

    /*im群组表数据*/
    public imGroupData: any;
    public isJoinInShow: boolean = false;

    /*
     * 普通会话接入
     * */
    receiveJoinIn(e: any) {
        this.imGroupData = e;
        this.isJoinInShow = e != null ? true : false;
    }

    /*接收关闭弹框信息*/
    receiveJoinInHide(e: boolean) {
        this.isJoinInShow = e;
    }

    /**
     * introduction
     */
    startIntro() {
        let intro = introJs();
        intro.setOption("nextLabel", " 下一步 ");
        intro.setOptions({
            prevLabel: " 上一步 ",
            nextLabel: " 下一步 ",
            skipLabel: " 跳过 ",
            doneLabel: " 完成 ",
            showStepNumbers: false,
            exitOnOverlayClick: false,
            exitOnEsc: true,
            steps: [
                {
                    intro: "欢迎光临，点击“下一步”查看系统使用介绍!"
                },
                {
                    element: document.querySelector('#header-top'),
                    intro: "头部工具栏",
                    position: 'bottom-middle-aligned'
                },
                {
                    element: document.querySelector('#menu-bar'),
                    intro: "一级菜单",
                    position: 'right'
                },
                {
                    element: document.querySelector('#pull-down-menu'),
                    intro: '点击切换折叠一级菜单',
                    position: 'bottom'
                }, {
                    element: document.querySelector('#sub-menu-bar'),
                    intro: '二级菜单',
                    position: 'right'
                }, {
                    element: document.querySelector('#header-search-input'),
                    intro: '综合搜索框',
                    position: 'right'
                }, {
                    element: document.querySelector('#come-back-home'),
                    intro: '返回首页按钮',
                    position: 'right'
                }, {
                    element: document.querySelector('#header-right'),
                    intro: '个人设置',
                    position: 'left'
                }, {
                    element: document.querySelector('#im_ico'),
                    intro: 'IM 聊天快速入口',
                    position: 'left'
                }, {
                    element: document.querySelector('#im_new_window'),
                    intro: '打开IM 聊天独立新窗口',
                    position: 'left'
                }, {
                    element: document.querySelector('#im_box_list'),
                    intro: 'IM 聊天菜单导航',
                    position: 'left'
                },
                {
                    element: '#step5',
                    intro: '介绍结束，欢迎使用！'
                }
            ]
        }).onbeforechange(targetElement => {
            if (targetElement.id == "pull-down-menu") {
                this.header.menuWidthChange();
            }

        }).onafterchange(targetElement => {

            if (targetElement.id == "pull-down-menu") {
                this.menuBar.menuclick(1, "/modules/adjustable-manage", "adjustable-0");
            } else if (targetElement.id == "come-back-home") {
                this.menuBar.menuclick(0, "/modules/home", "home-7");
                // this.header.gotoPersonal()
            } else if (targetElement.id == "im_ico") {
                this.openChatList();
            }

        }).oncomplete(() => {
            this.imBox.closeChatList();
        });
        intro.start();
        localStorage.setItem('introjs_flag', 'introjs');
    }
}
