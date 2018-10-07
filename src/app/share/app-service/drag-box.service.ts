/**
 * Created by hua on 2017-01-15.
 */
import { Injectable } from '@angular/core';
@Injectable()
export class DragBoxService {
  //设置弹框居中，参数为最外居盒子的width,和height
  setPosition(parBoxWidth, parBoxHeight) {
    let top = ((document.documentElement.clientHeight || document.body.clientHeight) - parBoxHeight) / 2;
    let left = ((document.documentElement.clientWidth || document.body.clientWidth) - parBoxWidth) / 2;
    let style = {
      'position': 'fixed',
      'z-index': 10000,
      'top': top+'px',
      'left': left+'px'
    };
    return style;
  }
  //拖动元素，tar 为可以设置为按住鼠标拖动的区域，一般为header,tarParent为最外层盒子
  dragEle(tar, tarParent){
    var clickDragX = 0, clickDragY = 0;
    tar.onmousedown = function (event) {
      var event = event || window.event;
      clickDragX = event.clientX - tarParent.offsetLeft;
      clickDragY = event.clientY - tarParent.offsetTop;
      document.onmousemove = function (ev) {
        tar.style.cursor='move';
        var l = ev.clientX - clickDragX;
        var t = ev.clientY - clickDragY;
        if (l < 0)
          l = 0;
        if (t < 0)
          t = 0;
        if (t > document.documentElement.clientHeight - tarParent.offsetHeight)
          t = document.documentElement.clientHeight - tarParent.offsetHeight;
        if (l > document.documentElement.clientWidth - tarParent.offsetWidth)
          l = document.documentElement.clientWidth - tarParent.offsetWidth;
        tarParent.style.left = l + "px";
        tarParent.style.top = t + "px";
      };
      document.onmouseup = function () {
        tar.style.cursor='pointer';
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
}
