import {Component, EventEmitter, Output, Input,OnInit} from '@angular/core';
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {API} from "../../../../share/lib/api/api";
import {DatePipe} from "@angular/common";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
import {ConfirmationService} from 'primeng/primeng';


@Component({
    selector: 'order-win',
    templateUrl: './order-win.component.html',
    styleUrls: [
        './order-win.component.css'
    ]
})

export class OrderWinComponent implements OnInit{
    constructor(public datepickerService: DatepickerService,
                public api: API,
                public datepipe: DatePipe,
                public RequestTokenService:RequestTokenService,
                public confirmationService:ConfirmationService
    ) {
    }

    @Output() hideWin = new EventEmitter();
    @Output() onHideWin = new EventEmitter();
    @Input() wayBill: any;
    @Input() selectLineInfo;//所有的数据
    @Input() taskId: any;
    msgs:any; //公共提示
    loading:boolean;
    cat:any;
    ngOnInit(){
        this.RequestTokenService.createToken();
        let date = new Date;
        let montn = date.getMonth()+1;
        let day = date.getDate();
        day>9?day.toString():0+day.toString();
        montn>9?montn.toString():0+montn.toString();
        this.Date = date.getFullYear()+"/"+montn+"/"+day+ " 09:30";//默认当前年月09:30
    }
    /*取消*/
    close() {
        this.hideWin.emit();
    }

    /**
     * 预约：保存按钮（调度+ 维修）
     */
    save() {
        //判断时间
        let dateNow = new Date();
        let timeStamNow = dateNow.getTime();
        let dateSlect = new Date(this.Date);
        let timeStamSlect = dateSlect.getTime();
        if(timeStamSlect<=timeStamNow){
            this.showSuccess("warn","提示","选择时间不能小于当前时间");
            return;
        }
        this.loading = true;
        switch (this.selectLineInfo[0].taskType) {
            case "调度任务":
                this.api.call('taskInstallController.appointment', {
                    taskId: this.selectLineInfo[0].id,
                    appointmentTime: this.Date
                }).ok(data => {
                    this.onHideWin.emit();
                    this.loading = false;
                }).fail(data => {
                    this.loading = false;
                    if(data.code === 605){
                        $('#order-box').css("display","none");
                        $('#tianmao').css("display","block");
                        this.cat = data.error;
                    }else {
                        this.showSuccess("error","提示",data.error);
                    }

                });
                break;

            case "维修任务":
                let time = this.datepipe.transform(this.Date, "yyyy-MM-dd HH:mm:ss");
                this.api.call('AftermarketTaskController.reservation', {
                    taskId: this.selectLineInfo[0].id,
                    appointmentTime:time
                }).ok(data => {
                    this.onHideWin.emit();
                    this.loading = false;
                }).fail(data => {
                    this.loading = false;
                });
                break;
        }
    }
    saveShow(){
        this.api.call('taskInstallController.appointment', {
            taskId: this.selectLineInfo[0].id,
            appointmentTime:this.Date,
            jumpTmallReservation:true,
            source: "ips",
            tmallReservationErrorMsg:this.cat,
        }).ok(data=>{
            this.onHideWin.emit();
        }).fail(error=>{
            this.showSuccess("error","提示",error.error);
        })
    }
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }

    /*
     *
     *  取消按钮*/
    // 日期组件
    Date: string;
    zh: any = this.datepickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
}
