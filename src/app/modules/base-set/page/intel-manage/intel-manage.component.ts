import { Component } from '@angular/core';
@Component({
    template:`<router-outlet></router-outlet>`
})
export class IntelManageComponent{
    // nav插件引用设置
    navs = ["智能匹配区域管理","智能匹配规则配置","发货人指定师傅管理","到货区域指定师傅管理"];
    curIndex = 0;

}