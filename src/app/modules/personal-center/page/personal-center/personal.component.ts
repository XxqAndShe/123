import { animate, Component, OnInit, state, style, transition, trigger } from "@angular/core";
import { DragBoxService } from "../../../../share/app-service/drag-box.service";
import { ShowOrHideMaskService } from "../../../../share/app-service/show-or-hide-mask.service";
import { UserVo } from "../../../sale-center/page/scheduling/vo/user.vo";
import { API } from "../../../../share/lib/api/api";
import { Router } from "@angular/router";
import { PersonalService } from "../../service/personal.service";
import { UserService } from "app/security/service/user.service";
import { AppConfig } from "app/app.config";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
    selector: 'personal-center',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.css'],
    animations: [trigger('boxState', [
        state("show", style({
            transform: 'scale(1)'
        })),
        state("hide", style({
            transform: 'scale(0)'
        })),
        transition('hide<=>show', animate('180ms ease-in'))
    ])]
})
export class PersonalComponent implements OnInit {
    userInfo: UserVo;
    thisEmail:any;
    newEmail:any;
    msgs: any;
    constructor(public api: API,
        public drag: DragBoxService,
        public mask: ShowOrHideMaskService,
        public personalService: PersonalService,
        public userService: UserService,
        public router: Router,
        public appConfig: AppConfig,
        public sanitizer: DomSanitizer) { }

    public telState: string = 'hide';
    public emailState: string = 'hide';
    public passwordState: string = 'hide';
    public invalidPw: boolean = false;
    public invalidFormatNewPw: boolean = false;
    public passmodify_valid_text: string = '';
    public userMobile: string = "";
    public files: File;
    public portraitUrl: string = "/assets/touxiang01.gif";
    public phoneReg: RegExp = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    ngOnInit() {
        let telBox = document.getElementById('change_mobile');
        let emailBox = document.getElementById('change_email');
        let passwordBox = document.getElementById('change_password');
        let telMoveArea = document.getElementById("tel_move_area");
        let emailMoveArea = document.getElementById("email_move_area");
        let passwordMoveArea = document.getElementById("password_move_area");
        this.drag.dragEle(telMoveArea, telBox);
        this.drag.dragEle(emailMoveArea, emailBox);
        this.drag.dragEle(passwordMoveArea, passwordBox);
        this.userInfo = new UserVo();
        this.userService.currentUser(data => {
            Object.assign(this.userInfo, data);
            this.portraitUrl = data.portrait[0] || "/assets/touxiang01.gif";
            this.userMobile = data.mobile.substr(0, 3) + '****' + data.mobile.substr(7, 10);
        });

    }

    clearChangedData() {
        this.oldPwd = '';
        this.angPwd = '';
        this.newPwd = '';
        this.invalidFormatNewPw = false;
        this.invalidPw = false;
    }

    showChangeBox(tarBox) {
        tarBox.style.display = 'block';
        if (tarBox.id === 'change_mobile') {
            this.telState = 'show';
        } else if (tarBox.id === 'change_email') {
            this.emailState = 'show';
        } else if (tarBox.id === 'change_password') {
            this.clearChangedData();
            this.passwordState = 'show';
        }
        this.mask.show();
    }

    hideChangeBox(tarBox) {
        tarBox.style.display = 'none';
        if (tarBox.id === 'change_mobile') {
            this.telState = 'hide';
            // clearInterval(this.timer);
            // getCode.removeAttribute("disabled");
            // getCode.style.backgroundColor="#0d85e4";
            // getCode.style.border="none";
            // getCode.style.color="#fff";
            // getCode.value="获取验证码";
            // this.wait = 90;
        } else if (tarBox.id === 'change_email') {
            this.emailState = 'hide';
        } else if (tarBox.id === 'change_password') {
            this.passwordState = 'hide';
        }
        this.mask.hide();
    }
    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
    /**
     * 保存用户信息
     * @author siYuan
     * @date 2017-03-11
     */
    saveUserInfo() {
        if (this.emailInfo != "") {
            return;
        }
        this.personalService.updateUserInfo(this.userInfo, data => {
            this.showSuccess("success", "提示", "修改成功");
            if(this.files) {
                this.upload();
            }
        }, data => {
            if (data.code) {
                this.showSuccess("error","提示","修改失败：" + data.error);
                // alert("修改失败：" + data.error);
            } else {
                // alert("系统出错请联系管理员");
                this.showSuccess("error","提示","系统出错请联系管理员");
            }
            console.error(data);
        });
    }

    inputFocus($event): void {
        this.invalidPw = false;
        this.invalidFormatNewPw = false;
    }

    /**
     * 失去焦点保存邮箱
     */
    emailInfo: string = "";

    changeEmail() {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (this.userInfo.email == "") {
            this.emailInfo = "邮箱地址 不能为空";
        } else if (!reg.test(this.userInfo.email)) {
            this.emailInfo = "邮箱格式不正确";
        } else {
            this.emailInfo = "";
        }
    }

    /**
     * 修改密码
     * @author siYuan
     * @date 2017-03-11
     */
    oldPwd: string = "";
    newPwd: string = "";
    angPwd: string = "";

