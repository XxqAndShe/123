import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {dataToTree} from "app/share/utils/dataToTree";

@Component({
    selector: 'move-file',
    templateUrl: './move-file.component.html',
    styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() selectionRow;

    loading: boolean = false;
    msgs: any[];
    categories: any[] = [];
    selectedFile: any;
    addFile: boolean = false;
    fileName: string;

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
        this.findCategories()
    }

    /**
     * 目录数据
     */
    findCategories() {
        this.api.call('categoryController.findCategories', {}).ok(json => {
            let result=json.result;
            result.forEach(item=>{
                item.expanded=true;
            });
            this.categories = dataToTree(json.result);
            console.log(this.categories);
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        })
    }

    /**
     *  新增文件夹
     */
    addNewFile() {
        this.addFile = true;
    }

    /**
     *  取消新增文件夹
     */
    closeFile() {
        this.addFile = false;
    }

    /**
     *  保存新增文件夹
     */
    saveFile() {
        if (!this.fileName) {
            return this.showSuccess("warn", "提示", "文件夹名称，不能为空!");
        }
        this.api.call("categoryController.saveCategories", {
            name: this.fileName,
            level: 0
        }).ok(json => {
            this.findCategories();
            this.showSuccess("success", "提示", "文件夹，添加成功!");
            this.addFile = false;
        }).fail(err => {
            this.showSuccess("error", "提示", err.error)
        });


    }
    /**
     * 选中文件夹
     */
    nodeSelect(event) {
        this.selectedFile = event;
        let target=event.originalEvent['currentTarget'];
        $('span.ui-treenode-label').removeClass('ui-state-highlight');
        $(target).find('span.ui-treenode-label').addClass('ui-state-highlight');
    }

    nodeUnselect($event) {
        this.selectedFile = $event;
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
        this.api.call("documentController.removeDocument", {
            categoryId: this.selectedFile.node.id,
            id: this.selectionRow[0].id
        }).ok(json => {
            this.success.emit();
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        })


    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }


}
