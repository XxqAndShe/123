/**
 * Created by siYuan on 2017-03-30.
 */
import {Injectable} from '@angular/core';
import {API} from "app/share/lib/api/api";
import { AppConfig } from "app/app.config";

@Injectable()
export class UserService {

    constructor(
        public api:API,
        public config: AppConfig
    ) {
        this.api.url = this.config.baseUrl + "/api.do";
    }

    /**
     * 获取验证码
     * @param mobile 手机号
     * @param ok
     * @param fail
     */
    getValidateCodeByMobile(data,ok:Function=null,fail:Function=null){
        this.api.call("UserController.getValidateCodeByMobile",data).ok(data=>{
            if(ok!=null){
                ok(data);
            }
        }).fail(data=>{
            if(fail!=null) {
                fail(data);
            }
            else {
                if (data.code) {
                    alert("发送失败："+data.error);
                } else {
                    alert("系统出错请联系管理员");
                }
                console.error(data);
            }
        });
    }

    /**
     * 获取验证码
     * @param mobile 手机号
     * @param ok
     * @param fail
     */
    getValidateCode(data,ok:Function,fail:Function=null){
        this.api.call("UserController.getValidateCode",data).ok(data=>{
            ok(data);
        }).fail(data=>{
            if(fail!=null) {
                fail(data);
            }
            else {
                alert("发送失败："+data.error);
                console.error(data);
            }
        });
    }

    /**
     * 验证码验证
     * @param data
     * @param ok
     * @param fail
     */
    checkValidateCode(data:any,ok:Function,fail:Function=null){
        this.api.call("UserController.checkValidateCode",data).ok(data=>{
            ok(data);
        }).fail(data=>{
            if(fail!=null) {
                fail(data);
            }
            else {
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("系统出错请联系管理员");
                }
                console.error(data);
            }
        })
    }

    /**
     * 获取当前登录用户信息
     * @param ok
     * @param fail
     */
    currentUser(ok:Function,fail:Function=null){
        this.api.call("UserController.currentUser").ok(data => {
            ok(data.result);
        }).fail(data=>{
            if(fail!=null) {
                fail(data);
            }
            else {
                console.error(data);
            }
        });
    }

    resetPwd(data,ok:Function=null,fail:Function=null){
        this.api.call("UserController.resetPwd",data).ok(data=>{
            if(ok!=null){
                ok(data);
            }
        }).fail(data=>{
            if(fail!=null) {
                fail(data);
            }
            else {
                if (data.code) {
                    alert("修改失败："+data.error);
                } else {
                    alert("系统出错请联系管理员");
                }
                console.error(data);
            }
        });
    }

}