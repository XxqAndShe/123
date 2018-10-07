/**
 * Created by hua on 2017-03-08.
 */
import {Component, style, Input, EventEmitter, Output} from "@angular/core";
import {animationScale} from "./dialog.animation";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
@Component({
    selector:'search-company',
    templateUrl:'./search-company.cmponent.html',
    styleUrls:['./search-company.component.css'],
    animations:[animationScale]
})
export class SearchCompanyComponent{
    constructor(public drag:DragBoxService){ }
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let box=document.getElementById('search_box');
        let move=document.getElementById('search_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('search');
    }
}
