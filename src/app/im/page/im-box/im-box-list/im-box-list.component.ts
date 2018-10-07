import {
    Component, Output, EventEmitter, Input, OnInit, HostListener, ElementRef, NgModule
} from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { API } from "../../../../share/lib/api/api";
@Component({
    selector: 'im-box-list',
    templateUrl: './im-box-list.component.html',
    styleUrls: ['./im-box-list.component.css']
})
export class ImBoxListComponent implements OnInit {

    @Input() Data: any;
    // 接收是那种会话接触
    @Input() hasEntryKey: boolean;
    @Input() hasMasterEntryKey: boolean;
    @Input() hasSessionKey: boolean;
    @Output() isJoinIn = new EventEmitter<any>();
    @Output() isMasterJoinIn = new EventEmitter<any>();
    @Output() isSessionJoinIn = new EventEmitter<any>();
    //向上传递删除数据
    @Output() afterDelChatData = new EventEmitter<any>();
    //清除定时器标志
    @Output() clrtimer = new EventEmitter<boolean>();

    @Input() sname: string;
    //修改标题信息
    @Output() saveTitle = new EventEmitter<any>();
    //接入失败信息
    @Output() failIn = new EventEmitter<any>();

    // ImstyleName: string = this.IMstyle;
    constructor(public el: ElementRef,
                public api: API) {

    }

    ngOnInit() {

    }

    /*根据类型更换属性*/
    getClass(type) {
        switch (type) {
            case 'dispatchTask':
                return 'xin';
            case 'repair':
                return 'wei';
            case 'fhreturn':
                return 'fan';
            default:
                return 'xin';
        }
    }

    /*
     * 删除对话列表
     * */
    delOneList(i: number) {
        this.Data.splice(i, 1);
        this.afterDelChatData.emit(this.Data[i]);
    }
    //接入列表接入接口
    joinIn(i: number) {
        //请求接入接口
        this.api.call('ImipsController.ipsIMAccess', { "imGroupId": this.Data[i].groupId })
            .ok(data => {
                this.isJoinIn.emit(this.Data[i]);
                //接入后删除对应的接入内容
                this.Data.splice(i, 1);
                this.afterDelChatData.emit(this.Data[i]);
                // console.log("接入列表接入成功")
            })
            .fail(data => {
                this.failIn.emit('failIn');
            });

        // this.List.emit(this.list);
    }

    /*会话进入*/
    sessionJoinIn(i: number) {
        // console.info(this.Data[i], 'im-box-list');
        this.isSessionJoinIn.emit(this.Data[i]);
        this.clrtimer.emit(true);
    }

    /*师傅列表创建群聊接口*/
    masterJoinIn(i: number) {
        this.api.call('ImipsController.imIpsCreateGroup', { "workerId": this.Data[i].workerId })
            .ok(data => {
                // console.log(data.result);
                this.Data[i].groupId = data.result.groupId;
                this.isMasterJoinIn.emit(this.Data[i]);
                // console.log("师傅群聊接入成功");
            })
            .fail(data => {
                // console.log(data);
            });
    }


    /**
     * 更改标题
     * @param event
     * @param groupId
     */
    edit(event:any, groupId:any, index: any){
        if(this.Data[index].taskType == '图片' && this.hasSessionKey){
            // console.log(this.Data[index].taskType, 'this.Data[index].taskType');
            this.clrtimer.emit(false);
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
            var thisApi = this.api;
            newobj.onblur = function(){
                that.clrtimer.emit(true);
                if(newobj.value != ''){

                    //修改会话名
                    thisApi.call('ImipsController.updateScopeTitle', { "groupId": groupId, "newTitle": newobj.value})
                        .ok(data => {
                            that.saveTitle.emit('success');
                            event.target.innerHTML = newobj.value;
                        })
                        .fail(data => {
                            var err = data || [];
                            if( err.error ){
                                that.saveTitle.emit('error');
                                event.target.innerHTML = oldhtml;
                            }else{
                                that.saveTitle.emit('error');
                                event.target.innerHTML = oldhtml;
                            }
                        });
                } else {
                    that.saveTitle.emit('warn');
                    event.target.innerHTML = oldhtml;
                }

            };
        } else {
            return ;
        }


    }
    @Output() private imgsrc = new EventEmitter<any>();
    dbOpenChat(index: number, event: any,imgsrc, ...sessionKey: boolean[]){
        this.imgsrc.emit(imgsrc);
        if(event.target.className === 'oder_groupTitle'){
            return;
        }
        if(sessionKey[0]){
            this.sessionJoinIn(index);
        } else if(sessionKey[1]){
            this.masterJoinIn(index);
        }
    }

}

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [ImBoxListComponent],
    declarations: [ImBoxListComponent]
})
export class ImBoxListModule {
}
