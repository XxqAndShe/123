import {Component, Output, EventEmitter, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {data} from './data'
import {API} from "../../../../../../share/lib/api/api";
import {AreaTreeVO} from "../peo-point-master/vo/area-treevo";
import {log} from "util";
@Component({
    selector: 'intel-match-area',
    templateUrl: './intel-match-area.component.html',
    styleUrls: ['./intel-match-area.component.css']
})
export class IntelMatchAreaComponent implements OnInit {

    constructor(public api: API) {

    }

    //选中节点
    @Input()
    selectedAreas: any[];
    @Output()
    selectChange = new EventEmitter();
    @Output()
    onSelectWholeCountry = new EventEmitter();

    //开启全国
    selectWholeCountry() {
        let adressObj = JSON.parse(sessionStorage.getItem("ui-tree-area-tree")).children;
        //console.log(adressObj);
        if(adressObj != undefined && adressObj != []){
        // 兼容地级市
        let adressArr;
        for (let i = 0; i < adressObj.length; i++) {
            //遍历省
            this.selectedAreas.push({
                data: adressObj[i].data,
                label: adressObj[i].label,
            });
            for (let j = 0; j < adressObj[i].children.length; j++) {
                adressArr = adressObj[i].children[j].children || [];
                //遍历市
                this.selectedAreas.push({
                    data: adressObj[i].children[j].data,
                    label: adressObj[i].children[j].label,
                });
                    for (let h = 0; h < adressArr.length; h++) {
                        //遍历区县
                        this.selectedAreas.push({
                            data: adressObj[i].children[j].children[h].data,
                            label: adressObj[i].children[j].children[h].label,
                        });
                    }
                }

            }

        }
        //console.log(this.selectedAreas)
        // }
        // this.selectedAreas.splice(0,this.selectedAreas.length);
        // this.selectChange.emit({
        //     selectedAreas:this.selectedAreas
        // });
    }

    //退出全国
    returnWholeCountry() {
        // this.selectedAreas.splice(0,this.selectedAreas.length);
        // this.selectChange.emit({
        //     selectedAreas:this.selectedAreas
        // });
        this.selectedAreas = [];
    }

    ngOnInit(): void {
        this.selectedAreas = [];
    }

    load(event) {
        this.api.call("commonController.queryAllAreaTree", {
            data: event.data ? event.data : "000000000000"
        }).ok(json => {
            event.children = json.result;
        });
    }

    onNodeChange($event) {
        this.selectChange.emit({
            event: $event,
            selectedAreas: this.selectedAreas
        });
    }
}

