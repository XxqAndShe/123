import { Input, OnDestroy } from '@angular/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from "app/share/app-service/show-or-hide-mask.service";

@Component({
    selector: 'common-msg',
    templateUrl: 'common-msg.component.html',
    styleUrls: ['common-msg.component.css']
})
export class CommonMsgComponent implements OnInit, OnDestroy {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();

    @Input() info: string = "是否确定删除数据？";
    @Input() info2: string = "";

    constructor(public mask: ShowOrHideMaskService) {
    }

    ngOnInit() {
        this.mask.show();
    }

    /**
     * 关闭弹窗
     */
    close() {
        this.closeWin.emit();
    }

    /**
     * 保存
     */
    save() {
         this.success.emit();
    }

    ngOnDestroy() {
        this.mask.hide();
    }
}
