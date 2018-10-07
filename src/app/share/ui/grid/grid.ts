/*tslint:disable*/

import {
    Input, Injectable, Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, Output,
    EventEmitter, ViewChild, ElementRef, AfterContentChecked, OnDestroy
} from "@angular/core";
import {tryCatch} from "rxjs/util/tryCatch";
import { ConfirmationService } from "primeng/primeng";
declare var $: any;

@Component({
    selector: "ui-grid",
    templateUrl: "./grid.html",
    styleUrls: ["./grid.css"]
})
export class UIGrid implements OnInit, AfterViewInit,AfterContentChecked,OnDestroy {

    @ViewChild('dt') dt: any;

    // 可配置项目
    @Input()
    id: string;
    @Input()
    title: string;
    @Input()
    showEditColumn: boolean = true; //是否显示编辑列按钮，默认显示
    @Input()
    enableExport: boolean = true; //是否显示导出按钮，默认显示
    @Input()
    columns: any[] = [];
    @Input()
    pageRow: number = 10;
    @Input()
    pageRows: number[] = [10, 20, 30, 50];
    @Input()
    paginator:boolean = true; // 是否显示分页，默认显示

    public _data: any;
    @Input()
    selectionMode: string = "multiple";
    @Input()
    selections: any;
    @Output()
    load = new EventEmitter();
    @Output()
    loadLaterPrice = new EventEmitter();
    @Output()
    loadInstallPrice = new EventEmitter();
    @Output()
    rowSelect = new EventEmitter();
    @Output()
    cellClick = new EventEmitter();
    @Output()
    cellOver = new EventEmitter();

    @Output()
    cellMouseEnter = new EventEmitter();

    @Output()
    cellMouseLeave = new EventEmitter();

    @Output()
    cellLockClick = new EventEmitter();

    @Output()
    exportCSV = new EventEmitter();
    /**
     *  内部变量
     */
        //用于存放可选列
    targetColumns: any[] = [];
    //记录鼠标移动到的行数索引及字段
    index: any;
    refield: any;
    loading: boolean = false;
    //用于标志列编辑对话框的显示状态
    showColumnsDialog: boolean = false;

    constructor(public el: ElementRef) {
    }


    ngOnInit(): void {
        this._data = {
            content: [],
            totalElements: 0
        };
        this.loading = true;
        if(this.id){
            let columnsMap = localStorage[this.id];
            if(columnsMap){
                columnsMap = JSON.parse(columnsMap);
                let sourceColumns = columnsMap["sourceColumns"];
                let targetColumns = columnsMap["targetColumns"];
                if(sourceColumns && targetColumns && this.generateColumnKey([].concat(sourceColumns).concat(targetColumns))==this.generateColumnKey(this.columns)){
                    this.columns = sourceColumns;
                    this.targetColumns =targetColumns;
                }
            }
        }
    }

    ngOnDestroy() {
        if(this.id){
            localStorage[this.id]=JSON.stringify({
                sourceColumns:this.columns,
                targetColumns:this.targetColumns
            });
        }
    }

    generateColumnKey(columns:any[]):string{
        let fields = [];
        for (let column of columns) {
            fields.push(column.field);
        }
        fields.sort();
        let key = "";
        for (let field of fields) {
            if(key.length>0){
                key+="|";
            }
            key+=field;
        }
        return key;
    }

    ngAfterViewInit(): void {

    }

    ngAfterContentChecked(): void {
        // //console.log('11111ngAfterContentChecked11111111');
    }

    onLazyLoad(event: any): any {
        this.loading = true;
        this.load.emit(event);
        this.loadLaterPrice.emit(event);
        this.loadInstallPrice.emit(event);
    }


    get data(): any {
        return this._data;
    }


    @Input()
    set data(value: any) {
        this.loading = false;
        if (!value) return;
        // 手动调用查询，解决分页问题
        if (value.size) {
            this.pageRow = value.size;
            this.dt.first=value.number*value.size;
        }
        let content = value['content'] || [];
        //优化表格重复赋值性能
        for (let row of content) {
            for (let c of [].concat(this.columns).concat(this.targetColumns)) {
                if (c.field && row[c.field] === undefined) {
                    row[c.field] = _.get(row, c.field, "");
                }
            }
        }
        value['content'] = content;
        this._data = value;
        //console.log(this._data);
        //大图预览
        setTimeout(() => {
            this.initFancybox();
        }, 100)
    }

    /**
     * 已废弃，不使用
     * @param obj
     * @param key
     * @returns {any}
     */
    public value(obj: any, path: string): any {
        // //console.log('value'+path);
        return _.get(obj, path, null);
        // return eval("obj." + path) || null;
        /* try {
         return eval("obj." + path);
         } catch (e) {
         //  console.error("field %s of object %o is invalid",path,obj);
         return null;
         }*/
    }

    /**
     * 记录选择事件
     * @param event
     */
    onRowSelectChange(event: any) {
        setTimeout(() => {
            this.rowSelect.emit(this.selections instanceof Array ? this.selections : [this.selections]);
        }, 100);
        return false;
    }

    /**I
     *
     */
    onHeaderCheckboxToggle(event: any) {
        setTimeout(() => {
            this.rowSelect.emit(this.selections instanceof Array ? this.selections : [this.selections]);
        }, 100);
        return false;
    }

