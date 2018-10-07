import {Component, EventEmitter, Output, OnInit, Input} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../../../share/app-service/show-or-hide-mask.service';
import {DragBoxService} from '../../../../../../share/app-service/drag-box.service';
import {API} from "../../../../../../share/lib/api/api";
import {RequestTokenService} from "../../../../../../share/app-service/request-token.service";
@Component({
    selector: 'verify-distribute',
    templateUrl: './verify-distribute.component.html',
    styleUrls: [
        './verify-distribute.component.css'
    ]
})

export class VerifyDistributeComponent implements OnInit {
    constructor(public mask: ShowOrHideMaskService,
                public drag: DragBoxService,
                public api: API,
                public requestTokenService: RequestTokenService
    ) {
    }

    fee: string; //费用，维修费或者返货费

    ngOnInit() {
        let depositArea = document.getElementById('deposit_apply_title');
        let depositBox = document.getElementById('deposit_apply');
        this.drag.dragEle(depositArea, depositBox);

        //初始化显示费用
        let repairFee = this.content.installFee;
        let returnFee = this.content.picFee;
        if (repairFee) {
            this.fee = repairFee;
        } else {
            this.fee = returnFee;
        }
        this.requestTokenService.createToken();
    }

    @Output() hideWin = new EventEmitter<boolean>();

    hideWindow(dialog: any) {
        this.hideWin.emit(false);
    }

    @Output() refreshTable = new EventEmitter<boolean>();

    //点击确认分配师傅
    affirm() {
        // debugger;
        this.api.call("AftermarketTaskController.affirmTaskMaster", {
            taskId: this.content.id,
            masterName: this.content.vRepairTaskName
        }).ok(json => {
            this.refreshTable.emit();   //刷新页面
        }).fail((err) => {
            this.showError("error","提示",err.error);
        });
    }
    msgs:any;
    showError(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }

    @Input() content: any;
}
