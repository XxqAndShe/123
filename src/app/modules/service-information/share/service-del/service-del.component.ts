import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "app/share/app-service/drag-box.service";

@Component({
    selector: 'service-del',
    templateUrl: './service-del.component.html',
    styleUrls: ['./service-del.component.css']
})
export class ServiceDelComponent implements OnInit {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();

    public loading: boolean = false;

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
    }

    ngOnDestroy(): void {
        this.mask.hide();
    }

    /**
     * 关闭弹窗
     */
    close() {
        this.closeWin.emit();
    }

    /**
     * 保存弹窗
     */
    save() {
        this.success.emit();
    }
}
