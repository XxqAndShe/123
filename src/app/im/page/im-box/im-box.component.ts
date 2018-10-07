import {Component, Input, Output, EventEmitter, OnInit,  OnDestroy, OnChanges} from '@angular/core';
import {Router} from '@angular/router';

import {OrderData, InData, OtherData} from "../../../../mock/im-data";
/**/
import {API} from "../../../share/lib/api/api";
import {AppConfig} from "app/app.config";
declare let $: any;

@Component({
    selector: 'im-box',
    templateUrl: './im-box.component.html',
    styleUrls: ['./im-box.component.css']
})
export class ImChatComponent implements OnInit,OnDestroy {
    /*其他成员列表*/
    OtherData: any[] = OtherData;
    @Output() public canOpen = new EventEmitter<boolean>();
    @Output() public isJoinIn = new EventEmitter<any>();
    @Output() public isMasterJoinIn = new EventEmitter<any>();
    @Input()
    /**
     * 点击标记列表
     */
    listType:string='huihua';
    updateList:any = null;

    /*对话成员列表*/
    OrderData: any[];
    /*对接成员列表*/
    InData: any[];
    /*对接成员数量*/
    InDataSum: number;

    // 对话成员列表数据
    MasterData: any[];

    /*定时器*/
    timer: any;
    // 会话总数
    sum: number;
    // growl信息
    msgs: any = [];
    //不同对话列表的筛选条件
    chatSession: any = null;
    joinList: any = null;
    workerList: any = null;
    //编辑时接收是否清除定时器标志
    isCleartimer: boolean = true;

    constructor(public router: Router, public api: API) {

    }

    ngOnInit() {
        //会话列表
        this.loadChatSession();
        //接入列表
        this.loadJoinList();
        //师傅列表
        this.loadWorkerList();
        /**
         *  定时刷新列表数据
         * (数据，间隔时间)
         */
        if (!AppConfig.closeIMInterval && this.isCleartimer) {
            this.refreshData(() => {
                this.timerfunction();
            }, (window['imListInterval'] || 5000));
        }
    }
    @Output() private imgsrc = new EventEmitter<any>();
    getImgSrc(e) {
        this.imgsrc.emit(e);
    }
    /**
     * 接收是否清除定时器标志
     * @param e
     */
    clrTimer(e: boolean){
        this.isCleartimer = e;
        if(!this.isCleartimer){
            clearInterval(this.timer);
        } else if (!AppConfig.closeIMInterval && this.isCleartimer){
            this.refreshData(() => {
                this.timerfunction()
            }, (window['imListInterval'] || 5000));
        }
    }

    /**
     * 任务输入筛选
     */
    loadListData() {
        switch(this.listType){
            case 'huihua':
            	this.chatSession = this.updateList;
                this.loadChatSession();
                break
            case 'jieru':
    			this.joinList =  this.updateList;
                this.loadJoinList()
                break
            case 'shifu':
    			this.workerList =  this.updateList;
                this.loadWorkerList()
                break
        }
    }
    /*
     * 关闭对话列表
     * */
    closeChatList() {
        let that = this;
        this.canOpen.emit(false);
        $(".im_lift_box").animate({right: "-260px"}, 200);
        setTimeout(function () {
            that.canOpen.emit(true);
        }, 200);
    }


    /**
     * 切换5个对话列表
     * @param e
     * @param index
     */
    displayModal(e, index) {
        let obj = e.target;
        $(obj).addClass('on').parent().siblings('li').find('a').removeClass('on');
        $(".im_lift_box .im_box_cont ul").not($(".on")).animate({left: -260}, 200);
        $(".im_lift_box .im_box_cont ul").eq(index).animate({left: 0}, 200, () => {
            $(".im_lift_box .im_box_cont ul").eq(index).siblings().addClass("on").css({left: "260px"});
        }).removeClass("on");

        switch(this.listType){
            case 'huihua':
            	this.updateList = this.chatSession;
                break
            case 'jieru':
            	this.updateList = this.joinList;
                break
            case 'shifu':
            	this.updateList = this.workerList;
                break
        }
    }

