import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {API} from "app/share/lib/api/api";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import { dataToTree, getNodeById } from "app/share/utils/dataToTree";
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {ServiceAddVo} from "../vo/service-add.vo";

@Component({
    selector: 'add-folder',
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent implements OnInit {

    @Output() closeWin = new EventEmitter();
    @Output() success = new EventEmitter();
    @Input() selectedData; //选择文件目录
    @Input() selectedCategory: any; //选择文件目录对象
    serviceAddVo: ServiceAddVo = new ServiceAddVo();

    loading: boolean = false;
    fileList: any[] = [];
    msgs: any[];
    categories: any;
    selectedFile: any;

    constructor(public drag: DragBoxService, public mask: ShowOrHideMaskService, public api: API) {
    }

    ngOnInit() {
        this.mask.show();
        // if (this.selectedData) {
        //     this.serviceAddVo.parent = this.selectedData.id;
        //     this.serviceAddVo.level = this.selectedData.level + 1;
        // }
        this.findCategories();
    }

    ngOnDestroy(): void {
        this.mask.hide();
    }

    /**
     * 目录数据
     */
    findCategories() {
        this.api.call('categoryController.findCategories', {}).ok(json => {
            let result = json.result;
            result.forEach(item => {
                item.expanded = true;
            });
            result.unshift({
                parent: "-1",
                level: -1,
                id: "",
                name: "所有文件"
            });

            this.categories = dataToTree(result);
            if (this.selectedCategory) {
                this.selectedFile = getNodeById(this.categories,this.selectedCategory);
            }
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        })
    }

    /**
     * 选中文件夹
     */
    nodeSelect(event) {
        this.selectedFile = event.node;
        let target = event.originalEvent['currentTarget'];
        $('span.ui-treenode-label').removeClass('ui-state-highlight');
        $(target).find('span.ui-treenode-label').addClass('ui-state-highlight');
    }

    nodeUnselect($event) {
        this.selectedFile = null;
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
        this.serviceAddVo.parent = this.selectedFile.id;
        this.serviceAddVo.level = this.selectedFile.level + 1;
        this.api.call('categoryController.saveCategories', this.serviceAddVo).ok(json => {
            this.success.emit();
        }).fail(err => {
            this.showSuccess("error", "提示", err.error);
        });

    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

}
