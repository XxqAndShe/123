import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {Message} from "primeng/primeng";
import {ServiceInformationVo} from "../../vo/service-information.vo";


@Component({
    selector: 'service-add',
    templateUrl: './service-add.component.html',
    styleUrls: ['./service-add.component.css']
})
export class ServiceAddComponent implements OnInit {
    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() fileType: any; //用来判断是什么文件类型
    @Input() addOrChange: any; //用来判断是否是编辑
    @Input() categories;//所属文件夹id
    @Input() selectionRow;//修改文档内容

    serviceInformationVo: ServiceInformationVo = new ServiceInformationVo();

    loading: boolean = false;
    fileList: any[] = [];
    msgs: Message[] = [];
    titleName: string = "新增";
    text: string;
    fileName: string = "文件内容";
    editorHeight: string = '100px';
    hintText: string = "最多只能输入5000个字符";
    hint:boolean=false;

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        // 设置高度
        let contentHeight = window.innerHeight - 50 + 'px';
        $("#content").css({"max-height": contentHeight});

        this.editorHeight = window.innerHeight - 320 + 'px';

        if (this.addOrChange) {
            this.titleName = "编辑";
            this.serviceInformationVo = _.clone(this.selectionRow[0]);
            console.log(this.serviceInformationVo);
            if(this.serviceInformationVo.pdf === "纯文本"){
                this.serviceInformationVo.pdf = "HTML";
            }else if(this.serviceInformationVo.pdf === "附件"){
                this.serviceInformationVo.pdf = "PDF";
            }
            this.serviceInformationVo.categories = this.serviceInformationVo.categoryId;
        } else {
            this.serviceInformationVo.categories = this.categories;
            this.serviceInformationVo.pdf = "HTML";
        }
    }

    ngOnDestroy(): void {
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
        if (!this.serviceInformationVo.name) {
            return this.showSuccess("warn", "提示", "请输入文件名称");
        }
        if (!this.serviceInformationVo.text) {
            return this.showSuccess("warn", "提示", "请输入文件内容或文件介绍");
        }
        if (this.serviceInformationVo.pdf === "PDF" && !this.addOrChange) {
            if (this.fileList.length === 0) {
                return this.showSuccess("warn", "提示", "请上传文件");
            }
            this.serviceInformationVo.url = this.fileList;
        }
        //编辑修改PDF
        if (this.fileList[0]) {
            this.serviceInformationVo.url = this.fileList
        } else {
            this.serviceInformationVo.url = this.serviceInformationVo.fileId;
        }
        this.api.call('documentController.saveDocument', this.serviceInformationVo).ok(json => {
            this.success.emit();
        }).fail(err => {
            this.showSuccess("error", "提示", "请联系管理员");
            this.success.emit();
        });
    }

    onTextChange($event) {
        if (this.serviceInformationVo.pdf === "PDF") {
            if ($event.textValue.length <= 300) {
                this.hint = false;
                return;
            }
            if ($event.textValue.length > 300) {
                this.hint = true;
                let text;
                text = $event.textValue.substr(0, 299);
                setTimeout(() => {
                    this.serviceInformationVo.text = text;
                }, 100);
            }
        } else {
            if ($event.textValue.length <= 5000) {
                this.hint = false;
                return;
            }
            if ($event.textValue.length > 5000) {
                this.hint = true;
                let text;
                text = $event.textValue.substr(0, 4999);
                setTimeout(() => {
                    this.serviceInformationVo.text = text;
                }, 100);

            }
        }
    }

    onChange() {
        if (this.serviceInformationVo.pdf === "PDF") {
            this.hintText = "最多只能输入300个字符";
            this.fileName = "文件介绍";
        } else {
            this.hintText = "最多只能输入5000个字符";
            this.fileName = "文件内容";
        }
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}