    /**
     * cell点击事件
     * @param event
     * @param row
     * @param field
     */
    onCellClick(event: Event, row: any, field: any) {
        let value = row[field];
        this.cellClick.emit({
            row: row,
            field: field,
            value: value,
            originalEvent: event
        });
    }


    /**
     * 锁定图标点击事件
     * @param event
     * @param row
     * @param field
     */
    onCellLockClick(event: Event, row: any, field: any) {
        event.stopPropagation();
        // let value = this.value(row, field);
        let value = row[field];
        this.cellLockClick.emit({
            row: row,
            field: field,
            value: value,
            originalEvent: event
        });
    }

    /**
     * 鼠标mouseover事件
     */
    onCellMouseover(event: any, row: any, field: any) {
        event.stopPropagation();
        // let value = this.value(row, field);
        let value = row[field];
        this.cellOver.emit({
            row: row,
            field: field,
            value: value,
            originalEvent: event
        });
    }

    /**
     * 鼠标悬浮事件
     * @param event
     * @param row
     * @param field
     * @param i
     * @param col
     */
    leftSize: any;
    topSize: any;

    onCellMouseEnter(event: any, row: any, field: any, i?: any, col?: any) {
        event.stopPropagation();
        // let value = this.value(row, field);
        let value = row[field];
        this.cellMouseEnter.emit({
            row: row,
            field: field,
            value: value,
            originalEvent: event
        });

        if (col) {
            // 记录鼠标移进行的索引及字段名
            this.index = i;
            this.refield = col.field;

            this.leftSize = event.clientX + 'px';
            this.topSize = event.clientY + 'px';
        }
    }

    /**
     * 鼠标移开索引改变
     */
    onCellMouseLeave(event: any, row: any, field: any) {
        event.stopPropagation();
        let value = row[field];
        this.index = -1;
        // let value = this.value(row, field);
        this.cellMouseLeave.emit({
            row: row,
            field: field,
            value: value,
            originalEvent: event
        });
    }

    /**
     * 对有textLength属性的column进行字节数量控制
     * @param val
     * @param textLength
     * @returns {string|void|any}
     */
    replaceTextOmit(val: any, textLength: number = 20) {
        let resultData, temp;

        resultData = this.dataToStr(val);
        if (typeof resultData === 'string') {
            temp = resultData.slice(0, textLength);
            return resultData.length > textLength ? `${temp}...` : resultData;
        } else {
            return resultData;
        }
    }

    /**
     * 数据转为字符串
     * @param val
     * @returns {any}
     * @constructor
     */
    dataToStr(val: any) {
        let resultData;
        if (typeof val == 'number') {
            resultData = val.toString();
        } else if (typeof val == 'undefined') {
            resultData = '';
        } else if (val == null) {
            resultData = '';
        } else if (typeof val == 'object') {
            resultData = JSON.stringify(val);
        } else if (typeof val == 'boolean') {
            resultData = val ? '是' : '否';
        } else {
            resultData = val;
        }
        return resultData;
    }

    initFancybox() {
        let content = this._data.content || [];
        $(function () {
            for (let i = 0; i < content.length; ++i) {
                if ($("a[rel=fancybox" + i + "]").length) {
                    $("a[rel=fancybox" + i + "]").fancybox({
                        'titlePosition': 'over',
                        'cyclic': true,
                        'scrolling': 'yes',
                        'showNavArrows': false,
                        'loop': false,
                        'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                            return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                                ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                        }
                    })
                }
            }
        });
    }
    /**
     *
     * @param grid
     * @param data
     * @param isFailed 失败了
     */
    doExportCSV(grid,data,isFailed?:boolean) {
        grid.exportDisable=false;
        if(isFailed){
            return;
        }
        let columns = grid.columns;
        var csv = '\ufeff';
        //headers
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].field && !columns[i].hidden) {
                csv += '"' + (columns[i].header || columns[i].field) + '"';
                if (i < (columns.length - 1)) {
                    csv += ",";
                }
            }
        }
        //body
        data.forEach(function (record, i) {
            csv += '\n';
            for (var i_1 = 0; i_1 < columns.length; i_1++) {
                if (columns[i_1].field && !columns[i_1].hidden) {
                    let value = _.get(record, columns[i_1].field, null);
                    if (typeof value === 'string') {
                        value = value.replace('"', '""');
                    }else if(value===null || value==='null' || value==='undefined'){
                        value="";
                    }
                    if(!isNaN(Number(value)) && value.length>12){
                        csv += '"' + value + '\ufeff"';
                    }else{
                        csv += '"' + value + '"';
                    }
                    if (i_1 < (columns.length - 1)) {
                        csv += ",";
                    }
                }
            }
        });
        var blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, '导出.csv');
        }
        else {
            var link = document.createElement("a");
            link.style.display = 'none';
            document.body.appendChild(link);
            if (link.download !== undefined) {
                link.setAttribute('href', URL.createObjectURL(blob));
                link.setAttribute('download', '导出.csv');
                link.click();
            }
            else {
                csv = 'data:text/csv;charset=utf-8,' + csv;
                window.open(encodeURI(csv));
            }
            document.body.removeChild(link);
        }
    }

    exportDisable=false;

    exportCSVIntenal() {
        let $this = this;
        this.exportDisable=true;
        this.exportCSV.emit({
            done:$this.doExportCSV,
            grid:$this
        });
    }

}
