
/*tslint:disable*/
import { Component, forwardRef, OnInit, Input, Output, EventEmitter, AfterViewInit, Renderer, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AppConfig } from "../../../app.config";


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UIUpload),
    multi: true
};

@Component({
    templateUrl: "./upload.html",
    styleUrls: ["./upload.css"],
    selector: "ui-upload",
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class UIUpload implements OnInit, AfterViewInit, ControlValueAccessor {

    @Input()
    multiple: string = "multiple";
    /**
     * 最大上传数量
     * @type {number}
     */
    @Input() fileMaxNum: number = 20;

    @Input() type: string = "";

    /**
     * 可赋值回显
     * @type {Array}
     */
    @Input()
    files: any[] = [];

    @Output()
    fileChange: EventEmitter<any> = new EventEmitter();

    uploadedFiles: any[] = [];


    previewWidth: number = 50;

    selectFiles: any[] = [];

    public url: string;
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public innerValue: string[];

    public file: any;

    constructor(public appConfig: AppConfig) {
    }

    ngOnInit(): void {
        this.url = this.appConfig.baseUrl + "/upload";
        //如果有值，先回显展示
        if (this.files.length) {
            if (!this.value) {
                this.value = [];
            }
            for (let f of this.files) {
                this.value.push(f.id)
            }
        }
    }

    ngAfterViewInit(): void {
        //console.log('ngAfterViewInit');
        this.initFancybox();
    }

    onBeforeSend(event) {
        let xhr = event.xhr;
        let jwt = localStorage["jwt"];
        if (jwt) {
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);
        }
    }

    onUpload(event) {

        if (this.multiple === 'single') {
            this.uploadedFiles=event.files;
        } else {
            for (let file of event.files) {
                this.uploadedFiles.push(file);
            }
        }

        let xhr = event.xhr;
        let data = JSON.parse(xhr.responseText);
        if (!this.value) {
            this.value = [];
        }
        if (this.multiple === 'single') {
            this.files = [];
        }
        data.forEach(file => {
            this.value.push(file.id);
            this.files.push(file);
            this.fileChange.emit(this.files);
        });
    }

    onSelect($event) {
        this.selectFiles = $event.files;
    }

    /**
     * 删除选择的文件
     * @param index
     */
    remove(index: number) {
        ////console.log(this.selectFiles.length)
        this.selectFiles.splice(index, 1);
    }

    // 写入值
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    // 注册变化处理事件
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // 注册触摸事件
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // 获取属性
    get value(): any {
        return this.innerValue;
    };

    // 设置属性，并触发监听器
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    deleteFile(file) {
        if (this.files) {
            this.files.forEach((f, i) => {
                if (f == file) {
                    this.files = this.files.slice(0, i).concat(this.files.slice(i + 1));
                    return false;
                }
            });
        }
        if (this.value) {
            this.value.forEach((id, i) => {
                if (id == file.id) {
                    this.value = this.value.slice(0, i).concat(this.value.slice(i + 1));
                    return false;
                }
            });
        }

    }

    /**
     * 判断一个url地址是否为图片
     * @param file
     */
    isPicture(file) {
        let imageFormat = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
        let imgUrl = file && file.url || '';
        imgUrl = imgUrl.toLowerCase();
        return imageFormat.some(ft => {
            return imgUrl.endsWith(ft);
        });
    }

    /**
     * 判断File对象是否为图片
     * @param file
     * @returns {boolean}
     */
    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    formatSize(bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        let k = 1000,
            dm = 3,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    showBig(event, op, file) {
        this.file = file;
        op.toggle(event);
    }

    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }
}
