import {Component, OnInit} from "@angular/core";
import {ConfirmationService} from 'primeng/primeng';

@Component({
    templateUrl:"./confirm-dialog.component.html",
    styleUrls:["./confirm-dialog.component.css"]
})
export class ConfirmDialogComponent implements OnInit{
    constructor(
        public confirmationService:ConfirmationService
    ){}
    ngOnInit(){

    }
    //确认按钮
    confirm1() {
        this.confirmationService.confirm({
            message: '这是一个提示弹窗?',
            header: '这里是标题',
            accept: () => {
                alert('你点击了确定')
            }
        });
    }
    //删除按钮
    confirmDel() {
        this.confirmationService.confirm({
            message: '是否确定删除该记录？',
            header: '删除提示',
            accept: () => {
               
            }
        });
    }
}