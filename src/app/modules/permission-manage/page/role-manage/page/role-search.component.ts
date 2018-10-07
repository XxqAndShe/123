import {Component,OnInit,Output,EventEmitter} from "@angular/core";
import {  ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';
@Component({
    selector:"role-search",
    templateUrl:"./role-search.component.html",
    styleUrls:["./role-search.component.css"]
})
export class RoleSearchComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService,public drag:DragBoxService){}
    ngOnInit(){
        let DialogTitle=document.getElementById('dialog_title04');
        let DialogBox=document.getElementById('dialog_box04');
        this.drag.dragEle(DialogTitle,DialogBox);
        ////console.log(this.drag);
    }
    @Output() isshow = new EventEmitter<boolean>();
    hideWin(win){
        win.style.display="none";
        this.mask.hide();
        this.isshow.emit(false);//暴露值给父组件
    }
}