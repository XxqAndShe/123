/**
 * Created by hua on 2017-02-27.
 */
import {Component,OnInit,Output,EventEmitter} from "@angular/core";
import {  ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';
@Component({
    selector:"role-del",
    templateUrl:"./role-del.component.html",
    styleUrls:["./role-del.component.css"]
})
export class RoleDelComponent implements OnInit {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {
    }

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title05');
        let DialogBox = document.getElementById('dialog_box05');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);
    }

    @Output() isshow = new EventEmitter<boolean>();
    hideWin(win){
        win.style.display="none";
        this.mask.hide();
        this.isshow.emit(false);//暴露值给父组件
    }

}
