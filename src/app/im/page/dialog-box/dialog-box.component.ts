import {
    Component, Output, EventEmitter, Input, OnInit, HostListener, ElementRef, NgModule, animate, trigger, state,
    transition, style, OnChanges, OnDestroy
} from '@angular/core';
/*聊天模板*/
import {getAnswerMessageTmpl, getTaskOneTmpl} from "../template/message";
/*时间格式*/
import {DateFormatService} from "../service/dateFormat.service";
/*转义字符转换*/
import {TransferESCService} from "../service/transferESC.service";
import {getIMG, isIMG} from "../../../share/utils/imUtil";
import {DomSanitizer} from "@angular/platform-browser";
import {API} from "../../../share/lib/api/api";
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {DatepickerService} from "../../../share/app-service/datepicker.service";
import {CalendarModule} from "primeng/primeng";

import {UploadFileService} from "app/im/service/upload-file.service";
import {dataURItoBlob} from "app/im/utils/dataURItoBlob";
import {AppConfig} from "app/app.config";

// 提示框组件
import {ConfirmDialogModule,ConfirmationService, Message,GrowlModule} from 'primeng/primeng';
import { getDate } from "../../../share/utils/DateUtil";


@Component({
    selector: 'dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.css'],
    animations: [trigger('historyToggle',[
        state("show",style({
            marginRight: '-310px',
            display: 'block'
        })),
        state("hide",style({
            marginRight:'0',
            display: 'none'
        })),
        transition('hide=>show',animate('100ms ease-in')),
        transition('show=>hide',animate('100ms ease-in'))
    ])]
})
export class DialigBoxComponent implements OnInit, OnChanges ,OnDestroy {
    ngOnDestroy(): void {
        clearInterval(this.dialogTimer);
    }
    imgSrc:string;
    //控制点击重复发送
    loading=false;
    // 对话框群组名字
    groupTitle: any;
    // growl信息
    msgs: Message[] = [];
    // 对话框信息头对象集合
    groupTitleInfo: any = {};
    //定义初始页面currentPage
    currentPage: number = 0;
    //历史时间 搜索框内容
    hisSearchData: string = '';
    historyDate: string;
    showTaskSendPanel: boolean = false;
    /*对话框定时器*/
    dialogTimer: any;
    msgData: any;
    isShowGroupBg: boolean = false;
    groupId:string='';
    //总页数
    totalPages:number;
    //当前面
    curPage:number
    //页大小
    pageSize:number;
    //查询消息历史
    isShowSearch:boolean=false;
    /**
     * 文件上传
     * @type {Array}
     */
    files: any[] = [];
    vIpsIMInviteColleague: any = {};
    vIpsIMInvitation: any = {};
    /**
     * 消息类型
     * @type {{TEXT: string; IMAGE: string; TASK: string; FILE: string}}
     */
    IMMessageTyp = {
        TEXT: "TEXT",
        IMAGE: "IMAGE",
        TASK: "TASK",
        FILE: "FILE"
    }
    /*订单号显示订单详情*/
    orderNum: string;
    orderData: any = {
        orderType: 2,
        orderId: "19991212",
        orderNum: "t123",
        id: "11t123",
        taskType: "asdf",
        orderGoods: "",
        taskStatus: "待分配",
        taskDetails: {}
    };
    // 日历插件
    zh: any = this.datePickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 95+'px',
        'height': 20 + 'px',
        'textAlign': 'left',
        'cursor': 'default',
        'width': 85 + 'px',
    };
    yearRange: string = "2000:2020";
    historyMsg: any;
    // 历史记录是否显示
    hisToggle: boolean = false;
    isChecked: boolean = false;
    /**
     * 同事分页数据
     * 定义初始页面teamCurPage
     */
        //当前页
    teamCurPage: number;
    //总页数
    teamTotalPages:number;
    //每页个数
    teamPageSize: number;
    // 群主表数据
    @Input() dialog:string;
    @Input() groupIdFromIM;
    @Input() groupTitleFromIM;
    @Input() quitChat: boolean = true;
    @Input() public imGroupData: any;
    @Output() public orderType = new EventEmitter<number>();
    @Output() public isJoinInHide = new EventEmitter<boolean>();
    // 关闭按钮是否显示
    @Input() isPopUpBox: boolean = true;
    @Input() historyData: any;
    @Input() memberData: any;
    @Input() teamerData: any;
    @Input() private imgsrc: any;
    @Output() saveTitle = new EventEmitter<string>();

    constructor(public dateFromat: DateFormatService,
                public transferESCService: TransferESCService,
                public sanitizer: DomSanitizer,
                public api: API,
                public uploadFileService: UploadFileService,
                public datePickerService: DatepickerService,
                public datePipe: DatePipe,
                public confirmationService:ConfirmationService) {

    }


    ngOnInit() {
        window['epInstance'].on('imgSrcOutput', imgsrc => {
                this.imgSrc=imgsrc;
        });

        // 检测是否ips打开的对话框
        try{
            // console.log("test.................");
            this.imGroupData = this.imGroupData || {};
            this.groupId=this.imGroupData && this.imGroupData.groupId || '';
            // console.log("groudId.. data is : " + (this.groupId));

        }catch(e){
            // console.log(e);
        }
        /*
         定时刷新列表数据
         */
        this.queryGroupTitleInfo(); //查询群组标题
        this.queryChatMessageDefault();

        /**
         *  定时刷新数据
         * (数据，间隔时间)
         */
        if (!AppConfig.closeIMInterval) {
            this.refreshData(() => {
                this.queryChatListRedis();
            },  (window['msgRequestInterval'] || 1000));
        }

        // 已存在的群成员
        // this.ipsIMGroupUser();
        // 同事列表
        this.ipsIMInviteColleague(0);
    }

    ngOnChanges(){

        if(this.groupIdFromIM){
            this.groupId = this.groupIdFromIM;
            // this.groupTitle=this.groupTitleFromIM;
            this.hisToggle = false;
            $('.chat_content').html('');
            //查询群组标题
            this.queryGroupTitleInfo();
            this.queryChatMessageDefault();
            // 已存在的群成员
            // this.ipsIMGroupUser();
            // 同事列表
            this.ipsIMInviteColleague(0);
        }
    }





    ShowGroupBg() {
        this.isShowGroupBg = true;
    }

    closeWorkmate() {
        this.isShowGroupBg = false;
    }

    historyDateChange() {
        //转换日期格式
        this.historyDate=getDate(this.datePipe.transform(this.historyDate,'yyyy-MM-dd 23:59:59'))
        this.queryHistory("",this.historyDate, 0);
    }

    /**
     * 点击上传图片
     */
    updateImg() {
        $('#upImg').trigger('click');
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    /**
     * 选择图片
     * @param event
     */
    onFileSelect(event) {
        this.files = [];
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        let file;
        for (let i = 0; i < files.length; i++) {
            file = files[i];
            if (this.isImage(file)) {
                file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                this.files.push(files[i]);
            }
        }
        let fileUrl = file.objectURL.changingThisBreaksApplicationSecurity;
        let img = new Image();
        img.src = fileUrl;
        img.className = 'chatImg';

        $('#inputText').append(img);
    }


    //查询消息列表（缓存）
    queryChatListRedis() {
        if(!this.groupId){
            return;
        }
        this.api.call('ImmessageController.queryChatMessageRedis', {"groupId": this.groupId})
            .ok(data => {
                this.msgData = data.result;
                this.initFancybox();
                for (let msg of this.msgData) {
                    //读取数据把'<''>''引号'转义字符转成浏览器识别的符号
                    msg.msgContent = this.transferESCService.transferESC(msg.msgContent);
                    /**
                     * 作者  日期  内容  类型  左右
                     * @type {string|string|string|string|string}
                     */
                    let msgHtml = getAnswerMessageTmpl(msg.portrait,msg.author, msg.msgTime, msg.msgContent, msg.imMessageType, msg.seat);
                    $('#message-body').append(msgHtml);
                    $('.chat_content').scrollTop( $('.chat_content')[0].scrollHeight );
                }
                this.loading=false;
                $('.im_btn_send')[0].style.cursor='pointer';
                $('.im_btn_send')[0].style.color='#fff';
            })
            .fail(data => {
                this.loading=false;
                $('.im_btn_send')[0].style.cursor='pointer';
                $('.im_btn_send')[0].style.color='#fff';
            });
    }

    //聊天框打开默认查询消息
    queryChatMessageDefault() {
        if(!this.groupId){
            return;
        }
        this.api.call('ImmessageController.queryChatMessageDefault', {"groupId":this.groupId})
            .ok(data => {
                this.msgData = data.result;
                for (let msg of this.msgData) {
                    //读取数据把'<''>''引号'转义字符转成浏览器识别的符号
                    msg.msgContent = this.transferESCService.transferESC(msg.msgContent);
                    /**
                     * 作者  日期  内容  类型  左右
                     * @type {string|string|string|string|string}
                     */
                    let msgHtml = getAnswerMessageTmpl(msg.portrait,msg.author, msg.msgTime, msg.msgContent, msg.imMessageType, msg.seat);
                    $('#message-body').append(msgHtml);
                    $('.chat_content').scrollTop( $('.chat_content')[0].scrollHeight );
                }

                this.queryChatListRedis(); // 初始化聊天框查询一次

            })
            .fail(data => {
                // console.log(data);
            });
    }

    //查询群组标题信息
    queryGroupTitleInfo() {
        if(!this.groupId){
            return;
        }
        this.api.call('ImmessageController.queryGroupTitleInfo', {"groupId": this.groupId})
            .ok(data => {
                this.groupTitleInfo = {
                    "groupTitle" : data.result.groupTitle,
                    "groupPic" : data.result.taskType,
                    "shipper" : data.result.shipper,
                    "shipperMobile" : data.result.shipperMobile,
                    "consignee" : data.result.consignee,
                    "consigneeMobile" : data.result.consigneeMobile
                };
                // 动态变化群组名字
                if(this.imGroupData){
                    this.groupTitle = this.groupTitleInfo.groupTitle;
                }
                if(this.imGroupData.topStatus){
                    this.isChecked=this.imGroupData.topStatus;
                }
            })
            .fail(err => {
                // console.log(err.error);
            });
    }

    /* 定时刷新列表数据
     * (数据，间隔时间)
     * */
    refreshData(fn: any, interval: number) {
        if (this.dialogTimer) {
            clearInterval(this.dialogTimer);
        }
        this.dialogTimer = setInterval(fn, interval);
    }


    /*
     * 显示头像下拉
     * */
    showGroup() {
        this.ipsIMGroupUser();
        let flag = $(".mation").hasClass("on");
        if (flag == true) {
            $(".mation").removeClass("on");
        } else {
            $(".mation").addClass("on");
        }
    }

    /**
     * 历史点击事件
     */
    history(e) {
        e.preventDefault();
        this.hisToggle = !this.hisToggle;
        this.queryHistory("", "", 0);

    }

    queryHistory(searchText, searchTime, first) {
        if(!this.groupId){
            return;
        }
        this.api.call('ImmessageController.queryChatHistoryIps',
            {"first": first, "rows": 50},
            {"groupId": this.groupId, "searchText": searchText, "date": searchTime, "dateInterval": 0})
            .ok(data => {
                this.historyMsg = data.result.content;
                this.totalPages = data.result.totalPages;
                this.curPage = data.result.number;
                this.pageSize = data.result.size;
                this.transHistory();
            })
            .fail(data => {
                // console.log(data);
            });
    }

    //整理历史消息  添加到html
    transHistory() {
        let valArr = this.historyMsg;
        $('.hist_cont').html("");
        for (var i = valArr.length - 1; i >= 0; i--) {
            let msgType = valArr[i].imMessageType;
            let value = this.transferESCService.transferESC(valArr[i].msgContent);
            if (msgType === 'IMAGE') {
                this.initFancybox();
            }
            let messageTmpl = getAnswerMessageTmpl(valArr[i].portrait,valArr[i].author, valArr[i].msgTime, value, msgType);
            $('.hist_cont').append(messageTmpl);
        }
        $('.hist_cont').scrollTop( $('.hist_cont')[0].scrollHeight );
    }

    closeHistory() {
        this.hisToggle = false;
    }
    showContent(e) {
       this.isShowSearch = !this.isShowSearch;
    }

    headMouseOver(e, i) {
        $(".mation .member .member_list .details").removeClass("on").eq(i).addClass("on");
    }

    headMouseOut(e, i) {
        $(".mation .member .member_list .details").removeClass("on");
    }

    doSearch() {
        this.queryHistory(this.hisSearchData, "", 0);
        this.hisSearchData = '';
        $(".cont_search").hide();
    }

    /**
     * 发送消息
     * @param taskValue
     */
    sendMessage(taskValue?: any) {
        let value = $('#inputText').html();
        let orderVal = $('#input_order').val();
        // IM路由判断是否有接入对应会话
        if(!this.groupIdFromIM && !this.imGroupData){
            this.confirmationService.confirm({
                message: '请先接入会话',
                header: '提示',
                accept: () => {}
            });
            return;
        }

        if(!value && !orderVal) {
            return
        }

        this.loading=true;
        if(this.loading) {
            $('.im_btn_send')[0].style.cursor='not-allowed';
            $('.im_btn_send')[0].style.color='#ccc';
        };
        let dateTime = this.dateFromat.FormatDate(new Date());

        let isImg = value.includes('<img');
        let msgType = this.IMMessageTyp.TEXT;

        if (isImg) {
            this.initFancybox();
            msgType = this.IMMessageTyp.IMAGE;

        } else if (taskValue) {
            msgType = this.IMMessageTyp.TASK;
            //value = taskValue;
            // 清除单号左右空格
            taskValue = taskValue.replace(/<\/?.+?>/g,"");
            taskValue = taskValue.replace(/[\r\n]/g, "");
        }

        if (isImg) {
            let formData = new FormData();
            let dataURL = "";
            let src = $(value)[0].src;
            //图片粘贴
            if (src.includes('data:image')) {
                dataURL = src;
                let blob = dataURItoBlob(dataURL);
                formData.append('file', blob, dateTime + '.png');
            } else if (src.includes('blob:http')) {
                for (let i = 0; i < this.files.length; i++) {
                    formData.append("file", this.files[i], this.files[i].name);
                }
            }
            /*else{
             dataURL=$(value).find('img').attr('src');
             }*/

            // console.info(dataURL)
            this.uploadFileService.uploadPic(formData).then(result => {
                //上传成功
                let xhr = result.xhr;
                let fileData = JSON.parse(xhr.responseText);
                let fileId = fileData[0]['id'];
                this.submitMessage('', null, fileId);
            }).catch(err => {
                // console.log('图片上传失败' + err);
            })
        } else {
            // 清除文本尾部回车换行键
            value = value.replace(/(<br\s*\/?>)+$/g,"");
            // value = value.replace(/[\r\n]/g, "");
            value = value.replace(/&nbsp;/ig, "");
            value = value.replace(/<br\s*\/?>/ig,"&lt;br&gt;");

            this.submitMessage(value, taskValue, "");
        }

    }

    /**
     * 提交消息内容
     * @param text
     * @param taskId
     * @param fileId
     */
    submitMessage(text, taskId, fileId) {
        this.api.call('ImmessageController.submitChatContext', {
            "textContext": text,
            "taskId": taskId,
            "fileId": fileId,
            "groupId": this.groupId
        }).ok(msgData => {
            // console.log("submitChatContext .....>>>>>>>");
            // console.log("提交消息成功");
            this.queryChatListRedis();
            this.msgSuccessHandler(msgData);
        }).fail(err => {
            if(err.code == 24){
                this.confirmationService.confirm({
                    message: err.error,
                    header: '提示',
                    accept: () => {}
                });
            }
        });
    }

    /**
     * 消息成功发送回调方法
     * @param msgData
     */
    msgSuccessHandler(msgData) {
        //let messageTmpl = getAnswerMessageTmpl(this.username, dateTime, value, msgType, true);
        //$("#message-body").append(messageTmpl);
        $('#inputText').html('');
    }

    /**
     * 回车键发送信息
     * @param $event
     * @constructor
     */
    EnterMessage(e) {
        if (e.ctrlKey && e.keyCode == 13) { // ENTER_KEY
            this.sendMessage();
        }
    }

    /**
     * 黏贴发送图片
     * @param e
     */
    pasteData(e) {
        // e.preventDefault();
        let clipboardData = e.clipboardData;
        if (clipboardData) { //如果支持这个
            let items = clipboardData.items; //获取黏贴里的对象
            if (!items) {
                return;
            }
            let item;
            let types = clipboardData.types || [];
            for (let i = 0, len = types.length; i < len; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                imgReader(item);
            }
        }
        function imgReader(obj) {
            let file = obj.getAsFile(),
                reader = new FileReader();
            // 读取文件
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                let img = new Image();
                img.src = e.target['result'];
                img.className = 'chatImg';

                $('#inputText').append(img);
                setTimeout(() => {
                    $('#inputText').scrollTop($('#inputText')[0].scrollHeight);
                }, 0)
            };
        }
    }


    EnterOrderNum(e: any) {
        if (e.keyCode == 13 || e.which == 13) { // ENTER_KEY
            e.preventDefault();
            // 匹配用户输入和订单对象的单号是否一致
            this.sendOrder();
        }
    }

    toggleTaskSendPanel(e) {
        // $(".input_box .order_box").show();
        this.showTaskSendPanel = !this.showTaskSendPanel;

    }

    stopPro(e) {
        e.stopPropagation();
    }

    /**
     * 发送订单公共方法
     */
    sendOrder() {
        if (!this.orderNum) {
            //提示信息
            return;
        }
        let orderArr = this.orderNum.split(',');
        for (let order of orderArr) {
            // order = order.replace(/(^\s\n+)|(\s\n+$)/g, "");
            this.sendMessage(order);
            // im窗口用传值
            // this.orderType.emit(this.orderData);
            $('#order_box').hide();
        }
        this.orderNum="";
        this.showTaskSendPanel = false;
    }

    /**
     * 订单信息点击弹出详情
     * @param e
     */
    @HostListener('click', ['$event']) onClick(e: any) {
        let recordId, orderType;
        for (let el = e.target; el !== e.currentTarget; el = el.parentElement) {
            if (el && el.id == "task_id_a") {
                recordId = el.dataset["orid"];
                orderType = el.dataset["ortype"];
                // 关闭历史列表
                this.hisToggle = false;
                if (orderType == "dispatchTask") {
                    //新任务
                    this.api.call('TaskInstallController.findAppTaskDetail', {"taskId": recordId})
                        .ok(data => {
                            this.orderData.taskDetails = data.result;
                            this.orderData.orderType = 1;
                            this.orderData.orderId = recordId;
                            if(this.orderData.taskDetails.waybillServiceType=="install"){
                                this.orderData.taskDetails.waybillServiceType="安装";
                            }else if(this.orderData.taskDetails.waybillServiceType=="DedicatedDelivery"){
                                this.orderData.taskDetails.waybillServiceType="专线送货";
                            }else if(this.orderData.taskDetails.waybillServiceType=="pickUP"){
                                this.orderData.taskDetails.waybillServiceType="自提";
                            }else if(this.orderData.taskDetails.waybillServiceType=="CityDistributionInstallation"){
                                this.orderData.taskDetails.waybillServiceType="同城配送并安装";
                            }else if(this.orderData.taskDetails.waybillServiceType=="DistributionHome"){
                                this.orderData.taskDetails.waybillServiceType="配送到家";
                            }else if(this.orderData.taskDetails.waybillServiceType=="DistributionDownstairs"){
                                this.orderData.taskDetails.waybillServiceType="配送到楼下";
                            }else if(this.orderData.taskDetails.waybillServiceType=="CityDistribution"){
                                this.orderData.taskDetails.waybillServiceType="同城配送";
                            }else if(this.orderData.taskDetails.waybillServiceType=="DistributionInstallation"){
                                this.orderData.taskDetails.waybillServiceType="配送到家并安装";
                            }
                            if (data.result.goods) {
                                this.orderData.goods = "";
                                for (var i = 0; i < data.result.goods.length; i++) {
                                    this.orderData.goods = this.orderData.goods + data.result.goods[i].goods + ";";
                                }
                            }
                            this.receiveOrderType(this.orderData);
                            this.orderType.emit(this.orderData);
                        })
                        .fail(data => {
                            // console.log(data);
                        });
                } else if (orderType == "fhreturn") {
                    //返货
                    this.api.call('AftermarketTaskController.getReturnTaskInfo', {"taskId": recordId})
                        .ok(data => {
                            this.orderData.taskDetails = data.result;
                            this.orderData.orderType = 2;
                            if (data.result.taskReturnDetails) {
                                this.orderData.goods = "";
                                for (var i = 0; i < data.result.taskReturnDetails.length; i++) {
                                    this.orderData.goods = this.orderData.goods + data.result.taskReturnDetails[i].productName + ";";
                                }
                            }
                            if (this.orderData.taskDetails.taskStatus == "waitDistribution") {
                                this.orderData.taskDetails.taskStatus = "待分配";
                            } else if (this.orderData.taskDetails.taskStatus == "distributionWaitAccept") {
                                this.orderData.taskDetails.taskStatus = "已分配";
                            } else if (this.orderData.taskDetails.taskStatus == "accepted") {
                                this.orderData.taskDetails.taskStatus = "已受理";
                            } else if (this.orderData.taskDetails.taskStatus == "waitAppointment") {
                                this.orderData.taskDetails.taskStatus = "已预约";
                            }else if (this.orderData.taskDetails.taskStatus == "waitPickUp") {
                                this.orderData.taskDetails.taskStatus = "已提货";
                            } else if (this.orderData.taskDetails.taskStatus == "doSign") {
                                this.orderData.taskDetails.taskStatus = "返货完成";
                            } else if (this.orderData.taskDetails.taskStatus == "invalid") {
                                this.orderData.taskDetails.taskStatus = "已作废";
                            }
                            this.receiveOrderType(this.orderData);
                            this.orderType.emit(this.orderData);
                        })
                        .fail(data => {
                            // console.log(data);
                        });
                } else if (orderType == "repair") {
                    //维修
                    this.api.call('AftermarketTaskController.getRepairTaskInfo', {"taskId": recordId})
                        .ok(data => {
                            this.orderData.taskDetails = data.result;
                            this.orderData.orderType = 3;
                            if (this.orderData.taskDetails.taskStatus == "waitDistribution") {
                                this.orderData.taskDetails.taskStatus = "待分配";
                            } else if (this.orderData.taskDetails.taskStatus == "distributionWaitAccept") {
                                this.orderData.taskDetails.taskStatus = "已分配";
                            }else if (this.orderData.taskDetails.taskStatus == "waitAppointment") {
                                this.orderData.taskDetails.taskStatus = "已预约";
                            }else if (this.orderData.taskDetails.taskStatus == "waitPickUp") {
                                this.orderData.taskDetails.taskStatus = "已提货";
                            } else if (this.orderData.taskDetails.taskStatus == "accepted") {
                                this.orderData.taskDetails.taskStatus = "已受理";
                            } else if (this.orderData.taskDetails.taskStatus == "doSign") {
                                this.orderData.taskDetails.taskStatus = "维修完成";
                            } else if (this.orderData.taskDetails.taskStatus == "invalid") {
                                this.orderData.taskDetails.taskStatus = "已作废";
                            }
                            this.receiveOrderType(this.orderData);
                            this.orderType.emit(this.orderData);
                        })
                        .fail(data => {
                            // console.log(data);
                        });
                }
            } else if (el && el.id == "clean_bg") { //容错
                return;
            } else if (!el){
                return;
            }

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
     * 置顶
     */
    zhiding(e) {
        //请求置顶回话接口
        if (this.groupId) {
            this.api.call('ImipsController.ipsScopeTop', {"groupId": this.groupId})
                .ok(data => {
                  /*  console.log(data.result);
                    this.isChecked = data.result.topStatus;*/
                })
                .fail(data => {
                    // console.log(data);
                });
        } else {
            if(!this.noAlert){
                alert("群组id不存在");
            }
        }
    }

    /*
     * 关闭对话框
     * */
    closeChat() {
        this.isJoinInHide.emit(false);
        clearInterval(this.dialogTimer);
    }

    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }
    @Input() noAlert:boolean=false;
    /**
     * 退出群聊
     * */
    ipsQuitGroup() {
        //请求退出群聊接口
        if (this.groupId) {
            this.api.call('ImipsController.ipsQuitGroup', {"groupId": this.groupId})
                .ok(data => {
                    this.ipsIMGroupUser();
                   this.closeChat();
                })
                .fail(data => {
                    alert(data.error);
                });
        } else {
            if(!this.noAlert){
                alert("群组id不存在");
            }
        }
    }

    // 添加同事
    addTeamer(index: number) {

        this.vIpsIMInvitation.imGroupId = this.groupId || '';
        this.vIpsIMInvitation.userId = this.teamerData[index].userId || '';
        this.api.call('imipsController.ipsIMInvitation', this.vIpsIMInvitation)
            .ok(data => {
                this.memberData.push(this.teamerData[index]);
                this.isShowGroupBg = false;
                this.queryGroupTitleInfo();
            })
            .fail(data => {
                if (data.error) {
                    if(!this.noAlert){
                        this.confirmationService.confirm({
                            message: data.error,
                            header: '提示',
                            accept: () => {}
                        });
                    }
                } else {
                    // console.log("请联系管理员！");
                }
            });
    }

    /**
     * 查询同事列表
     */
    ipsIMInviteColleague(first: number) {
        this.api.call('imipsController.ipsIMInviteColleague', {"first": first, "rows": 10}, {})
            .ok(data => {
                var result = data.result || {};
                var content = result.content || [];
                this.teamerData = content;

                this.teamTotalPages = result.totalPages;
                this.teamCurPage = result.number;
                this.teamPageSize = result.size;

                // console.log("同事列表：");
                // console.log(this.teamerData);
            })
            .fail(data => {
                console.log(data);
            });
    }

    /*查询群组存在的成员*/
    ipsIMGroupUser() {
        console.log("+++++++++++++++++++++++++++++群组信息+++++++++++++++++++++++++++++++");
        console.log(this.imGroupData);
        console.log("+++++++++++++++++++++++++++++群组信息+++++++++++++++++++++++++++++++");
        this.vIpsIMInviteColleague.groupId = this.groupId || '';
        this.api.call('imipsController.ipsIMGroupUser', {"first": 0, "rows": 1000}, this.vIpsIMInviteColleague)
            .ok(data => {
                var result = data.result || {};
                this.memberData = result;
            })
            .fail(data => {
                if (data.error) {
                    if(!this.noAlert){
                        alert("群组id不存在");
                    }
                } else {
                    alert("请联系管理员！");
                }
            });
    }


    /**
     * 历史记录翻页
     */
    top() {
        if (this.totalPages<=1) {
            return;
        } else {
            this.queryHistory(this.historyDate,"",(this.totalPages-1)*this.pageSize);
        }
    }

    shangye() {
        if ((this.curPage+1) >= this.totalPages || this.curPage == 0) {
            return;
        } else {
            this.queryHistory(this.historyDate,"",(this.curPage+1)*this.pageSize);
        }
    }

    xiaye() {
        if (this.curPage<=0) {
            return;
        } else {
            this.queryHistory(this.historyDate,"",(this.curPage-1)*this.pageSize);
        }
    }

    end() {
        if (this.curPage <= 0) {
            return;
        } else {
            this.queryHistory(this.historyDate,"",0);
        }
    }

    /**
     * 选择同事翻页
     */
    team_top() {
        if (this.teamCurPage<=0) {
            return;
        } else {
            // this.queryHistory(this.historyDate,"",(this.teamTotalPages-1)*this.pageSize);
            this.ipsIMInviteColleague(0);
        }
    }

    team_shangye() {
        if (this.teamCurPage<=0) {
            return;
        } else {
            // this.queryHistory(this.historyDate,"",(this.curPage+1)*this.pageSize);
            this.ipsIMInviteColleague( (this.teamCurPage-1)*this.teamPageSize );
        }
    }

    team_xiaye() {
        if ( (this.teamCurPage+1) >= this.teamTotalPages ) {
            return;
        } else {
            // this.queryHistory(this.historyDate,"",(this.curPage-1)*this.pageSize);
            this.ipsIMInviteColleague((this.teamCurPage+1)*this.teamPageSize);
        }
    }

    team_end() {
        if ((this.teamCurPage+1) >= this.teamTotalPages) {
            return;
        } else {
            // this.queryHistory(this.historyDate,"",0);
            this.ipsIMInviteColleague( (this.teamTotalPages-1)*this.teamPageSize );
        }
    }

    /**
     * 更改标题
     * @param event
     * @param groupId
     */
    edit(event:any){
        if(!this.groupTitleInfo.groupPic){
            console.log(this.groupTitleInfo.groupPic, 'this.groupTitleInfo.groupPic');
            let that = this;
            let oldhtml = event.target.innerHTML.replace(/(<[^>]+>)/g, "");
            oldhtml = oldhtml.replace(/(^\s+)|(\s+$)/g, "");
            let newobj = document.createElement('input');
            newobj.type = 'text';
            newobj.value = oldhtml;

            event.target.innerHTML = '';
            event.target.appendChild(newobj);

            newobj.focus();
            //设置newobj失去焦点的事件
            let thisApi = this.api;
            newobj.onblur = function(){
                if(newobj.value != ''){
                    //修改会话名
                    thisApi.call('ImipsController.updateScopeTitle', { "groupId": that.groupId, "newTitle": newobj.value})
                        .ok(data => {
                            that.msgs.push({severity:'success', summary:'保存成功', detail:'名字已更改'});
                            event.target.innerHTML = newobj.value;
                        })
                        .fail(data => {
                            let err = data || [];
                            if( err.error ){
                                that.msgs.push({severity:'error', summary:'输入错误', detail:'修改失败'});
                                event.target.innerHTML = oldhtml;
                            }else{
                                that.msgs.push({severity:'error', summary:'输入错误', detail:'修改失败'});
                                event.target.innerHTML = oldhtml;
                            }
                        });
                } else {
                    that.msgs.push({severity:'warn',summary:'输入有误', detail:'名字不能为空'});
                    event.target.innerHTML = oldhtml;
                }
            }
        } else {
            return ;
        }

    }





}

@NgModule({
    imports: [CommonModule, FormsModule, CalendarModule, ConfirmDialogModule, GrowlModule],
    exports: [DialigBoxComponent],
    declarations: [DialigBoxComponent]
})
export class DialigBoxModule {
}
