import {Component, Output, EventEmitter, Input} from '@angular/core';
import {DragBoxService} from "../../../../share/app-service/drag-box.service";
import {API} from "../../../../share/lib/api/api";
@Component({
    selector: 'add-wall',
    templateUrl: 'add-wall.component.html',
    styleUrls: ['add-wall.component.css']
})
export class AddWallComponent{
    @Output() closeWin = new EventEmitter();
    @Input() areaCode;
    @Input() id;
    wall;
    msgs: any;
    constructor(
        public drag: DragBoxService,
        public api: API
    ){}
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
    close(){
        this.closeWin.emit(false);
    }
    save(){
        if(!this.areaCode){
            this.showSuccess("warn","提示","请选择省市区！");
            return;
        }
        if(!this.wall){
            this.showSuccess("warn","提示","请输入街道！");
            return;
        }
        if(!this.id){
            this.showSuccess("warn","提示","无法获取该地区id！");
            return;
        }
        this.api.call("AreaController.saveArea", {
            'level': 3,
            'parentId': this.id,
            'name': this.wall
        }).ok(data => {
            this.closeWin.emit(true);
        }).fail(data => {

        });
    }
    getId(event){
        this.id = event.id;
    }
}
