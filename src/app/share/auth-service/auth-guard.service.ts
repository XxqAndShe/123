/**
 * @Description:  路由权限拦截
 * @Author: giscafer
 * @Date 10:29 2017/4/2
 */
import {Injectable} from "@angular/core";
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from "@angular/router";
import {AuthService} from "./auth.service";


@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    permissions: string[] = [];

    constructor(public authService: AuthService,
                public router: Router) {
    }

    /**
     * 路由激活
     * @param route
     * @param state
     * @returns {boolean}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    /**
     * 子路由激活
     * @param route
     * @param state
     * @returns {boolean}
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    /**
     * 检查是否登录
     * @param url
     * @returns {boolean}
     */
    checkLogin(url: string): boolean {
        //console.log(url);
        let curUser = {mobile: ''};
        try {
            curUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            this.permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        } catch (e) {
            return this.isLoginPage(url);
        }
        this.authService.redirectUrl = url;
        //未登录
        if (!curUser['mobile']) {
            return this.isLoginPage(url);
            // return false;
        } else if (curUser['mobile'] && this.validPermissions(url)) {
            //已登录&验证权限情况
            return true;
        } else if(url.includes('/modules/demo') || url.includes('msf')){
            //放开demo，所有人都可以访问
            return true;
        }else {
            //如果没有权限&已登录用户，就跳转首页。
            if (url !== '/modules/home') {
                this.router.navigate(['/modules/home']);
            }
            return false;
        }

    }

    /**
     * 如果是登录页面，不跳转，避免死循环
     * @param url
     */
     isLoginPage(url){
         if(!url.includes('/security/login') && !url.includes('/security/forgotpwd')){
             this.router.navigate(['/security/login']);
             return false;
         }else{
             return true;
         }
    }

    /**
     * 验证是否有该路由的权限
     * @param url
     */
    validPermissions(routePath) {

        return this.permissions.some(url => {
            return routePath.includes(url);
        })
    }
}
