import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {API} from "../../../../share/lib/api/api";
@Component({
    selector: 'credit-standard',
    templateUrl: './credit-standard.component.html',
    styleUrls: [
        'credit-standard.component.css'
    ]
})
export class CreditStandardComponent implements OnInit{
    data: any[] = [];
    columns: any[]=[];
    @Output() closePop = new EventEmitter();
    constructor(public api: API){}
    ngOnInit(){
        this.initColumns();
    }
    initColumns(): void{
        this.columns.push({
            field: "name",
            header: "考核项",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "remark",
            header: "规则说明",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "userName",
            header: "操作人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "validTime",
            header: "生效时间",
            sortable: false,
            filter: true
        });
    }
    load(page): any {
        this.api.call("basicSettingController.getRuleList", page, {ruleTypeName: "credit"}).ok(json => {
            this.data = json.result;
        }).fail((err) => {});
    }
    close(){
        this.closePop.emit();
    }
}