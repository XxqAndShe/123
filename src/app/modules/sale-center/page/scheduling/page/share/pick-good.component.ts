import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../../../share/app-service/show-or-hide-mask.service';
import {DragBoxService} from '../../../../../../share/app-service/drag-box.service';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector: 'pick-good',
    templateUrl: './pick-good.component.html',
    styleUrls: [
        './pick-good.component.css'
    ]
})

export class PickGoodComponent implements OnInit {
    @Input() content;

    constructor(public api: API,
                public mask: ShowOrHideMaskService,
                public drag: DragBoxService,
                public requestTokenService: RequestTokenService
    ) {
    }

    ngOnInit() {
        let depositArea01 = document.getElementById('deposit_apply_title01');
        let depositBox01 = document.getElementById('deposit_apply01');
        this.drag.dragEle(depositArea01, depositBox01);
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);
        this.requestTokenService.createToken();
    }

    @Output() hideWin = new EventEmitter<boolean>();

    @Output() refrePickGood = new EventEmitter<boolean>();//保存
    msgs:any;
    showError(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
    hideWindow() {
        this.hideWin.emit(false);
    }

    msgHint:string = "成功";

    showSuccess(success?:any, dialog?:any) {
        this.api.call("AftermarketTaskController.picUpGoods", {
            taskId: this.content.id,
            masterName: this.content.vRepairTaskName
        }).ok(json => {
            this.refrePickGood.emit();
        }).fail((err) => {
           this.showError("error","提示",err.error);
        });
    }
}
