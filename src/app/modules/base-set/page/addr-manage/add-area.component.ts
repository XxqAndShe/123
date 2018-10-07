import {Component, Output, EventEmitter, Input} from '@angular/core';
import {DragBoxService} from "../../../../share/app-service/drag-box.service";
import {API} from "../../../../share/lib/api/api";
@Component({
    selector: 'add-area',
    templateUrl: 'add-area.component.html',
    styleUrls: ['add-area.component.css']
})
export class AddAreaComponent{
    @Output() closeWin = new EventEmitter();
    @Input() cityCode;
    @Input() id;
    area;
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
        if(!this.cityCode){
            this.showSuccess("warn","提示","请选择省市！");
            return;
        }
        if(!this.area){
            this.showSuccess("warn","提示","请输入区县！");
            return;
        }
        if(!this.id){
            this.showSuccess("warn","提示","无法获取该地区id！");
            return;
        }
        this.api.call("AreaController.saveArea", {
            'level': 2,
            'parentId': this.id,
            'name': this.area
            }).ok(data => {
                this.closeWin.emit(true);
            }).fail(data => {

            });
    }
    getId(event){
        this.id = event.id;
    }
}
