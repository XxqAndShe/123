import {Component, OnInit} from "@angular/core";
import {API} from "../../../../share/lib/api/api";
@Component({
    templateUrl:"./tree-test.component.html",
    styleUrls:["tree-test.component.css"]
})
export class TreeTestComponent implements OnInit{

    constructor(public api:API){

    }

    selectNodes:any[];

    selectionMode = "single";

    ngOnInit(): void {
        this.selectNodes = [{
            data:"110228000000",
            label:"北京市"
        }];
    }

    load(event){
        this.api.call("commonController.queryAllAreaTree",{
            data:event.data?event.data:"000000000000"
        }).ok(json=>{
            event.children = json.result;
        });
    }

    nodeSelect(event){
        ////console.log(event);
    }

}