    savePwd() {
        this.invalidPw = false;
        var patrn = /^[\w.]{6,20}$/;
        this.invalidFormatNewPw = false;
        if (this.oldPwd == "") {
            this.passmodify_valid_text = "请输入当前密码";
            this.invalidPw = true;
            return;
        } else if (this.oldPwd === this.newPwd) {
            this.passmodify_valid_text = "新密码不能和旧密码相同";
            this.invalidPw = true;
            return;
        } else if (!patrn.exec(this.newPwd)) {
            this.passmodify_valid_text = "新密码不符合要求";
            this.invalidPw = true;
            this.invalidFormatNewPw = true;
            return false
        } else if (!this.angPwd) {
            this.passmodify_valid_text = "请再次输入新密码";
            this.invalidPw = true;
            return;
        } else if (this.newPwd != this.angPwd) {
            this.passmodify_valid_text = "两次新密码输入不一致";
            this.invalidPw = true;
            return;
        }
        let data = {
            oldPwd: this.oldPwd,
            pwd: this.newPwd
        };

        this.personalService.updatePwd(data, data => {
            this.oldPwd = "";
            this.newPwd = "";
            this.angPwd = "";
            this.passwordState = 'hide';
            this.mask.hide();
            this.showSuccess("success","提示","修改成功");
            // localStorage.removeItem('jwt');
        }, data => {
            //////console.log(data);
            if (data.code) {
                this.showSuccess("error","提示","修改失败 : 当前密码不正确");
                // alert("修改失败 : 当前密码不正确");
            } else {
                this.showSuccess("error","提示","系统出错请联系管理员");
                // alert("系统出错请联系管理员");
            }
            console.error(data);
        })
    }

    verCode: string = "";
    newMobile: string = "";

    /**
     * 修改手机号
     * @author siYuan
     * @type {number}
     */
    saveMobile() {
        if (this.verCode == "") {
            this.showSuccess("warn","提示","请输入验证码");
            // alert("请输入验证码");
            return;
        }
        if (this.newMobile == "") {
            this.showSuccess("warn","提示","请输入新手机号");
            // alert("请输入新手机号");
            return;
        }
        //验证手机号
        if (!this.phoneReg.test(this.newMobile)) {
            this.showSuccess("warn","提示","请输入正确的手机号码");
            // alert("请输入正确的手机号码");
            return;
        }
        let user: UserVo = new UserVo();
        user.mobile = this.newMobile;
        user.validateCode = this.verCode;
        this.personalService.updateMobile(user, data => {
            this.telState = 'hide';
            this.mask.hide();
            this.userInfo.mobile = this.newMobile;
            this.showSuccess("success","提示","修改成功请重新登录");
            // alert("修改成功请重新登录！");
            localStorage.removeItem('jwt');
            this.router.navigateByUrl("/security/login");
        }, data => {
            if (data.code) {
                // alert("修改失败：" + data.error);
                this.showSuccess("error","提示","修改失败：" + data.error);
            } else {
                this.showSuccess("error","提示",'系统出错请联系管理员');
                // alert("系统出错请联系管理员");
            }
            console.error(data);
        })
    }

    wait = 90;
    timer = null;

    /**
     * 获取验证码
     * @type {number}
     */
    getValidateCode(event: any) {
        if (!this.newMobile) {
            this.showSuccess("warn","提示","请输入新手机号");
            // alert("请输入新手机号");
            return;
        }
        if(this.newMobile==this.userInfo.mobile){
            this.showSuccess("warn","提示","新手机号不可以与旧手机号相同");
            // alert("新手机号不可以与旧手机号相同");
            return;
        }
        //验证手机号
        if (!this.phoneReg.test(this.newMobile)) {
            this.showSuccess("warn","提示","请输入正确的手机号码");
            // alert("请输入正确的手机号码");
            return;
        }
        this.userService.getValidateCode({
            validateCodeMowbile:this.newMobile
        },() => {
            this.timeUp(event);
        });
    }

    timeUp(event: any) {
        var that = this;

        if (this.wait == 0) {
            event.target.removeAttribute("disabled");
            event.target.style.backgroundColor = "#0d85e4";
            event.target.style.border = "none";
            event.target.style.color = "#fff";
            event.target.value = "获取验证码";
            this.wait = 90;

        } else {
            event.target.setAttribute("disabled", true);
            event.target.style.backgroundColor = "#f8f8f8";
            event.target.style.border = "1px solid #ddd";
            event.target.style.color = "#333";
            event.target.value = this.wait + "s后可重发";
            this.wait--;
            this.timer = setTimeout(function () {
                that.timeUp(event)
            },
                1000)
        }
    }

    /**
     * 触发头像修改
     */
    triggerFile(file, img) {
        file.click();
    }

    showImg(event, img) {

        if (event.target.files && event.target.files[0]) {
            var pos = event.target.files[0].name.lastIndexOf(".");
            var lastname = event.target.files[0].name.substring(pos + 1, event.target.files[0].name.length);
            var hz = 'jpg jpeg png gif';
            if (hz.indexOf(lastname) >= 0) {
                this.files = event.target.files[0];
                img.src = window.URL.createObjectURL(event.target.files[0]);
                // this.upload();
            } else {
                this.showSuccess("warn","提示","请输入正确的图片格式");
                // alert("请输入正确的图片格式");
            }
        }
    }

    upload() {
        let xhr = new XMLHttpRequest(),
            formData = new FormData();

        let jwt = localStorage["jwt"];
        formData.append("file", this.files, this.files.name);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    this.updatePortrait(data);
                } else {
                    this.showSuccess("error","提示","更改头像失败");
                    // alert("更改头像失败!");
                }
            }
        };
        xhr.open('POST', this.appConfig.baseUrl + "/upload", true);
        if (jwt) {
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);
        }
        xhr.send(formData);
    }

    updatePortrait(data: any) {
        let fileId=data[0]['id'];
        this.personalService.updatePortrait({
            "portrait": [fileId]
        }, () => {
            //右上角header头部个人中心图标立即生效显示
            window['epInstance'].emit('change_personal_portrait',data[0])
        });
    }

    //防止編譯報錯
    saveEmail(){}
}
