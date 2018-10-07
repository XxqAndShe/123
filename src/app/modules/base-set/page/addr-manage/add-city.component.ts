import {Component, Output, EventEmitter, Input} from '@angular/core';
import {DragBoxService} from "../../../../share/app-service/drag-box.service";
import {API} from "../../../../share/lib/api/api";
@Component({
    selector: 'add-city',
    templateUrl: 'add-city.component.html',
    styleUrls: ['add-city.component.css']
})
export class AddCityComponent{
    @Output() closeWin = new EventEmitter();
    @Input() provinceCode;
    @Input() id;
    city;
    msgs: any[];
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
        if(!this.provinceCode){
            this.showSuccess("warn","提示","请选择省份！");
            return;
        }
        if(!this.city){
            this.showSuccess("warn","提示","请输入市！");
            return;
        }
        if(!this.id){
            this.showSuccess("warn","提示","无法获取该地区id！");
            return;
        }
        this.api.call("AreaController.saveArea", {
            'level': 1,
            'parentId': this.id,
            'name': this.city
        }).ok(data => {
            this.closeWin.emit(true);
        }).fail(data => {

        });
    }
    getId(event){
        this.id = event.id;
    }
}
