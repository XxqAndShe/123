/**
 * 承运商和服务商返货的货物到达和返回客户弹窗
 * fwsGoods表示服务商货物到达
 * fwsClient表示服务商返回客户
 * cysGoods表示承运商货物到达
 * cysClient表示承运商返回客户
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {DragBoxService} from "../../../../../../share/app-service/drag-box.service";
import {API} from "../../../../../../share/lib/api/api";
@Component({
    selector: 'goods-client',
    templateUrl: 'goods-or-client.component.html',
    styleUrls: ['goods-or-client.component.css']
})
export class GoodsOrClientComponent implements OnInit{
    @Output() closeWin = new EventEmitter();
    @Input() flag;
    @Input() selectRow;
    remark: any;//备注
    imgs: any[];//图片
    msgs: any;
    constructor(
        public drag: DragBoxService,
        public api: API
    ){}
    ngOnInit(){
        let box = document.getElementById('container');
        let header = document.getElementById('header');
        this.drag.dragEle(header, box);
    }
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
    close(){
        this.closeWin.emit(false);
    }
    save(){
        if(!this.remark){
            this.showSuccess('warn','提示','备注必填！');
            return;
        }
        let images: string;
        if(this.imgs){
            images = this.imgs.join(',');
        }else{
            images = '';
        }
        //服务商返货，货物到达
        if(this.flag === 'fwsGoods'){
            this.api.call('AftermarketTaskController.serviceGoodsArrive',{
                taskId: this.selectRow.id,
                remark: this.remark,
                repairedImges: images
                }
            ).ok(data => {
                this.closeWin.emit(true);
            }).fail(err => {
                this.showSuccess('error','提示','操作失败！');
            });
        }
        //服务商返货，返回客户
        if(this.flag === 'fwsClient'){
            this.api.call('aftermarketTaskController.serviceReturnCustomer',{
                taskId: this.selectRow.id,
                remark: this.remark,
                repairedImges: images
                }
            ).ok(data => {
                this.closeWin.emit(true);
            }).fail(err => {
                this.showSuccess('error','提示','操作失败！');
            });
        }
        //承运商返货，货物到达
        if(this.flag === 'cysGoods'){
            this.api.call('aftermarketTaskController.goodsArrive',{
                    taskId: this.selectRow.id,
                    returnRmark: this.remark,
                    imgs: this.imgs
            }
            ).ok(data => {
                this.closeWin.emit(true);
            }).fail(err => {
                this.showSuccess('error','提示','操作失败！');
            });
        }
        //承运商返货，返回客户
        if(this.flag === 'cysClient'){
            this.api.call('aftermarketTaskController.returnCustomer',{
                    taskId: this.selectRow.id,
                    returnRmark: this.remark,
                    imgs: this.imgs
                }
            ).ok(data => {
                this.closeWin.emit(true);
            }).fail(err => {
                this.showSuccess('error','提示','操作失败！');
            });
        }
    }
}
