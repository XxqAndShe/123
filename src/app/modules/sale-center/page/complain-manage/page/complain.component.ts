import { overlayPanelHide, overlayPanelShow } from 'app/share/utils/gridUtil';
import { getDate } from 'app/share/utils/DateUtil';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatepickerService } from "../../../../../share/app-service/datepicker.service";
import { ShowOrHideMaskService } from "../../../../../share/app-service/show-or-hide-mask.service";
import { API } from "app/share/lib/api/api";
import { VComplaintListReqVo } from "app/modules/sale-center/page/complain-manage/vo/VComplaintListReqVo";
@Component({
    templateUrl: './complain.component.html',
    styleUrls: ['./complain.component.css']
})
export class ComplainComponent implements OnInit {
    zh: any = this.datePicker.locale();
    columns: any[] = [];
    data: any;
    showWhichWin: string;
    msgs: any;
    // 判断是新增还是修改
    addOrChange: boolean = false;
    // 表格数据
    selectionRow: any[] = [];
    selection: any;
    rowData: any;
    /* 数据绑定vo */
    vComplaintListReqVo: VComplaintListReqVo = new VComplaintListReqVo();
    CatalogId: string;// 投诉类型
    loading: boolean = false;
    id: any;
    constructor(
        public datePicker: DatepickerService,
        public mask: ShowOrHideMaskService,
        public api: API,
        public datePipe: DatePipe
    ) { }
    ngOnInit() {
        this.initTable();
        this.selectionRow = [];
        this.vComplaintListReqVo['visitedStatus'] = 'all';
        this.vComplaintListReqVo['complaintResult'] = 'all';
        this.vComplaintListReqVo['complaintDealStatus'] = 'all';
    }

