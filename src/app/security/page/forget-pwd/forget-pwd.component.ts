import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "app/security/service/user.service";
import {Message} from "primeng/primeng";
@Component({
  selector: 'app-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.css']
})
export class ForgetPwdComponent implements OnInit {

  public copyrightYear: number = new Date().getFullYear();
  public phoneNumber: string = "";
  public phoneReg: RegExp = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  public errorInfo: string = '';
  public infoInvalid: boolean = false;
  public phoneNumberAsterisk: string = '';
  public stepClass1: string = 'current';
  public stepClass2: string = '';
  public stepClass3: string = '';
  public intervalTime: number = 60;//验证码获取间隔时间（秒）

  public password: string = "";
  public confirmPassword: string = "";

  public passwordInvalid: boolean = false;
  public errorPasswordInfo: string = "";
  public validateCode: string = "";

    msgs: Message[] = [];

  constructor(
    public userService: UserService,
    public router: Router
  ) { }

  ngOnInit() {

  }
  inputFocus($event): void {
    this.infoInvalid = false;
    this.passwordInvalid = false;
  }
  nextStep($event, step): void {
    //验证手机号
    if (!this.phoneReg.test(this.phoneNumber)) {
      this.infoInvalid = true;
      this.errorInfo = '请输入正确的手机号码';
      return;
    }
    if (step === 1) {
      let number = this.phoneNumber;
      this.phoneNumberAsterisk = number.substr(0, 3) + '****' + number.substr(7, 10);
      //获取验证码
      this.userService.getValidateCodeByMobile({ mobile: number, validateCodeMobile: number }, () => {
        this.stepClass1 = '';
        this.stepClass2 = 'current';
      });
    } else if (step === 2) {
      if (!this.validateCode) {
        this.infoInvalid = true;
        this.errorInfo = '请输入验证码';
        return;
      }
      //验证码正确性检查
      this.userService.checkValidateCode({ "validateCode": this.validateCode, "mobile": this.phoneNumber }, () => {
        this.stepClass2 = '';
        this.stepClass3 = 'current';
      }, data => {
        this.infoInvalid = true;
        this.errorInfo = data.error;
      });
    } else if (step === 3) {
      if (!this.password) {
        this.passwordInvalid = true;
        this.errorPasswordInfo = "请输入密码";
      } else if (this.password != this.confirmPassword) {
        this.passwordInvalid = true;
        this.errorPasswordInfo = "两次输入密码不一致";
        return;
      }
      //密码修改接口调用
      this.modifiedPassWord();
    }
  }
  /**
   * 重新获取验证码
   */
  getVerifiCode(): void {
    //调取接口
    this.userService.getValidateCodeByMobile({ mobile: this.phoneNumber, validateCodeMobile: this.phoneNumber }, () => {
      //计时器
      let timer = setInterval(() => {
        this.intervalTime--;
        //console.log(this.intervalTime)
        if (this.intervalTime === 0) {
          clearInterval(timer);
          this.intervalTime = 60;
        }
      }, 1000);
    });

  }
  /**
   * 密码修改
   */
  modifiedPassWord(): void {
    this.userService.resetPwd({ "mobile": this.phoneNumber, "pwd": this.password }, () => {
        this.showSuccess("success","提示","修改成功！");
      this.router.navigateByUrl("/security/login");
    }, data => {
      this.passwordInvalid = true;
      this.errorPasswordInfo = data.error;
    });
  }

    /**
     *弹窗提示
     */
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
}
