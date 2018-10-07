import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {Message} from "primeng/primeng";
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "app/share/app-service/drag-box.service";

@Component({
  selector: 'service-rename',
  templateUrl: './service-rename.component.html',
  styleUrls: ['./service-rename.component.css']
})
export class ServiceRenameComponent implements OnInit {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() selectionRow;

    loading: boolean = false;
    msgs: Message[] = [];
    selectData;

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
        this.selectData = _.clone(this.selectionRow[0]);
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
        if(!this.selectData.name){
            return this.showSuccess("warn", "提示", "文件名称，不能为空!");
        }
        this.api.call("documentController.renameDocument",{
            name:this.selectData.name,
            id:this.selectData.id
        }).ok(json =>{
            this.success.emit();
        }).fail(err =>{
            this.showSuccess("error", "提示", err.error);
        })
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}
