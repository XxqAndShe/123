import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {  ShowOrHideMaskService } from '../../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../../share/app-service/drag-box.service';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector: 'accept',
    templateUrl: './accept.component.html',
    styleUrls: [
        './accept.component.css'
    ]
})

export class AcceptComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService,public drag:DragBoxService,public api:API,public requestTokenService: RequestTokenService){}
    ngOnInit() {
        let depositArea01 = document.getElementById('deposit_apply_title01');
        let depositBox01= document.getElementById('deposit_apply01');
        this.drag.dragEle(depositArea01, depositBox01);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
        this.requestTokenService.createToken();
    }
    @Output() hideWin=new EventEmitter<boolean>();//取消
    @Output() hideSave=new EventEmitter<boolean>();//保存
    msgs:any;
    showError(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    hideWindow(){
        this.hideWin.emit(false);
    }
    showSuccess(){
        this.api.call("AftermarketTaskController.acceptance", {taskId:this.content.id}).ok(json => {
            this.hideSave.emit();
        }).fail((err) => {
            this.showError("error","提示",err.error);
        });
    }

    @Input() content: any;
}
