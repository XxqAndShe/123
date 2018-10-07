/**
 * Created by giscafer on 2017-05-16.
 */

/**
 * 表格字段鼠标进入表格cell事件触发回调方法
 * @param $event
 * @param layArr p-overlayPanel对象数组，浮动窗口对象，根据窗口数量传参自己定义，因为此处举例三个弹窗
 * @param fieldNames 元素值的位置要和layArr对应元素一致
 */
export function overlayPanelShow($event, layArr: any[], fieldNames: string[]): any {

    let field = $event.field;
    let index = fieldNames.indexOf(field);
    if (index !== -1) {
        layArr[index].show($event.originalEvent);
    }
}

/**
 * 鼠标从自定义悬浮框上移走触发
 * @param layArr  p-overlayPanel对象数组
 */
export function overlayPanelHide($event, layArr: any[], fieldNames: any[]) {
    let field = $event.field;
    let index = fieldNames.indexOf(field);
    let relatedTarget = $event.originalEvent.relatedTarget || {};
    if (index !== -1 && !containsOverLayer(relatedTarget.className)) {
        layArr[index].hide();
    } else if (index !== -1) {
        //离开弹窗自动隐藏
        let nativeEle = layArr[index].el.nativeElement;
        if (!nativeEle.children[0]) return;
        nativeEle.children[0].onmouseleave = function () {
            layArr[index].hide();
        }
    }
}

/**
 * 判断类名是否存在浮动框，控制鼠标在overlay之上不隐藏弹窗
 * @param className
 * @returns {any}
 */
function containsOverLayer(className) {
    if (!className) return false;
    return className.includes('ui-overlaypanel');
}


/**
 *
 * @param columns 列
 * @param data 数据
 * @param isFailed 失败了
 */
export function doExportCSV(data, columns, title = "导出") {

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
                } else if (value === null || value === 'null' || value === 'undefined') {
                    value = " ";
                }
                csv += '"' + value + '\ufeff"';
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
        navigator.msSaveOrOpenBlob(blob, title + '.csv');
    }
    else {
        var link = document.createElement("a");
        link.style.display = 'none';
        document.body.appendChild(link);
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', title + '.csv');
            link.click();
        }
        else {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            window.open(encodeURI(csv));
        }
        document.body.removeChild(link);
    }
}

