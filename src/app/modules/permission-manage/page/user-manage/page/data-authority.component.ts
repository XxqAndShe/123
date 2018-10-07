import { Component, Output, EventEmitter } from '@angular/core';
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
import { DragBoxService } from '../../../../../share/app-service/drag-box.service';
import {TreeNode} from 'primeng/primeng';

@Component({
    selector: 'data-authority',
    templateUrl: 'data-authority.component.html',
    styleUrls: [
        'data-authority.component.css'
    ]
})

export class DataAuthorityComponent {
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService) {}

    @Output() hideModal = new EventEmitter<boolean>();
    panelTitles=['TMS','IPS','WMS','CMP','PMS'];
    isClicked=[];

    subPanelTitles=['行业','家居','建材'];
    isSubClicked=[];

    // 第三步模拟数据
    files1: TreeNode[]=[
        {
            "label": "TMS",
            "data": "Documents Folder",
            "children": [{
                "label": "运营中心",
                "data": "Work Folder",
                "children": [{"label": "收运管理",
                    "data": "shouyun Folder",
                    "children":[
                        {"label": "运单管理",
                            "data": "yundan Folder",
                            "children":[{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                        }]
                },{"label": "线路查询"},{"label": "库存管理"},{"label": "运单更改"},{"label": "运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                    {"label": "中转外发成本"},{"label": "订单分配"},{"label":"安装分拣"}]
            }]
        }];
    files2: TreeNode[]=[
        {
            "label": "IPS",
            "data": "Home Folder",
            "children": [
                {"label": "登录"},
                {
                    "label": "首页",
                    "data": "first Folder",
                    "children": [{"label": "订单查询"}]
                },
                {
                    "label": "基础管理",
                    "data": "base Folder",
                    "children": [
                        {
                            "label": "地址库管理",
                            "data": "first Folder",
                            "children": [{"label": "查询"},{"label": "清空"}]
                        },
                        {
                            "label": "网点管理",
                            "data": "first Folder",
                            "children": [{"label": "搜索"},{"label": "重置"}]
                        },
                        {
                            "label": "安装价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        },
                        {
                            "label": "支线价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        }
                    ]
                },
                {
                    "label": "调度管理",
                    "data": "deposit Folder",
                    "children": [
                        {
                            "label": "调度任务",
                            "data": "first Folder",
                            "children": [{"label": "调度任务"},{"label": "维修任务"},{"label": "返货任务"}]
                        },
                        {
                            "label": "服务商任务",
                            "data": "first Folder",
                            "children": [{"label": "查看详情"},{"label": "异常登记"}]
                        },
                        {
                            "label": "任务综合查询",
                            "data": "first Folder",
                            "children": [{"label": "上传签收图"},{"label": "查看详情"},{"label": "干线结束"},{"label": "提货"},{"label": "取消分配"},{"label": "预约"},{"label": "签收"},{"label": "取消签收"}]
                        }
                    ]
                },
                {
                    "label": "考核管理",
                    "data": "kpi Folder",
                    "children": [
                        {
                            "label": "省份KPI",
                            "data": "pro Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "合作商KPI",
                            "data": "coopera Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "发货人KPI",
                            "data": "fahuo Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "信用管理",
                            "data": "credit Folder",
                            "children": [{"label": "信用查询"}]
                        }
                    ]
                },
                {
                    "label": "合作商",
                    "data": "cooperation Folder",
                    "children": [
                        {
                            "label": "师傅管理",
                            "data": "pro Folder",
                            "children": [{"label": "修改"},{"label": "查看"},{"label": "删除"},{"label": "新增"}]
                        },
                        {
                            "label": "体现账户管理",
                            "data": "coopera Folder",
                            "children": [{"label": "账户变更"}]
                        },
                        {
                            "label": "师傅实名认证",
                            "data": "fahuo Folder",
                            "children": [{"label": "认证不通过"},{"label": "认证通过"}]
                        },
                        {
                            "label": "师傅资料审核",
                            "data": "credit Folder",
                            "children": [{"label": "查看"},{"label": "拒绝"},{"label": "审核"}]
                        }
                    ]
                },
                {
                    "label": "客户服务",
                    "data": "kehu Folder",
                    "children": [
                        {"label": "异常管理"},
                        {
                            "label": "仲裁管理",
                            "data": "coopera Folder",
                            "children": [{"label": "全部仲裁任务"}]
                        },
                        {
                            "label": "售后任务",
                            "data": "fahuo Folder",
                            "children": [{"label": "维修任务"},{"label": "补货任务"},{"label": "返货任务"},{"label": "其他"}]
                        },
                        {
                            "label": "客户回访",
                            "data": "credit Folder",
                            "children": [{"label": "回访录入"},{"label": "回访跟进"}]
                        }
                    ]
                },
                {"label": "财务中心"},{"label": "个人中心"},{"label": "数据分析"}
            ]
        }];
    files3: TreeNode[]=[
        {
            "label": "WMS",
            "data": "WMS Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files4: TreeNode[]=[
        {
            "label": "CMP",
            "data": "CMP Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files5: TreeNode[]=[
        {
            "label": "PMS",
            "data": "PMS Folder",
            "children": [
                {
                    "label": "运营中心",
                    "data": "sale Folder",
                    "children": [
                        {
                            "label": "收运管理",
                            "data": "sale Folder",
                            "children": [
                                {
                                    "label": "运单管理",
                                    "data": "sale Folder",
                                    "children": [{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                                },
                                {"label": " 路线查询"},{"label": "库存管理"},{"label": "运单更改"},
                                {"label": " 运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                                {"label": " 中转外发成本"},{"label": "订单分配"},{"label": " 安装分拣"},
                            ]
                        }
                    ]
                }]
        }];
    files6: TreeNode[]=[
        {
            "label": "TMS",
            "data": "Documents Folder",
            "children": [{
                "label": "运营中心",
                "data": "Work Folder",
                "children": [{"label": "收运管理",
                    "data": "shouyun Folder",
                    "children":[
                        {"label": "运单管理",
                            "data": "yundan Folder",
                            "children":[{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                        }]
                },{"label": "线路查询"},{"label": "库存管理"},{"label": "运单更改"},{"label": "运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                    {"label": "中转外发成本"},{"label": "订单分配"},{"label":"安装分拣"}]
            }]
        }];
    files7: TreeNode[]=[
        {
            "label": "IPS",
            "data": "Home Folder",
            "children": [
                {"label": "登录"},
                {
                    "label": "首页",
                    "data": "first Folder",
                    "children": [{"label": "订单查询"}]
                },
                {
                    "label": "基础管理",
                    "data": "base Folder",
                    "children": [
                        {
                            "label": "地址库管理",
                            "data": "first Folder",
                            "children": [{"label": "查询"},{"label": "清空"}]
                        },
                        {
                            "label": "网点管理",
                            "data": "first Folder",
                            "children": [{"label": "搜索"},{"label": "重置"}]
                        },
                        {
                            "label": "安装价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        },
                        {
                            "label": "支线价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        }
                    ]
                },
                {
                    "label": "调度管理",
                    "data": "deposit Folder",
                    "children": [
                        {
                            "label": "调度任务",
                            "data": "first Folder",
                            "children": [{"label": "调度任务"},{"label": "维修任务"},{"label": "返货任务"}]
                        },
                        {
                            "label": "服务商任务",
                            "data": "first Folder",
                            "children": [{"label": "查看详情"},{"label": "异常登记"}]
                        },
                        {
                            "label": "任务综合查询",
                            "data": "first Folder",
                            "children": [{"label": "上传签收图"},{"label": "查看详情"},{"label": "干线结束"},{"label": "提货"},{"label": "取消分配"},{"label": "预约"},{"label": "签收"},{"label": "取消签收"}]
                        }
                    ]
                },
                {
                    "label": "考核管理",
                    "data": "kpi Folder",
                    "children": [
                        {
                            "label": "省份KPI",
                            "data": "pro Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "合作商KPI",
                            "data": "coopera Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "发货人KPI",
                            "data": "fahuo Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "信用管理",
                            "data": "credit Folder",
                            "children": [{"label": "信用查询"}]
                        }
                    ]
                },
                {
                    "label": "合作商",
                    "data": "cooperation Folder",
                    "children": [
                        {
                            "label": "师傅管理",
                            "data": "pro Folder",
                            "children": [{"label": "修改"},{"label": "查看"},{"label": "删除"},{"label": "新增"}]
                        },
                        {
                            "label": "体现账户管理",
                            "data": "coopera Folder",
                            "children": [{"label": "账户变更"}]
                        },
                        {
                            "label": "师傅实名认证",
                            "data": "fahuo Folder",
                            "children": [{"label": "认证不通过"},{"label": "认证通过"}]
                        },
                        {
                            "label": "师傅资料审核",
                            "data": "credit Folder",
                            "children": [{"label": "查看"},{"label": "拒绝"},{"label": "审核"}]
                        }
                    ]
                },
                {
                    "label": "客户服务",
                    "data": "kehu Folder",
                    "children": [
                        {"label": "异常管理"},
                        {
                            "label": "仲裁管理",
                            "data": "coopera Folder",
                            "children": [{"label": "全部仲裁任务"}]
                        },
                        {
                            "label": "售后任务",
                            "data": "fahuo Folder",
                            "children": [{"label": "维修任务"},{"label": "补货任务"},{"label": "返货任务"},{"label": "其他"}]
                        },
                        {
                            "label": "客户回访",
                            "data": "credit Folder",
                            "children": [{"label": "回访录入"},{"label": "回访跟进"}]
                        }
                    ]
                },
                {"label": "财务中心"},{"label": "个人中心"},{"label": "数据分析"}
            ]
        }];
    files8: TreeNode[]=[
        {
            "label": "WMS",
            "data": "WMS Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files9: TreeNode[]=[
        {
            "label": "CMP",
            "data": "CMP Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files10: TreeNode[]=[
        {
            "label": "PMS",
            "data": "PMS Folder",
            "children": [
                {
                    "label": "运营中心",
                    "data": "sale Folder",
                    "children": [
                        {
                            "label": "收运管理",
                            "data": "sale Folder",
                            "children": [
                                {
                                    "label": "运单管理",
                                    "data": "sale Folder",
                                    "children": [{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                                },
                                {"label": " 路线查询"},{"label": "库存管理"},{"label": "运单更改"},
                                {"label": " 运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                                {"label": " 中转外发成本"},{"label": "订单分配"},{"label": " 安装分拣"},
                            ]
                        }
                    ]
                }]
        }];
    files11: TreeNode[]=[
        {
            "label": "TMS",
            "data": "Documents Folder",
            "children": [{
                "label": "运营中心",
                "data": "Work Folder",
                "children": [{"label": "收运管理",
                    "data": "shouyun Folder",
                    "children":[
                        {"label": "运单管理",
                            "data": "yundan Folder",
                            "children":[{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                        }]
                },{"label": "线路查询"},{"label": "库存管理"},{"label": "运单更改"},{"label": "运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                    {"label": "中转外发成本"},{"label": "订单分配"},{"label":"安装分拣"}]
            }]
        }];
    files12: TreeNode[]=[
        {
            "label": "IPS",
            "data": "Home Folder",
            "children": [
                {"label": "登录"},
                {
                    "label": "首页",
                    "data": "first Folder",
                    "children": [{"label": "订单查询"}]
                },
                {
                    "label": "基础管理",
                    "data": "base Folder",
                    "children": [
                        {
                            "label": "地址库管理",
                            "data": "first Folder",
                            "children": [{"label": "查询"},{"label": "清空"}]
                        },
                        {
                            "label": "网点管理",
                            "data": "first Folder",
                            "children": [{"label": "搜索"},{"label": "重置"}]
                        },
                        {
                            "label": "安装价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        },
                        {
                            "label": "支线价格管理",
                            "data": "first Folder",
                            "children": [{"label": "导入"},{"label": "导出"},{"label": "新增"},{"label": "删除"},{"label": "修改价格"}]
                        }
                    ]
                },
                {
                    "label": "调度管理",
                    "data": "deposit Folder",
                    "children": [
                        {
                            "label": "调度任务",
                            "data": "first Folder",
                            "children": [{"label": "调度任务"},{"label": "维修任务"},{"label": "返货任务"}]
                        },
                        {
                            "label": "服务商任务",
                            "data": "first Folder",
                            "children": [{"label": "查看详情"},{"label": "异常登记"}]
                        },
                        {
                            "label": "任务综合查询",
                            "data": "first Folder",
                            "children": [{"label": "上传签收图"},{"label": "查看详情"},{"label": "干线结束"},{"label": "提货"},{"label": "取消分配"},{"label": "预约"},{"label": "签收"},{"label": "取消签收"}]
                        }
                    ]
                },
                {
                    "label": "考核管理",
                    "data": "kpi Folder",
                    "children": [
                        {
                            "label": "省份KPI",
                            "data": "pro Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "合作商KPI",
                            "data": "coopera Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "发货人KPI",
                            "data": "fahuo Folder",
                            "children": [{"label": "详情"},{"label": "导出"}]
                        },
                        {
                            "label": "信用管理",
                            "data": "credit Folder",
                            "children": [{"label": "信用查询"}]
                        }
                    ]
                },
                {
                    "label": "合作商",
                    "data": "cooperation Folder",
                    "children": [
                        {
                            "label": "师傅管理",
                            "data": "pro Folder",
                            "children": [{"label": "修改"},{"label": "查看"},{"label": "删除"},{"label": "新增"}]
                        },
                        {
                            "label": "体现账户管理",
                            "data": "coopera Folder",
                            "children": [{"label": "账户变更"}]
                        },
                        {
                            "label": "师傅实名认证",
                            "data": "fahuo Folder",
                            "children": [{"label": "认证不通过"},{"label": "认证通过"}]
                        },
                        {
                            "label": "师傅资料审核",
                            "data": "credit Folder",
                            "children": [{"label": "查看"},{"label": "拒绝"},{"label": "审核"}]
                        }
                    ]
                },
                {
                    "label": "客户服务",
                    "data": "kehu Folder",
                    "children": [
                        {"label": "异常管理"},
                        {
                            "label": "仲裁管理",
                            "data": "coopera Folder",
                            "children": [{"label": "全部仲裁任务"}]
                        },
                        {
                            "label": "售后任务",
                            "data": "fahuo Folder",
                            "children": [{"label": "维修任务"},{"label": "补货任务"},{"label": "返货任务"},{"label": "其他"}]
                        },
                        {
                            "label": "客户回访",
                            "data": "credit Folder",
                            "children": [{"label": "回访录入"},{"label": "回访跟进"}]
                        }
                    ]
                },
                {"label": "财务中心"},{"label": "个人中心"},{"label": "数据分析"}
            ]
        }];
    files13: TreeNode[]=[
        {
            "label": "WMS",
            "data": "WMS Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files14: TreeNode[]=[
        {
            "label": "CMP",
            "data": "CMP Folder",
            "children": [{"label": "模块"},{"label": "功能"},{"label": "按钮"}]
        }];
    files15: TreeNode[]=[
        {
            "label": "PMS",
            "data": "PMS Folder",
            "children": [
                {
                    "label": "运营中心",
                    "data": "sale Folder",
                    "children": [
                        {
                            "label": "收运管理",
                            "data": "sale Folder",
                            "children": [
                                {
                                    "label": "运单管理",
                                    "data": "sale Folder",
                                    "children": [{"label": "新增"},{"label": "修改"},{"label": "删除"}]
                                },
                                {"label": " 路线查询"},{"label": "库存管理"},{"label": "运单更改"},
                                {"label": " 运单更改审核"},{"label": "领单管理"},{"label": "运单查询"},
                                {"label": " 中转外发成本"},{"label": "订单分配"},{"label": " 安装分拣"},
                            ]
                        }
                    ]
                }]
        }];

    ngOnInit() {
        let DialogTitle = document.getElementById('dialog_title_operate');
        let DialogBox = document.getElementById('dialog_box_operate');
        // ////console.log(DialogTitle,DialogBox)
        this.drag.dragEle(DialogTitle, DialogBox);

        this.isClicked[0]=true;
        for(var i=1;i<this.panelTitles.length;i++){
            this.isClicked[i]=false;
        }
        for(var i=0;i<this.subPanelTitles.length;i++){
            this.isSubClicked[i]=false;
        }
    }
    dealHide(obj){
        obj.style.display="none";
        this.mask.hide();
        this.hideModal.emit(false);//暴露值给父组件
    }

    // panel切换
    panelChange(index){
        for(var i=0;i<this.panelTitles.length;i++){
            this.isClicked[i]=false;
        }
        this.isClicked[index]=true;
    }
    /**
     * 第三步子标题选择切换
     */
    changeSubTitle(index){
        this.isSubClicked[index]=!this.isSubClicked[index];
    }

}