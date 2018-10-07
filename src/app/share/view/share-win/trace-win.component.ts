/**
 * Created by hua on 2017-01-06.
 */
import {
    Component, trigger, animate, state, style, transition, OnInit, Output, EventEmitter,
    Input
} from '@angular/core';
import {ShowOrHideMaskService} from '../../app-service/show-or-hide-mask.service';
import {DragBoxService} from '../../app-service/drag-box.service';
import {API} from "../../lib/api/api";
import {DatepickerService} from "../../app-service/datepicker.service";

import {animationScale} from "../../../modules/sale-center/page/exception-handle/share/dialog.animation";
import {TrackWinRequestVo} from "./trace-win-request-vo";
import {AbnormalTaskService} from "../../../modules/sale-center/page/abnormal-sale/service/abnormal-task.service";
import {DatePipe} from "@angular/common";
import {RequestTokenService} from "../../app-service/request-token.service";

@Component({
    selector: 'trace-win',
    templateUrl: './trace-win.component.html',
    styleUrls: ['./trace-win.component.css'],
    animations: [trigger('timeTable', [
        state('show', style({
            height: '96px',
            opacity: '1'
        })),
        state('hide', style({
            height: '0',
            opacity: '0'
        })),
        transition('hide=>show', animate('100ms ease-in')),
        transition('show=>hide', animate('200ms ease-in'))
    ]),
        animationScale
    ]
})
export class TraceWin implements OnInit {
    //选中记录
    @Input() rowData:any;
    @Input() selections: any[];
    public timeTableState = 'hide';
    @Input() boxState: string;//控制弹框盒显示隐藏
    @Input() wayBill; // 运单号输入
    @Input() selectLineInfo;//所有点击的表格的数据
    //点击×，关闭弹框
    @Output() hideWin = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<any>();

    public trackTimeHint:boolean = true;
    today = new Date();
    y = this.today.getFullYear();
    mTemp = this.today.getMonth() + 1;
    m = this.mTemp < 10 ? '0' + this.mTemp : this.mTemp;
    dTemp = this.today.getDate();
    d = this.dTemp < 10 ? '0' + this.dTemp : this.dTemp;

    hasHidden1 = true;
    hidden1 = true;
    dateText1 = this.y + '-' + this.m + '-' + this.d;

    //导入跟踪请求vo
    trackWinRequestVo: TrackWinRequestVo;
    msgs:any;//提示弹框
    //是否显示跟踪时间
    isShowTraceTime:boolean=true;
    /*公共弹窗提示*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    changeDateText1(dateStr: string) {
        this.dateText1 = dateStr;
        this.hidden1 = true;
    }

    constructor(public api: API, public drag: DragBoxService, public mask: ShowOrHideMaskService,
                public datepickerService: DatepickerService, public abnormalTaskService: AbnormalTaskService,
                public datePipe:DatePipe,public requestTokenService: RequestTokenService

    ) { }


    ngOnInit() {
        //console.log(this.selectLineInfo);
        this.trackWinRequestVo = new TrackWinRequestVo();
        let box = document.getElementById('markInfo_box');
        let moveArea = document.getElementById("mark_move_area");
        this.drag.dragEle(moveArea, box);
        this.requestTokenService.createToken();
    }

    setPos() {
        return this.drag.setPosition(510, 380);
    }

    /**
     * 是否选择跟踪时间
     * @param event
     * @constructor
     */
    ShowTraceTime(event){
        if(event=="yes"){
            this.isShowTraceTime=true;
        }else{
            this.isShowTraceTime=false;
        }
    }

   /* //隐藏时间表
    hideTime() {
        this.timeTableState = 'hide';
    }
    //点击显示时间表
    clickShowTime(timeTable: any) {
        this.timeTableState = 'show';
        if (parseInt(timeTable.style.height) == 96) {
            return;
        }
        var time = new Date(), hours = time.getHours() + 1,
            allHours = document.getElementById("time_table").getElementsByClassName('ui-state-default');
        this.removeActiveClass('time_table', 'ui-state-default');
        for (var i = 0, len = allHours.length; i < len; i++) {
            if (allHours[i].innerHTML.toString() == hours.toString()) {
                allHours[i].classList.add('active');
            }
        }
        if (hours == 24)
            allHours[0].classList.add('active');
        timeTable.focus();
    }
    //删除active 类
    removeActiveClass(content, activeElement) {
        var collect = document.getElementById(content).getElementsByClassName(activeElement);
        for (var i = 0, len = collect.length; i < len; i++) {
            collect[i].classList.remove('active');
        }
    }*/


