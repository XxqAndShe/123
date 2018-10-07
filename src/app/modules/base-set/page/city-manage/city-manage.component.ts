import { Component, OnInit } from '@angular/core';
import { API } from "app/share/lib/api/api";

@Component({
    templateUrl: './city-manage.component.html',
    styleUrls: ['./city-manage.component.css']
})

export class CityManageComponent implements OnInit {

    columns: any[] = [];
    //表格数据
    data: any;
    // 选择记录
    selectRows: any[] = [];
    selections: any[] = [];


    constructor(public api: API) {
    }
    ngOnInit() {
        this.initColumns()
    }
    initColumns(): void {
        let columnsData=[
            {
                field: "regionLarge",
                header: "大区级",
                sortable: false,
                filter: true
            },{
                field: "bigUser",
                header: "大区负责人",
                sortable: false,
                filter: true
            },{
                field: "regionSmall",
                header: "小区",
                sortable: false,
                filter: true
            },{
                field: "user",
                header: "地区负责人",
                sortable: false,
                filter: true
            },
            {
                field: "area",
                header: "管辖范围",
                sortable: false,
                filter: true
            }
        ]
        this.columns=columnsData;
    }

    load(page): any {
        this.api.call("regionManagerController.regionManagerFind", page, {}).ok(json => {
            this.data = json.result;
        }).fail((err) => {
            ////console.log(err);
        });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('regionManagerController.regionManagerFind', {
            first:0,
            rows:99999999
        }, {})
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }
    rowSelect($event){
        this.selectRows=$event;
    }

}

