import { Component, OnInit } from "@angular/core";
import { LoginUserVo } from "../../vo/login-user.vo";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { AuthService } from "app/share/auth-service/auth.service";
import { Message } from "primeng/components/common/api";
import { AppConfig } from "app/app.config";
@Component({
    templateUrl: "./security-login.component.html",
    styleUrls: ["./security-login.component.css"]
})
export class SecurityLoginComponent implements OnInit {

    loginUser: LoginUserVo;

    errorFlag: boolean = false;

    errorInfo: string = '';

    logining: boolean = false;

    msgs: Message[] = [];

    copyrightYear: number = new Date().getFullYear();

    public phoneReg: RegExp = /^(((13[0-9]{1})|(12[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;


    constructor(public http: Http, public appConfig: AppConfig, public router: Router, public authService: AuthService) {
    }

    ngOnInit(): void {
        this.loginUser = new LoginUserVo();
    }

    inputFocus($event): void {
        this.errorFlag = false;
    }

    public doLogin(): void {
        this.errorFlag = false;
        if (!this.valid()) return;
        if (this.logining) return;//正在登录中
        this.logining = true;
        this.loginUser['source'] = 'core';
        this.http.post(this.appConfig.baseUrl + "/login", this.loginUser).map(res => {
            return res.json();
        }).subscribe(json => {
            if (json && json.jwt) {
                this.show();
                //用于资料库导入
                localStorage.setItem("mobile",this.loginUser.mobile);
                localStorage.setItem("jwt", json.jwt);
                setTimeout(() => {
                    this.getUserInfo();
                }, 300);
            } else {
                this.error();
            }
            this.logining = false;
        }, error => {
            this.errorFlag = true;
            if (error && error['_body']) {
                try {
                    let body = JSON.parse(error._body);
                    if (body['code'] === -1) {
                        this.errorInfo = body['error'];
                    } else {
                        this.errorInfo = '登录失败，请检查账号和密码';
                    }
                } catch (e) {
                    this.errorInfo = '服务器出错';
                }

            } else {
                this.errorInfo = '登录失败，请检查账号和密码';
            }

            this.logining = false;
        });
    }

    /**
     * 登录验证
     * @returns {boolean}
     */
    valid(): boolean {
        if (!this.loginUser.mobile) {
            this.errorFlag = true;
            this.errorInfo = '用户名不能为空';
            return false;
        } else if (!this.phoneReg.test(this.loginUser.mobile)) {
            this.errorFlag = true;
            this.errorInfo = '请输入正确的手机号码';
            return;
        } else if (!this.loginUser.password) {
            this.errorFlag = true;
            this.errorInfo = '密码不能为空';
            return false;
        }
        return true;
    }

    /**
     * 获取用户信息
     */
    getUserInfo() {
        this.authService.checkUserLogin().then(isLogin => {
            if (isLogin) {
                // 跳转回首页
                let permissions = JSON.parse(localStorage.getItem('permissions')) || [];
                if (!permissions.length) {
                    // this.errorFlag = true;
                    // this.errorInfo = '该用户无权限，无法进入系统';
                    this.warning('该用户无权限，无法进入系统')
                } else {
                    this.router.navigateByUrl("/modules/home");
                }
            } else {
                localStorage.removeItem("jwt");
            }
        }).catch(err => {
            this.errorFlag = true;
            this.errorInfo = '获取用户信息失败';
        })
    }

    show(msg?: string) {
        msg = msg ? msg : '登录成功！';
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: '提示', detail: msg });
    }

    error(msg?: string) {
        msg = msg ? msg : '登录失败！';
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '提示', detail: msg });
    }

    warning(msg?: string) {
        msg = msg ? msg : '登录失败！';
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: '提示', detail: msg });
    }

}
