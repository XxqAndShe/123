import { Component, EventEmitter, Output,Input,OnInit,AfterViewInit} from '@angular/core';
import {API} from "../../../../share/lib/api/api";



import {AreaService} from "../../../../share/app-service/area.service";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {MasterManageServiceVo} from "../../vo/master-manage-service.vo";
import {MasterManageCheckResponse} from "../../vo/master-manger-check-response.vo";


@Component({
    selector: 'master-manage-check',
    templateUrl: './master-manage-check.component.html',
    styleUrls: [
        './master-manage-common.component.css',
        './master-manage-check.component.css'
    ]
})

export class MasterManageCheckComponent implements OnInit,AfterViewInit {
  //  imgArr: string[];//认证照片


    constructor(public api: API,
                public areaService: AreaService,
                public mask: ShowOrHideMaskService,) {
    }

	@Input()masterMangerCheckResponse:MasterManageCheckResponse;

	@Input()typeOfservice;
	@Input()valueAddService;
	@Input()userWorkerServiceArea;
	@Input()imaArr;




	@Output() closeModalCheck = new EventEmitter<boolean>();
	close() {
		this.closeModalCheck.emit(false);
	}
	ngOnInit():void{
		// this.imgArr = ["img1","img2","img3","img4"];//Todo 测试数据
 //console.info(this.masterMangerCheckResponse);
 //console.info("123");
 //console.info(this.imaArr);


}



    ngAfterViewInit(): void {
        this.initFancybox();
    }
    /**
     * 图片大图预览
     */
    initFancybox() {
        $(function () {
            $("a[rel=fancybox]").fancybox({
                'titlePosition': 'over',
                'cyclic': true,
                'scrolling': 'yes',
                'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                    return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                        ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                }
            });
        });
    }


}

