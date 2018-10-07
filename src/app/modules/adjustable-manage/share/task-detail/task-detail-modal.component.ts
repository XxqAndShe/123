import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
@Component({
    selector: 'task-detail-modal',
    templateUrl: './task-detail-modal.component.html',
    styleUrls: [
        './task-detail-modal.component.css'
    ]
})
export class TaskDetailModalComponent implements OnInit {
    @Output() closeModal = new EventEmitter<any>();

    //选中行数据
    @Input() selectLineInfo;
    
    // 切换标签
    public infoTypeActive: string;
    // 进度
    public items: MenuItem[];

    wayBill:string="";

    totalActiveIndex: number = 1; // 总进度

    //任务状态下面的时间数组
    timeArr: any[]=["2017-04-17 11:32","2017-04-17 11:32"];

    close() {
        this.closeModal.emit();
    }

    ngOnInit() {
        this.infoTypeActive = 'rwxx';

        this.items = [
            {
                label: '订单生成',
            },
            {
                label: '分配',
            },
            {
                label: '受理',
            },
            {
                label: '预约',
            },
            {
                label: '维修',
            }
        ];

    }

    // 标签切换
    selectInfoPanel(type): void {
        this.infoTypeActive = type;
        switch (type){
            case 'xqxx':

                break;
            case 'gjxx':
                //alert("gjxx");
                break;
            case 'ycxx':
                //alert("ycxx");
                break;
            case 'shxx':
                //alert("shxx");
                break;
            case 'gzxx':
                //alert("gzxx");
                break;
        }
    }
}