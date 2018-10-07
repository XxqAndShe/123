/**
 * Created by hua on 2017-03-08.
 */
import {Component, Input, Output, EventEmitter, trigger, state, style, transition, animate} from "@angular/core";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
import {animationScale} from "./dialog.animation";
@Component({
    selector:'history-info',
    styleUrls:['./history-info.component.css'],
    templateUrl:'./history-info.component.html',
    animations:[
        animationScale,
        trigger('historyState',[
            state('show',style({
              width:'1018px'
            })),
            state('hide',style({
                width:'600px'
            })),
            transition('hide<=>show', animate('180ms ease-in'))
        ])
    ]
})
export class HistoryInfoComponent{
    constructor(public drag:DragBoxService){ }
    public boxContentHeight:number;
    public historyInfoState:string='hide';
    public historyInfo:boolean=false;
    @Input() boxState;
    @Output() closeBox=new EventEmitter<string>();
    ngOnInit(){
        let boxConH=document.documentElement.clientHeight;
        this.boxContentHeight=boxConH;
        let box=document.getElementById('history_box');
        let move=document.getElementById('history_move');
        this.drag.dragEle(move,box);
    }
    close(){
        this.closeBox.emit('history');
    }
    showHistory(){
       if(this.historyInfo){
           this.historyInfoState='hide';
           this.historyInfo=false;
       }
       else{
           this.historyInfoState='show';
           this.historyInfo=true;
       }
    }

}
