import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {VTaskRepairDeatils} from "../../../../modules/sale-center/page/scheduling/vo/task-repair-details.vo";

@Component({
    selector: 'task-msg',
    templateUrl: './task-msg.component.html',
    styleUrls: [
        './task-msg.component.css'
    ]
})
export class TaskMsgComponent implements OnInit,AfterViewInit{
    @Input() selectedRowData;
    @Input() detailsInfo:VTaskRepairDeatils;
    columns: any = []; // 详情信息里面的表格
    initColumns(): void{
        this.columns.push({
            field: '',
            header: '商品名称',
            sortable: true
        });
        this.columns.push({
            field: '',
            header: '维修数量',
            sortable: true
        });
        this.columns.push({
            field: '',
            header: '维修费',
            sortable: true
        });
        this.columns.push({
            field: '',
            header: '备注',
            sortable: true
        })
    }

    ngOnInit(){
        this.initColumns();
       //////console.log(this.selectedRowData);
    }
    ngAfterViewInit(): void{
        this.initFancybox();
    }

    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling':'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }
}