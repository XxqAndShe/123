import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'view-data-win',
    templateUrl: './view-data-win.component.html',
    styleUrls: [
        './view-data-win.component.css'
    ]
})
export class ViewDataWinComponent implements OnInit{
    isSelect: any;
    @Output() closeWin1 = new EventEmitter();
    @Output() winInit = new EventEmitter<boolean>()
    close(){
        this.closeWin1.emit();
        this.winInit.emit(false);
    }

    // 表格
    columns: any[] = [];
    initColumns(): void{
        // 添加或修改报表预览数据时
        if(this.itemsUl.length != 0){
            for(let i = 0; i<this.itemsUl.length; i++){
                this.columns.push({
                    field: '',
                    header: this.itemsUl[i],
                    sortable: true,
                    filter: true
                });
            }
        }
        // 在我的报表中预览数据时
        else {
            for(let j = 0; j<this.theItems.length; j++){
                this.columns.push({
                    field: '',
                    header: this.theItems[j],
                    sortable: true,
                    filter: true
                });
            }
        }
    }

    @Input() itemsUl: any = [];
    @Input() theItems: any = [];
    ngOnInit(){
        this.initColumns();
    }
}