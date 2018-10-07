import {Component, EventEmitter, OnInit, Output, Input, AfterViewInit} from '@angular/core';
import {Message} from "primeng/primeng";
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {copy} from "app/share/utils/copy";

@Component({
    selector: 'share-service',
    templateUrl: './share-service.component.html',
    styleUrls: ['./share-service.component.css']
})
export class ShareServiceComponent implements OnInit {

    // @Input() record: Object;
    @Input() selectionRow;

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();

    loading: boolean = false;
    fileList: any[] = [];
    msgs: Message[] = [];
    password: boolean = false;
    selectData;
    articleUrl;
    pwd: string;
    pwdBtnText: string = '开启';


    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
        this.selectData = _.clone(this.selectionRow[0]);
        let articleId = this.selectData.id;
        this.articleUrl = location.protocol + '//' + location.host + '/article/' + articleId;
        //加密密码回显
        this.api.call("documentController.isPwdDocument", {
            id: articleId
        }).ok(json => {
            this.pwd = json.result.pwd
            if(this.pwd){
                this.password = true;
                this.pwdBtnText = "关闭";
            }
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        });
    }

    ngAfterViewInit() {
        let options = this.getQrOption(this.articleUrl);
        $('#qrcontent').qrcode(options);
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
        let params = {
            id: this.selectData.id
        }
        if (this.password) {
            params['pwd'] = this.pwd;
        }
        this.loading = true;
        this.api.call("documentController.pwdDocument", params).ok(json => {
            this.loading = false;
            copy(this.articleUrl);
            this.success.emit();
        }).fail(err => {
            this.loading = false;
            this.showSuccess("error", "提示", err.error);
        });


    }

    //开启密码
    startPassWord() {
        this.password = !this.password;
        if (this.password) {
            this.pwdBtnText = "关闭";
        } else {
            this.pwdBtnText = "开启";
        }
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    /**
     * 复制
     * @param
     */
    copyLink($event) {
        copy(this.articleUrl);
        this.showSuccess("success", "提示", "复制成功!");
    }

    /**
     * https://larsjung.de/jquery-qrcode/
     * 二维码选项
     * @params text  二维码生成内容
     */
    getQrOption(text = '无内容'): any {
        return {
            // render method: 'canvas', 'image' or 'div'
            render: 'canvas',

            // version range somewhere in 1 .. 40
            minVersion: 1,
            maxVersion: 40,

            // error correction level: 'L', 'M', 'Q' or 'H'
            ecLevel: 'L',

            // offset in pixel if drawn onto existing canvas
            left: 0,
            top: 0,

            // size in pixel
            size: 200,

            // code color or image element
            fill: '#000',

            // background color or image element, null for transparent background
            background: null,

            // content
            text: text,

            // corner radius relative to module width: 0.0 .. 0.5
            radius: 0,

            // quiet zone in modules
            quiet: 0,

            // modes
            // 0: normal
            // 1: label strip
            // 2: label box
            // 3: image strip
            // 4: image box
            mode: 0,

            mSize: 0.1,
            mPosX: 0.5,
            mPosY: 0.5,

            label: 'no label',
            fontname: 'sans',
            fontcolor: '#000',

            image: null
        }
    }
}
