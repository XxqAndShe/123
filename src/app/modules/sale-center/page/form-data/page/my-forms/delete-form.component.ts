import { Component,OnInit,Output,Input,EventEmitter} from '@angular/core';
import {  ShowOrHideMaskService } from '../../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../../share/app-service/drag-box.service';

@Component({
    selector:'delete-form',
    templateUrl: './delete-form.component.html',
    styleUrls: [
        './delete-form.component.css'
    ]
})

export class DeleteFormComponent implements OnInit{
    constructor(public drag:DragBoxService){}
    ngOnInit(){
        let dialogTitle=document.getElementById('dialog_title');
        let dialogBox=document.getElementById('dialog_box');
        this.drag.dragEle(dialogTitle,dialogBox);
    }
    //隐藏弹框
    @Output() hideDelForm=new EventEmitter<boolean>();
    @Output() isDel = new EventEmitter<boolean>();
    @Input() formName: string;


    hideDialog(){
      this.hideDelForm.emit(false);
    }
    saveDel(){
        this.hideDelForm.emit(false);
        this.isDel.emit(true);
    }
}