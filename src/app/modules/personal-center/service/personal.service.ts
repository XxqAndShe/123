import {Injectable} from "@angular/core";
import {API} from "../../../share/lib/api/api";
import {UserVo} from "../../sale-center/page/scheduling/vo/user.vo";
/**
 * Created by Administrator on 2017-03-16.
 */


@Injectable()
export class PersonalService {
    constructor(public api: API) {
    }

    /**
     * 更新用户密码
     * @param data 入参
     * @param ok 回到函数，执行成功
     * @param fail 回到函数，执行失败
     */
    updatePwd(data: any, ok: Function, fail: Function) {
        this.api.call("UserController.updatePwd", data).ok(data => {
            ok(data);
            ////console.log(data);
        }).fail(data => {
            fail(data);
            ////console.log(data);
        })
    }

    /**
     * 更新用户手机号
     * @param data 入参
     * @param ok 回到函数，执行成功
     * @param fail 回到函数，执行失败
     */
    updateMobile(data: any, ok: Function, fail: Function) {
        this.api.call("UserController.updateMobile", data).ok(data => {
            ok(data);
        }).fail(data => {
            fail(data);
        })
    }

    /**
     * 更新用户信息
     * @param data 入参
     * @param ok 回到函数，执行成功
     * @param fail 回到函数，执行失败
     */
    updateUserInfo(data: any, ok: Function, fail: Function) {
        this.api.call("UserController.updateUser", data).ok(json => {
            ok(data);
        }).fail(data => {
            fail(data);
        });
    }

    updatePortrait(data: any, ok: Function, fail: Function = null) {
        this.api.call("UserController.updatePortrait", data).ok(json => {
            ok(data);
        }).fail(data => {
            if (fail) {
                fail(data);
            } else {
                if (data.code) {
                    alert("修改失败：" + data.error);
                } else {
                    alert("系统出错请联系管理员");
                }
                console.error(data);
            }
        });
    }
}
