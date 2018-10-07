import {Component, OnInit} from "@angular/core";
import {AreaService} from "../../../../share/app-service/area.service";
@Component({
    templateUrl:"./select-box-test.component.html",
    styleUrls:["./select-box-test.component.css"]
})
export class SelectBoxTestComponent implements OnInit{
    ngOnInit(): void {
    }
    constructor(public areaService:AreaService){}

    area:string="110106000000";

    dataHandler:Function = this.areaService.selectBoxHandler();

    labelHandler:Function = this.areaService.selectBoxLabelHandler();

    doTest():any{
        alert("areaaa="+this.area);
    }
}