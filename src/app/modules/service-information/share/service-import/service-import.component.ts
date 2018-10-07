import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {FileUpLoadComponent} from "app/share/file-upload/file-upload";

@Component({
  selector: 'service-import',
  templateUrl: './service-import.component.html',
  styleUrls: ['./service-import.component.css']
})
export class ServiceImportComponent implements OnInit {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();

    public loading: boolean = false;
    ajax: any;
    //注入子组件
    @ViewChild(FileUpLoadComponent)
    private fileUpLoad: FileUpLoadComponent;

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
        let url = window['baseUrl'] + '/documentController/importDocument4Excel?mobile='+localStorage.getItem('mobile');
            //发送请求
            this.loading = true;
            this.ajax = this.fileUpLoad.fileUpload(url);
    }
    /**
     * 上传的数据
     * @param e
     */
    getFileData(e: any) {
        if(e === 'error'){
            this.loading = false;
            return;
        }
        let result = JSON.parse(e);
        if (result.code) {
            this.loading = false;
            setTimeout(() => {
                this.success.emit();
            }, 1200);
        }
    }
}
