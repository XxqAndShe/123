import {Component, EventEmitter, Output, OnInit,Input,OnChanges,SimpleChanges} from '@angular/core';
import {ShowOrHideMaskService} from '../../../../../share/app-service/show-or-hide-mask.service';
import {DatepickerService} from "../../../../../share/app-service/datepicker.service";
import {AllArbitrationRequestVo} from "../vo/all-arbitration-request.vo";
import {API} from "../../../../../share/lib/api/api";
@Component({
    selector:'search-top',
    templateUrl: './search-top.component.html',
    styleUrls: [
        './search-top.component.css'
    ]
})

export class SearchTopComponent implements OnInit,OnChanges{
    @Input() curIndex:number;
    @Input() selected;
    @Input() selectedNum;
    @Input() loading;
    @Output() doSearch=new EventEmitter<any>();
    @Output() cancelSelect = new EventEmitter();
    // 日历组件
    zh: any=this.datePickerService.locale();
    inputStyle: any={ // 输入框样式
        // 'width': 102+'px',
        'height': 30+'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    arbqueryRequst :AllArbitrationRequestVo;

    @Output() isExplane= new EventEmitter<boolean>();
    isshowSX=false;
    showShaixuan(){
        this.isshowSX=!this.isshowSX;
        this.isExplane.emit(this.isshowSX);

    }
    //表格头切换
    isshowTitle=true;
    showTitle(){
        this.isshowTitle=!this.isshowTitle;
        this.cancelSelect.emit();
    }

    ngOnInit():void{
        this.arbqueryRequst =new AllArbitrationRequestVo();
        ////console.log(this.arbqueryRequst);
        //设默认值
        this.arbqueryRequst["arbStatus"] = 'All';
        this.arbqueryRequst["source"] = 'All';

    }
    ngOnChanges(changes: SimpleChanges){
        //this.arbqueryRequst =new AllArbitrationRequestVo();
        var curIn:string;
        for (let curIndex in changes) {
            let chng = changes[curIndex];
            curIn  = JSON.stringify(chng.currentValue);
        }
        switch (parseInt(curIn)) {
            case 0:
                this.arbqueryRequst.arbStatus = 'All';
                break;
            case 1:
                this.arbqueryRequst.arbStatus = '未仲裁';
                break;
            case 2:
                this.arbqueryRequst.arbStatus = '已仲裁';
                break;
            case 3:  //仲裁跟踪
                this.arbqueryRequst.isTrack = 'yes';
        }
    }
    constructor(public mask:ShowOrHideMaskService,
                public datePickerService: DatepickerService,
                public api:API
    ){}
   //显示仲裁处理弹框
    @Output() showWin=new EventEmitter<boolean>();
    showModal(){
        this.showWin.emit(true);
    }
    @Output() showTraceWin=new EventEmitter<boolean>();
    showTraceModal(){
        this.showTraceWin.emit(true);


    }

    /**
     * 文本下拉框临时数据
     */
    public temp:string;
    public suggestionResult:string[];//查询建议结果

    searchResult(event,type?) {
        if(type='receive'){
            //查询收货人
        }
        if(event.query.startsWith("a")){
            this.suggestionResult = ["aaa","aab","aac"];
        }
        else if(event.query.startsWith("b")){
            this.suggestionResult = ["bbb","bba","bbc"];
        }
    }

    /**
     *
     * 仲裁处理查询
     */
    cmdQuery(){
       this.doSearch.emit(this.arbqueryRequst);
    }

}
