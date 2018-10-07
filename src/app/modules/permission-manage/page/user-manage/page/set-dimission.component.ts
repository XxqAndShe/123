import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';

@Component({
    selector: 'set-dimission',
    templateUrl: 'set-dimission.component.html',
    styleUrls: [
        'set-dimission.component.css'
    ]
})

export class SetDimissionComponent {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {}

    @Input() simpleDialogText: string;
    @Output() hideModal = new EventEmitter<boolean>();

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title_dimission');
        let DialogBox = document.getElementById('dialog_box_dimission');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);
    }
    dealHide(obj){
        obj.style.display="none";
        this.mask.hide();
        this.hideModal.emit(false);//暴露值给父组件
    }
}