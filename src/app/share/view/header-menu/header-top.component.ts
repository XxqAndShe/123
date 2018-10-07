import {Component, Input, Output, EventEmitter, OnInit, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "app/share/auth-service/auth.service";
import {UserService} from "../../../security/service/user.service";


@Component({
    selector: 'header-top',
    templateUrl: './header-top.component.html',
    styleUrls: ['./header-top.component.css'],
    providers: [UserService]
})
export class HeaderTopComponent implements OnInit,DoCheck {
    msgs: any;
    public username: string = "";
    //状态切换背景色
    userMode = ['#5ae825', '#ff3000', '#1ba8ed', '#ffc715'];

    userModeBg: string;

    // 用户状态框的显示与隐藏
    userModeDisplay = false;

    waybillOrConee: string;//搜索运单号或收货人

    @Output() widthChange = new EventEmitter<boolean>();

    @Output() gotoPerson = new EventEmitter();

    //一级菜单是否变宽
    @Input('widthSpread') widthSpread: boolean;

    @Output() headerHome = new EventEmitter();

    constructor(public router: Router, public authService: AuthService, public userService: UserService) {

    }

    public portraitUrl: string = "/assets/touxiang01.gif";

    ngOnInit(): void {
        this.userService.currentUser(data => {
            this.portraitUrl = data.portrait[0] || "/assets/touxiang01.gif";
        });
        this.authService.checkUserLogin().then(isLogin => {
            if (isLogin) {
                this.username = AuthService.currentUser.realName || AuthService.currentUser.mobie;
            }
        }).catch(err => {
            this.username = "";
        });
        //监听头像修改事件
        window['epInstance'].on('change_personal_portrait', info => {
            if (!info) return;
            this.portraitUrl = info['url'];
        });
    }

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /**
     * 用户信息展示（目前好像session不会过期）
     */
    ngDoCheck(): void {
        if (this.username !== AuthService.currentUser.realName) {
            this.username = AuthService.currentUser.realName || AuthService.currentUser.mobie
        }
    }

    gotoHome(){
        this.gotoPerson.emit(['/home']);
        this.router.navigate(['modules/home']);
    }

    gotoPersonal(path){
        this.router.navigate([path]);
    }
    /**
     * 导航到综合查询
     * @param path
     */
    navigateToPath(path='modules/home') {
        // if(!this.waybillOrConee) {
        //     this.showSuccess("warn", "提示", '请输入单号');
        //     return;
        // }
        this.gotoPerson.emit([path,0]);
        if (this.waybillOrConee) {
            this.router.navigate([path, this.waybillOrConee]);
        } else {
            this.router.navigate([path]);
        }
    }



    showUserMode() {
        this.userModeDisplay = this.username && this.username !== '未登录' ? true : false;
    }

    hideUserMode(index?: number) {
        this.userModeDisplay = false;
        if (index) {
            this.userModeBg = this.userMode[index];//进行状态切换
        }
    }

    /**
     * 点击标签右边×，删除其父节点
     * @param event
     */
    remove(event: any) {
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    }

    public menuWidthChange() {
        this.widthSpread = !this.widthSpread;
        this.widthChange.emit(this.widthSpread);
    }


    menuclick(toModule) {

        this.router.navigate([toModule]);
        if (toModule == '/home') {
            this.headerHome.emit(true);
        }
    }

    /**
     * 退出登录
     */
    public doLogout(): void {
        this.authService.loginOut();
    }
}
