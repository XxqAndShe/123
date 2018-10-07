/**
 * Created by hua on 2017-03-03.
 */
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {animationScale} from "./dialog.animation";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
@Component({
    selector:'add-company',
    styleUrls:['./add-company.component.css'],
    templateUrl:'./add-company.component.html',
    animations:[animationScale]
})
export class AddCompanyComponent implements OnInit{
    constructor(public drag:DragBoxService){ }
    public boxContentHeight:number;
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let boxConH=document.documentElement.clientHeight;
        this.boxContentHeight=boxConH;
        let box=document.getElementById('add_box');
        let move=document.getElementById('add_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('add');
    }

}