    initTable() {
        this.columns.push(
            {
                header: '投诉编号',
                field: 'complaintNo',
                link: true,
            },
            {
                header: '任务号',
                field: 'taskTitle',
            },
            {
                header: '发货人',
                field: 'shipperName'
            },
            {
                header: '联系方式',
                field: 'shipperMobile'
            },
            {
                header: '目的地',
                field: 'shippingAddress'
            },
            {
                header: '投诉人姓名',
                field: 'complainantName'
            },
            {
                header: '投诉人电话',
                field: 'complainantMobile'
            },
            {
                header: '投诉内容',
                field: 'complaintContent'
            },
            {
                header: '投诉来源',
                field: 'complaintSource'
            },
            {
                header: '处理状态',
                field: 'complaintDealStatus'
            },
            {
                header: '投诉结果',
                field: 'complaintResult'
            },
            {
                header: '备注',
                field: 'remark'
            },
            {
                header: '投诉类型',
                field: 'complaintType'
            },
            {
                header: '处罚金额',
                field: 'penaltyFee'
            },
            {
                header: '责任方',
                field: 'complaintDuty'
            },
            {
                header: '责任人',
                field: 'dutyName'
            },
            {
                header: '责任人电话',
                field: 'dutyMobile'
            },
            {
                header: '申诉内容',
                field: 'appealContentLaster',
                link: true,
            },
            {
                header: '创建人',
                field: 'dataCreatedUser'
            },
            {
                header: '创建时间',
                field: 'dataCreatedTime'
            },
            {
                header: '投诉成立时间',
                field: 'inDealTime'
            },
            {
                header: '判定时长',
                field: 'judgeDuration'
            },
            {
                header: '处理完成时间',
                field: 'completedDealTime'
            },
            {
                header: '是否服务补救',
                field: 'hasCompensate'
            },
            {
                header: '补偿金额',
                field: 'compensateFee'
            },
            {
                header: '补偿备注',
                field: 'compensateRemark'
            },
            {
                header: '处理人',
                field: 'dealUser'
            },
            {
                header: '回访备注',
                field: 'lastVisitdRemark'
            },
            {
                header: '回访时间',
                field: 'lastVisitdTime'
            },
            {
                header: '回访是否成功',
                field: 'lastVisitdResult'
            },
            {
                header: '投诉处理态度',
                field: 'lastVisitedAttitude'
            }
        )
    }
    showWin(which) {
        switch (which) {
            case 'add-complain':
                this.showWhichWin = 'add-complain';
                this.addOrChange = false;// false表示新增
                break;
            case 'modify-complain':
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据!");
                    return;
                }
                if (this.selectionRow.length !== 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '已处理' || this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已处理或否决的投诉不允许修改!");
                    return;
                }
                this.showWhichWin = 'modify-complain';
                this.addOrChange = true;// true表示修改
                break;
            case 'appeal':
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据!");
                    return;
                }
                if (this.selectionRow.length !== 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已否决的投诉不能申诉!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus !== '已处理') {
                    this.showSuccess("warn", "提示", "只有已处理的投诉才可以申诉!");
                    return;
                }
                this.showWhichWin = 'appeal';
                break;
            case 'back-visit':
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据!");
                    return;
                }
                if (this.selectionRow.length !== 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已否决的投诉不能回访!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus !== '已处理') {
                    this.showSuccess("warn", "提示", "只有已处理的投诉才可以回访!");
                    return;
                }
                if (this.selectionRow[0].lastVisitdTime) {
                    this.showSuccess("warn", "提示", "已经回访过的投诉不允许重复回访!");
                    return;
                }
                this.showWhichWin = 'back-visit';
                break;
            case 'handle-complain':
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据!");
                    return;
                }
                if (this.selectionRow.length !== 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '已处理') {
                    this.showSuccess("warn", "提示", "已处理的投诉不能再处理!");
                    return;
                }
                if (this.selectionRow[0].complaintDealStatus === '否决') {
                    this.showSuccess("warn", "提示", "已否决的投诉不能再处理!");
                    return;
                }
                this.showWhichWin = 'handle-complain';
                break;
            default:
                if (this.selectionRow.length === 0) {
                    this.showSuccess("warn", "提示", "请选择一条数据!");
                    return;
                }
                if (this.selectionRow.length !== 1) {
                    this.showSuccess("warn", "提示", "只能选择一条数据!");
                    return;
                }
                this.showWhichWin = which;
                break;
        }
        this.mask.show();
    }
    closeWin(event) {
        this.showWhichWin = '';
        this.mask.hide();
        if (event) {
            this.showSuccess("success", "提示", "操作成功");
            // 更新列表数据
            this.doSearch();
        }
    }
    /**
     * 根据查询条件查询列表数据
     */
    doSearch() {
        this.load({ first: 0, rows: 10 });
    }
    /**
     * 加载表格数据
     */
    load(event) {
        // 取出日期
        let startDate = _.clone(this.vComplaintListReqVo.dataCreatedBeginTime);
        let endDate = _.clone(this.vComplaintListReqVo.dataCreatedEndTime);
        // 转换日期格式
        if (startDate && endDate) {
            this.vComplaintListReqVo.dataCreatedBeginTime = getDate(this.datePipe.transform(startDate, 'yyyy-MM-dd 00:00:00'));
            this.vComplaintListReqVo.dataCreatedEndTime = getDate(this.datePipe.transform(endDate, 'yyyy-MM-dd 23:59:59'));
        }
        this.loading = true;
        this.api.call("ComplaintController.listComplaint", event, this.vComplaintListReqVo)
            .ok(json => {
                this.data = json.result;
                this.loading = false;
                this.selectionRow = [];
            })
            .fail(fail => {
                this.loading = false;
                this.selectionRow = [];
                if (fail.error) {
                    this.showSuccess("warn", "提示", fail.error);
                } else {
                    this.showSuccess("error", "提示", "查询失败！");
                }
            });
    }
    /**
     * 选中数据
     */
    rowSelect(event) {
        this.selectionRow = event;
    }

    cellClick(event): void {
        this.rowData = event.row;
        if (event.field === 'appealContentLaster') {
            this.id = event.row.id;
            this.showWhichWin = 'appeal-detail';
            this.mask.show();
        }
        if (event.field === 'complaintNo') {
            this.id = event.row.id;
            this.showWhichWin = 'complaint-detail';
            this.mask.show();
        }
    }

    /**
    * 表格字段鼠标进入表格cell事件触发回调方法
    * @param $event
    * @param restObj 浮动窗口对象，根据窗口数量传参自己定义
    */
    /* cellMouseEnter($event, ...restObj: any[]) {
        if ($event.field === "lastVisitdResult") {
            overlayPanelShow($event, restObj, ['visited']);
            this.api.call('complaintController.listVisited', {
                id: $event.row.id,
            }
            ).ok(json => {
                console.log(json.result);
            }).fail(err => {
            });
        }
    } */

    /**
     * 鼠标从自定义悬浮框上移走触发
     * @param restObj
     */
    /*  cellMouseLeave($event, ...restObj: any[]) {
         overlayPanelHide($event, restObj, ['visited']);
     } */

    /**
     * 清空
     */
    resetAll() {
        this.vComplaintListReqVo.bigCatalogId = null;
        this.vComplaintListReqVo.smallCatalogId = null;
    }

    onCatalogChange(event) {
        if (event.level === 0) {
            // this.vComplaintListReqVo.dutyName = event.label;
            this.vComplaintListReqVo.bigCatalogId = null;
            this.vComplaintListReqVo.smallCatalogId = null;
        } else if (event.level === 1) {
            this.vComplaintListReqVo.bigCatalogId = this.CatalogId;
            this.vComplaintListReqVo.smallCatalogId = null;
        } else {
            this.vComplaintListReqVo.smallCatalogId = this.CatalogId;
        }
    }
    /**
     * 导出
     */
    exportCSV($event) {
        this.api.call('ComplaintController.listComplaint', {
            first: 0,
            rows: 99999999
        }, this.vComplaintListReqVo)
            .ok(data => {
                $event.done($event.grid, data.result.content);
            })
            .fail(err => {
                $event.done(null, null, true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
}
