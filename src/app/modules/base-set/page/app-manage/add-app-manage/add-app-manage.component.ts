import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { AddAppManageVo } from "../vo/add-app-manage";
import { Message } from "primeng/primeng";
import { API } from "app/share/lib/api/api";
import { DragBoxService } from "app/share/app-service/drag-box.service";
import { ShowOrHideMaskService } from "app/share/app-service/show-or-hide-mask.service";

@Component({
    selector: 'add-app-manage',
    templateUrl: './add-app-manage.component.html',
    styleUrls: ['./add-app-manage.component.css']
})
export class AddAppManageComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() record: any = []; //用来判断是否是编辑

    addAppManageVo: AddAppManageVo = new AddAppManageVo();
    loading: boolean;
    fileList: any[] = [];
    msgs: Message[] = [];

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
        if (this.record.length) {
            this.addAppManageVo = _.clone(this.record[0]);
        }
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
        if (this.addAppManageVo.titleName === "") {
            this.showSuccess("warn", "提示", "套餐名称不能为空!");
            return;
        }
        if (this.addAppManageVo.versionNumber === "") {
            this.showSuccess("warn", "提示", "版本号不能为空!");
            return;
        }
        if (this.addAppManageVo.describe === "") {
            this.showSuccess("warn", "提示", "内容不能为空!");
            return;
        }
        if (this.fileList.length <= 0 && !this.record.length) {
            this.showSuccess("warn", "提示", "没有上传文件!");
            return;
        }
        this.loading = true;
        let params = {
            "titleName": this.addAppManageVo.titleName,
            "describe": this.addAppManageVo.describe,
            "versionNumber": this.addAppManageVo.versionNumber
        }
        if (this.record.length) {
            params['id'] = this.addAppManageVo.id;
        } else {
            params["fileInfos"] = this.fileList
        }
        this.api.call("appUpdateController.appUpateEdit", params
        ).ok(json => {
            this.loading = false;
            this.showSuccess("success", "提示", "操作成功！");
            this.success.emit();
        }).fail(data => {
            this.loading = false;
            this.showSuccess("error", "提示", data.error);
        });
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
}
