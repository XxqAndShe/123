import { Component, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';

@Component({
    selector: 'basic-data',
    templateUrl: 'basic-data.component.html',
    styleUrls: [
        'basic-data.component.css'
    ]
})

export class BasicDataComponent {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {}

    @Output() hideModal = new EventEmitter<boolean>();
    @Output() showDataAuthority = new EventEmitter<boolean>();

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title_check');
        let DialogBox = document.getElementById('dialog_box_check');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);
    }
    dealHide(obj){
        obj.style.display="none";
        this.mask.hide();
        this.hideModal.emit(false);//暴露值给父组件
    }

    showModal(obj) {
        obj.style.display="none";
        this.showDataAuthority.emit(true);
    }
}