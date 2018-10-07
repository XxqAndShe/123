/**
 * Created by hua on 2017-02-27.
 */
import {Component,OnInit,Output,EventEmitter} from "@angular/core";
import {  ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';
@Component({
    selector:"power-setting",
    templateUrl:"./power-setting.component.html",
    styleUrls:["./power-setting.component.css"]
})
export class PowerSettingComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService,public drag:DragBoxService){}
    ngOnInit(){
        let DialogTitle=document.getElementById('dialog_title02');
        let DialogBox=document.getElementById('dialog_box02');
        this.drag.dragEle(DialogTitle,DialogBox);
    }
    @Output() isshow = new EventEmitter<boolean>();
    hideWin(win){
        win.style.display="none";
        this.isshow.emit(false);//暴露值给父组件
    }
}