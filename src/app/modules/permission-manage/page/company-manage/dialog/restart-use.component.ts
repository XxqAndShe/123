/**
 * Created by hua on 2017-03-02.
 */
import {Component, OnInit, Input, Output,EventEmitter} from "@angular/core";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
import {animationScale} from "./dialog.animation";

@Component({
    selector:'restart-use',
    styleUrls:['./restart-use.component.css'],
    templateUrl:'./restart-use.component.html',
    animations:[animationScale]
})
export class RestartUseComponent implements OnInit{
    constructor(public drag:DragBoxService){}
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let box=document.getElementById('restart_box');
        let move=document.getElementById('restart_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('restart');
    }
}
