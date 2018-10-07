import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { modalAnimation } from '../../../../share/animation/modalAnimation.animation';
import { DragBoxService } from '../../../../share/app-service/drag-box.service';
import { WithdrawAuditRequestVo } from '../../vo/withdraw-audit-request.vo';
import { WithdrawAuditResponseVo } from '../../vo/withdraw-audit-response.vo';

@Component({
    selector: 'pay-detail',
    templateUrl: './pay-detail.component.html',
    styleUrls: ['./pay-detail.component.css'],
    animations: [
        modalAnimation
    ]
})
export class PayDetailComponent implements OnInit {
    constructor(public drag: DragBoxService) {
    }

    isshowModal: boolean = false;//显示提现审核,任务明细侧边栏，0为提现审核，1为任务明细，2为师傅提现
    isshowModalAni: boolean= false;//显示提现审核侧边栏动画

    //师傅账号，姓名
    withdrawAuditRequestVo: WithdrawAuditRequestVo;

    //提现审批，任务明细responseVo
    withdrawAuditResponseVo: WithdrawAuditResponseVo[];

    data:any;
    payDetail:boolean = false;
    columns:any[]=[];

    @Input() paidResponseVo: any[];
    @Input() anotherpaidRes: any;
    @Output() isshow = new EventEmitter<boolean>();
    @Output() isshowTaskDetail = new EventEmitter<boolean>();

    closeWin() {
        this.isshow.emit(false);
    }



    showTaskDetail(isshow:boolean){
        this.closeWin();
        this.isshowTaskDetail.emit(isshow);
    }

    ngOnInit() {
        let payArea = document.getElementById('pay_detail_title');
        let payBox = document.getElementById('pay_detail');
        this.drag.dragEle(payArea, payBox);

        this.columns.push({
            field: "bePayNo",
            header: "应付单号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "actPayNo",
            header: "实付单号",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "paidAmount",
            header: "已付金额",
            sortable: false,
            filter: true,
            width:'90px'
        });
        this.columns.push({
            field: "noPaidAmount",
            header: "未付金额",
            sortable: false,
            filter: true,
            width:'90px'
        });
        this.columns.push({
            field: "paidPerson",
            header: "付款人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "paidTime",
            header: "付款日期",
            sortable: false,
            filter: true
        });
    }
    load($event):any{
        this.data = this.anotherpaidRes;
    }
}
