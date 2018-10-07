import { Component, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';

@Component({
    selector: 'search',
    templateUrl: 'search.component.html',
    styleUrls: [
        'search.component.css'
    ]
})

export class SearchComponent {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {}

    @Output() hideModal = new EventEmitter<boolean>();

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title_search');
        let DialogBox = document.getElementById('dialog_box_search');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);
    }
    dealHide(obj){
        obj.style.display="none";
        this.mask.hide();
        this.hideModal.emit(false);//暴露值给父组件
    }
}