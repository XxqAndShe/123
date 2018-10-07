/**
 * @Description: 用户登陆权限相关服务
 * @Author: giscafer
 * @Date 10:34 2017/4/2
 */
import {Injectable, OnInit} from "@angular/core";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/delay";
import {API} from "../lib/api/api";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {

    //定时器，10分钟
    timeInterval: number = 10 * 60 * 60 * 1000;

    public static currentUser: any = {};

    isLoggedIn: boolean = false;

    // 存储路由，以便登陆成功后可以跳转
    redirectUrl: string;


    constructor(public router: Router, public api: API) {

    }

    /**
     * 定时获取用户信息回调方法
     */
    checkUserInfoLoop() {
        ////console.log('定时获取')
        this.checkUserLogin().then(isLogin => {
            if (!isLogin) {
                this.loginOut();
            }
        })
    }

    /**
     * 获取用户信息
     * @returns {boolean}
     */
    checkUserLogin(): any {
        //此处调取后端接口，获取用户登录信息，如果未登录或者失效则返回false，登录了true

        try {
            return new Promise((resolve, reject) => {
                this.api.call("SecurityController.currentUser").ok(json => {
                    if (json.result) {
                        AuthService.currentUser = json.result.attributes;
                        localStorage.setItem('currentUser', JSON.stringify(json.result.attributes));
                        localStorage.setItem('permissions', JSON.stringify(json.result.permissions));
                        this.isLoggedIn = true;
                        resolve(this.isLoggedIn)
                    } else {
                        AuthService.currentUser = {};
                        this.isLoggedIn = false;
                        resolve(this.isLoggedIn)
                    }
                }).fail((err) => {
                    this.clearLoacalUserInfo();
                    this.router.navigate(['/security/login']);
                    reject(err);
                });
            });
        } catch (e) {
            this.clearLoacalUserInfo();
        }
    }

    /**
     * 获取用户菜单权限
     */
    getPermissionInfo(level?: number) {
        level = level ? level : 2;
        let permissions = [];
        let perItem=localStorage.getItem('permissions');
        if (perItem) {
            permissions = JSON.parse(perItem) || [];
        }

        let menuArr = [];
        for (let item of permissions) {
            let m = item.split('/')[level];
            if (m) {
                menuArr.push(m);
            }
        }
        return _.uniq(menuArr);
    }

    /**
     * 清楚用户信息
     */
    clearLoacalUserInfo() {
        AuthService.currentUser = {};
        localStorage.removeItem("currentUser");
        localStorage.removeItem("jwt");
        localStorage.removeItem("permissions");
        this.isLoggedIn = false;
    }

    /**
     * 退出登录
     */
    loginOut() {
        //退出登录应调后台接口
        this.api.call("SecurityController.logout").ok(json => {
        }).fail(err => {
            alert("退出失败");
            //console.log(err);
        });
        this.clearLoacalUserInfo();
        this.router.navigateByUrl("security/login");
    }

}
