/**
 * Created by hua on 2017-03-03.
 */
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {animationScale} from "./dialog.animation";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
@Component({
    selector:'modify-company',
    styleUrls:['modify-company.component.css'],
    templateUrl:'modify-company.component.html',
    animations:[animationScale]
})
export class ModifyCompanyComponent implements OnInit{
    constructor(public drag:DragBoxService){ }
    public boxContentHeight:number;
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let boxConH=document.documentElement.clientHeight;
        this.boxContentHeight=boxConH;
        let box=document.getElementById('modify_box');
        let move=document.getElementById('modify_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('modify');
    }

}
