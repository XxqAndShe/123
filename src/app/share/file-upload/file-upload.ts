import { Component, forwardRef, OnInit, Input, Output, EventEmitter, AfterViewInit, Renderer, OnDestroy } from "@angular/core";
import {ShowOrHideMaskService} from "../app-service/show-or-hide-mask.service";

@Component({
    templateUrl: "./file-upload.html",
    styleUrls: ["./file-upload.css"],
    selector: "file-upload",
})
export class FileUpLoadComponent implements OnInit {
    @Output() fileData = new EventEmitter();
    msgs: any[];

    files: any;
    constructor(public mask: ShowOrHideMaskService, ) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {

    }

    onFileSelect(event) {
        this.files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    }

    fileUpload(url: string) {
        let progress = 0;

        let xhr = new XMLHttpRequest(),
            formData = new FormData();

        formData.append('file', this.files[0], this.files[0].name);

        xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
            if (e.lengthComputable) {
                progress = Math.round((e.loaded * 100) / e.total);
            }
        }, false);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                progress = 0;

                if (xhr.status >= 200 && xhr.status < 300) {
                    //上传成功
                    this.showSuccess("success", "提示", "上传成功");
                    this.success(xhr.responseText);
                } else {
                    let jsonErr = JSON.parse(xhr.response) || {};
                    //上传失败
                    if (jsonErr['error']) {
                        this.showSuccess("error", "提示", jsonErr['error']);
                        this.success('error');
                    } else {
                        this.showSuccess("error", "提示","上传失败");
                        this.success('error');
                    }
                }
            }
        };

        xhr.open('POST', url, true);

        //xhr.withCredentials = this.withCredentials;

        xhr.send(formData);
    }

    success(e) {
        this.fileData.emit(e);
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}
