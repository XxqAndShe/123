/**
 * Created by hua on 2017-03-03.
 */
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
import {animationScale} from "./dialog.animation";
@Component({
    selector:'stop-use',
    templateUrl:'./stop-use.component.html',
    styleUrls:['./stop-use.component.css'],
    animations:[animationScale]
})
export class StopUseComponent{
    constructor(public drag:DragBoxService){}
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let box=document.getElementById('stop_box');
        let move=document.getElementById('stop_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('stop');
    }
}
