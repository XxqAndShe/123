import {Component, OnInit, Output, EventEmitter, DoCheck, OnDestroy} from "@angular/core";
import { waitingData, memberData, historyData, TeamerData } from './testData';
//列表测试数据
import {OrderData, InData, OtherData} from "../../../../mock/im-data";

import { getTaskOneTmpl } from "../template/message";
import { Router } from "@angular/router";
import { API } from "../../../share/lib/api/api";
import {AppConfig} from "app/app.config"
// 提示框组件
import {ConfirmDialogModule,ConfirmationService, Message} from 'primeng/primeng';

import {AuthService} from "../../../share/auth-service/auth.service";
import { UserService } from "../../../security/service/user.service";

@Component({
    styleUrls: ['./im-chat.component.css'],
    templateUrl: './im-chat.component.html',
    providers: [UserService]
})
export class ImChatComponent implements OnInit, DoCheck,OnDestroy {
    ngOnDestroy(): void {
        clearInterval(this.timer);
    }
    // growl信息
    msgs: Message[] = [];
    //获取当前用户数据
    curUser: any;
    /**
     * 点击标记列表
     */
    listType:string='huihua';
    updateList:any = null;

    queryTaskAll:any;

    MasterData: any[]=[];


    InData: any[]=[];

    OrderData: any[]=[];

    OtherData: any[]=[] ;

    waitingData: any[]=[] ;

    memberData: any[]=[] ;

    historyData: any[]=[] ;

    imgsrc:string;
    isShowGroupBg: boolean = false;

    // 对话框图片和标题
    groupTitle: any;
    groupPic: any;
    groupId: any;
    title: any;

    IMstyleName: string = 'IMstyle';

    /*定时器*/
    timer: any;
    // 会话总数
    sum: number;
    // 待接入总数
    InDataSum:number;
    /*选择同事列表*/
    teamerData: any = TeamerData;

    //不同对话列表的筛选条件
    chatSession: any = null;
    joinList: any = null;
    workerList: any = null;
    //编辑时接收是否清除定时器标志
    isCleartimer: boolean = true;

    ShowGroupBg() {
        this.isShowGroupBg = true;
    }

    closeWorkmate() {
        this.isShowGroupBg = false;
    }

    /**
     * 成员详情显示标志位
     * @param el
     */
    memberDetailFlag: any[] = [];

    waitContactFlag: any[] = [];

    /*im群组表数据*/
    public imGroupData: any;



    constructor(public router: Router,
                public api: API,
                public authService: AuthService,
                public userService: UserService
    ) {

    }
    portraitUrl:string;
    ngOnInit(): void {
        this.userService.currentUser(data => {
            this.portraitUrl = data.portrait[0] || "/assets/touxiang01.gif";
        });
        this.curUser = JSON.parse(localStorage.getItem('currentUser'));
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
                this.timerfunction()
            }, 5000);
        }
        this.memberDetailFlag = Array.from({ length: this.memberData.length }, (v, k) => false);
        this.waitContactFlag = Array.from({ length: this.waitingData.length }, (v, k) => false);
    }
    getImg(e) {
        this.imgsrc = e;
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

    //TODO DoCheck太灵敏
    ngDoCheck() {
        // clearInterval(this.timer);
        // /**
        //  *  定时刷新列表数据
        //  * (数据，间隔时间)
        //  */
        // if (!AppConfig.closeIMInterval && this.isCleartimer) {
        //     this.refreshData(() => {
        //         this.timerfunction()
        //     }, 5000);
        // }
    }
    /**
     * 会话列表查询
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


    receiveJoinIn(e: any) {
        this.imGroupData = e;
    }
    /**
     * 加载会话列表
     * */
    loadChatSession() {
        //加载会话列表
        this.api.call('ImipsController.ipsIMSessionList', {"first": 0, "rows": 9999}, {"keyword": this.updateList})
            .ok(data => {
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
        this.api.call('ImipsController.ipsIMWorkerList', {"first": 0, "rows": 50}, {"keyword": this.updateList})
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
     * 切换5个对话列表
     * @param e
     * @param index
     */
    displayModal(e, index) {
        let selectLi = `.selectLi${index}`;
        let obj = $(e.target);
        obj.addClass('on').siblings().removeClass('on');
        $(selectLi).addClass('on').parent().siblings('li').find('a').removeClass('on');
        $(".list_box .im_box_cont ul").not($(".on")).animate({left: -270}, 200);
        $(".list_box .im_box_cont ul").eq(index).animate({left: 0}, 200, () => {$(".list_box .im_box_cont ul").eq(index).siblings().addClass("on").css({left: "270px"});
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

    /**
     * 传递群组信息
     * @param e
     */
    sessionJoinIn(e){
        this.groupTitle = e.taskTitle;
        this.groupPic = e.taskType;
        this.groupId = e.groupId;
        this.title = e.title;
    }



    waitContactOver(i) {
        this.waitContactFlag[i] = true;
    }

    waitContactOut(i) {
        this.waitContactFlag[i] = false;
    }

    /*点击头像*/
    headClick(e) {

        $(".left_box .user_info .set").show();

        $(document).one("click", function () {
            $(".left_box .user_info .set").hide();
        });
        e.stopPropagation();
    }

    sessionKey: boolean = true;
    isOnLine: boolean = true;
    onLine(){
        this.isOnLine = true;
        //加载接入表
        this.api.call('ImipsController.userOnlineChange',{"online": true})
            .ok(data => {
                this.loadChatSession();
                this.loadJoinList();
            })
            .fail(data => {
                alert(data.error);
            })
    }
    imgSrc: string;
    receiveImgSrc(img) {
        this.imgSrc = img;
    }
    offLine(){
        this.isOnLine = false;
        this.api.call('ImipsController.userOnlineChange',{"online": false})
            .ok(data => {
                this.loadChatSession();
                this.loadJoinList();
            })
            .fail(data => {
                alert(data.error);
            })
    }

    history(e) {
        e.preventDefault();
        $(".chat_history").animate({ marginRight: "-310px" }, 100);
        $(".chat_history").css({ display: "block" });
    }

    /**
     * 根据类名不同  头像上显示不同的文字
     * @param type
     * @returns {any}
     */
    getClass(type) {
        switch (type) {
            case '新':
                return 'xin';
            case '维':
                return 'wei';
            case '返':
                return 'fan';
            default:
                return 'xin';
        }
    }

    /*订单号模板插入*/
    receiveOrderType(orderData: any) {
        if (!orderData) return;
        let tmpl = getTaskOneTmpl(orderData);
        $('#cont_order').removeClass('noll');
        $('#cont_order_ul').html(tmpl);
    }

    /**
     * 保存名字后提示信息
     * @param e
     */
    getGrowl(e: any){
        /*  this.msgs = [];
        if(e == 'success'){
            this.msgs.push({severity:'success', summary:'保存成功', detail:'名字已更改'});
        } else if(e == 'warn'){
            this.msgs.push({severity:'warn', summary:'输入有误', detail:'名字不能为空'});
        } else {
            this.msgs.push({severity:'error', summary:'输入错误', detail:'修改错误'});
        }*/
    }
    //防止编译报错
    receiveMasterJoinIn(e: any){
        this.groupTitle = e.taskTitle;
        this.groupPic = e.taskType;
        this.groupId = e.groupId;
        this.title = e.title;
    }
    receive(e: any){}

}