    isNextTrack: string = "yes";
    Date:string;
    flag:boolean = false;
    //点击不跟踪
   /* dontRemark(e) {
        // debugger;
        var bc = e.target.classList.contains('mark-bc');
        if (bc) {
            e.target.classList.remove('mark-bc');
            e.target.textContent = '不跟踪';
            this.trackTimeHint = true;
        } else {
            e.target.classList.add('mark-bc');
            e.target.textContent = '跟踪'
            this.trackTimeHint = false;
            this.flag = true;
        }
        var donRemark = document.querySelector('#markInfo_box');
        var collectTime = donRemark.getElementsByClassName("mark");
        for (var i = 0, len = collectTime.length; i < len; i++) {
            if (!bc) {
                collectTime[i].classList.add('hide');
            }
            else {
                collectTime[i].classList.remove('hide');
            }
        }
    }*/


    trackRequestVo: any = {
        trackDate: this.dateText1,
        trackRemark: '',
        trackTime: '',
        isNextTrack: ''
    };

    doSave() {
        let remark = document.getElementById('text_content');
        let hour = document.getElementById("hour");
        let min = document.getElementById("min");
        this.trackRequestVo.trackRemark = remark['value'];
        this.trackRequestVo.trackTime = hour.innerHTML + ":" + min.innerHTML;
        this.save.emit(this.trackRequestVo);
    }

    closeHideModal() {
        this.hideWin.emit(false);
        this.mask.hide();
    }

    zh: any = this.datepickerService.locale();
    yearRange: string = "2000:2099";
    //trackFlag用来区分不同模块调用的逻辑，比如DDRW表示调度任务模块
    @Input() trackFlag: any;
    //添加跟踪的请求参数
    traceAddRequestVo: any = {};

    /**
     * 待跟踪任务添加跟踪信息
     */

    saveTrace(){
        //判断时间
        let dateNow = new Date();
        let timeStamNow = dateNow.getTime();
        let dateSlect = new Date(this.Date);
        let timeStamSlect = dateSlect.getTime();
        /*let noFollow = document.querySelector('.select-btn').textContent;
        if (noFollow == '跟踪' &&　this.traceAddRequestVo.trackContent) {
            // this.SubMenuCount.changCount();
        }*/
        if(timeStamSlect<=timeStamNow&&!this.flag){
            this.showSuccess("warn","提示","选择时间不能小于当前时间");
            return;
        }
            if(!this.traceAddRequestVo.nextTrackDate && this.isShowTraceTime == true){
                this.showSuccess("warn","提示","跟踪时间不能为空");
                return;
            }else if(!this.traceAddRequestVo.trackContent || this.traceAddRequestVo.trackContent.length<1){
            this.showSuccess("warn","提示","备注信息不能为空");
            return;
        }

        let that = this;
        this.selectLineInfo = this.selectLineInfo[0]?this.selectLineInfo[0]:this.selectLineInfo;
        this.traceAddRequestVo = {
            //调度任务
            //task/abnormal/abnormalArbitration
            TrackType: this.selectLineInfo.whatType,
            id: this.selectLineInfo.id,
            nextTrack: this.isShowTraceTime,
            nextTrackDate: this.traceAddRequestVo.nextTrackDate,
            trackContent: this.traceAddRequestVo.trackContent
        };
        //console.log(this.traceAddRequestVo);
        this.api.call("TaskTraceController.saveTaskTrace",this.traceAddRequestVo)
            .ok(data=>{
                this.traceAddRequestVo.nextTrackDate = '';
                this.traceAddRequestVo.trackContent = '';
                this.save.emit();
            }).fail(function(){
            that.showSuccess("error","提示","保存跟踪信息失败！请重试！");
        });
    }



}
