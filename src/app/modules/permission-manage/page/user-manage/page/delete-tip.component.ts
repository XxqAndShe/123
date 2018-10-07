import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';

@Component({
    selector: 'delete-tip',
    templateUrl: 'delete-tip.component.html',
    styleUrls: [
        'delete-tip.component.css'
    ]
})

export class DeleteTipComponent {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {}

    @Input() complexDialogText;
    @Output() hideModal = new EventEmitter<boolean>();

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title_delete');
        let DialogBox = document.getElementById('dialog_box_delete');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);

        ////console.log(this.complexDialogText)
    }
    dealHide(obj){
        obj.style.display="none";
        this.mask.hide();
        this.hideModal.emit(false);//暴露值给父组件
    }
}