    /*
     * 点击im列表头跳转对话框
     * */
    skipIm() {
        window.open("im");
    }

    /*
     * 师傅会话接入
     * */
    receiveMasterJoinIn(e: any) {
        this.isJoinIn.emit(e);
    }

    /*
     * 会话接入
     * */
    receiveJoinIn(e: any) {
        $("#im_box_list li").eq(0).find('a').addClass('on').parent().siblings('li').find('a').removeClass('on');
        $(".im_lift_box .im_box_cont ul").not($(".on")).animate({left: -260}, 200);
        $(".im_lift_box .im_box_cont ul").eq(0).animate({left: 0}, 200, () => {
            $(".im_lift_box .im_box_cont ul").eq(0).siblings().addClass("on").css({left: "260px"});
        }).removeClass("on");
        this.isJoinIn.emit(e);
    }

    /*
     * 会话进入
     * */
    receiveSessionJoinIn(e: any) {
        this.isJoinIn.emit(e);
    }


    /**
     * 加载会话列表
     * */
    loadChatSession() {
        //加载会话列表
        this.api.call('ImipsController.ipsIMSessionList', {"first": 0, "rows": 100}, {"keyword": this.updateList})
            .ok(data => {
                // console.log(data.result.content, 'data.result.content');
                if (data.result.content) {
                    this.OrderData = data.result.content;
                    this.getSessionCount(this.OrderData);
                }
            })
            .fail(data => {
                //console.log(data);
            });

        // this.getSessionCount(this.OrderData);
    }

    /**
     * 加载接入列表
     * */
    loadJoinList() {
        //加载接入表
        this.api.call('ImipsController.ipsIMAccessList',{"keyword": this.updateList})
            .ok(data => {
                // console.log("++++++++++++++++++"+JSON.stringify(data.result));
                this.InData = data.result || [];
                this.InDataSum = data.result ? data.result.length : 0;
            })
            .fail(data => {
                //console.log(data);
            })
    }



    /**
     * 加载师傅列表
     * */
    loadWorkerList() {
        //加载师傅表
        this.api.call('ImipsController.ipsIMWorkerList', {"first": 0, "rows": 100}, {"keyword": this.updateList})
            .ok(data => {
                if (data.result.content) {
                    this.MasterData = data.result.content;
                }
            })
            .fail(data => {
                //console.log(data);
            })
    }


    /**
     * 列表定时刷新的方法
     * */
    timerfunction() {
        this.loadChatSession();
        this.loadJoinList();
    }

    /**
     * 点击师傅tab图标刷新一次师傅列表
     */
    refreshMaster(){
        this.loadWorkerList();
    }

    /*
     * 定时器方法
     * */
    refreshData(fn: any, interval: number) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(fn, interval);
    }

    getSessionCount(sessionArr: any[]) {
        this.sum = 0;
        for (let i of sessionArr) {
            if (i.num) {
                this.sum += parseInt(i.num);
            }
        }
    }

    /**
     * 保存名字后提示信息
     * @param e
     */
    getGrowl(e: any){
        this.msgs = [];
        if(e == 'success'){
            this.msgs.push({severity:'success', summary:'保存成功', detail:'名字已更改'});
        } else if(e == 'warn'){
            this.msgs.push({severity:'warn', summary:'输入有误', detail:'名字不能为空'});
        } else {
            this.msgs.push({severity:'error', summary:'输入错误', detail:'修改失败'});
        }
    }

    getFailInMsg(e: any){
        this.msgs = [];
        if(e == 'failIn'){
            this.msgs.push({severity:'error', summary:'错误提示', detail:'接入失败'});
        }
    }
    ngOnDestroy(): void {
        clearInterval(this.timer);
    }

}
