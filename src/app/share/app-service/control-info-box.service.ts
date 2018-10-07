/**
 * Created by hua on 2017-02-13.
 */
import { Injectable } from '@angular/core';
let docEventTar:any;
@Injectable()
export class ControlInfoBoxService{
    public controlInfoBox:string='hide';
    //document 点击事件
    docClickEvent(event){
       docEventTar=event.target;
    }
    // 表格点击显示信息盒-
    clickTableItem(boxState,tar){
        if(boxState!=='show'){
            this.controlInfoBox='show';
            tar.style.display='block';
            tar.focus();
            document.onclick=this.docClickEvent;
        }
    }
    infoBoxBlur(infoBox){
        let that=this;
        setTimeout(function () {
            //标记是否是单号，有此属性单号点击订单详情弹框就不收
            if(docEventTar.getAttribute('data-mark')==null){
                that.controlInfoBox='hide';
                document.onclick=null;
                return;
            }
            infoBox.focus();
        },200);
    }
}