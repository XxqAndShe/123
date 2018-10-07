import {Component,OnInit,Output,EventEmitter} from "@angular/core";
import {  ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';
@Component({
    selector:"department-modify",
    templateUrl:"./department-modify.component.html",
    styleUrls:["./department-modify.component.css"]
})
export class DepartmentModifyComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService,public drag:DragBoxService){}
    ngOnInit(){
        let DialogTitle=document.getElementById('dialog_title');
        let DialogBox=document.getElementById('dialog_box');
        this.drag.dragEle(DialogTitle,DialogBox);
    }
    @Output() isshow = new EventEmitter<boolean>();
    hideWin(win){
        win.style.display="none";
        this.mask.hide();
        this.isshow.emit(false);//暴露值给父组件
    }
    isPowWin=false;
    showPowSet(){
        this.isPowWin=true;
    }
    //由子组件传值过来
    isshowWin(show:boolean){
        this.isPowWin=show;
    }
}