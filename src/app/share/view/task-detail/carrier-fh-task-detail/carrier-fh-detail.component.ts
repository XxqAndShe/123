import {Component, OnInit, EventEmitter, Output, Input, AfterViewInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {API} from "../../../lib/api/api";
import {ShowOrHideMaskService} from "../../../app-service/show-or-hide-mask.service";
import {CarrierDetailRespVo} from "./vo/carrier-detail.vo";

@Component({
	selector: 'carrier-detail',
	templateUrl: './carrier-fh-detail.component.html',
	styleUrls: [
		'./carrier-fh-detail.component.css'
	]
})

export class CarrierFhDetailComponent implements OnInit, AfterViewInit {
	@Output() closeModal = new EventEmitter<any>();
	@Input() selectedRowData;
	constructor(public api: API,
    public mask:ShowOrHideMaskService) {
	}
	// 切换标签
	public infoTypeActive: string;
	// 进度
	public carrierItems: MenuItem[];
    //货物到达
    arrivalIf:boolean = false;
    //返回客户
    returnIf:boolean = false;
    //提示
    msgs:any;
	totalActiveIndex: number = 1; // 总进度
    carrierDetailRespVo = new CarrierDetailRespVo();
	close() {
		this.closeModal.emit();
	}

	ngOnInit() {
		this.selectedRowData=this.selectedRowData?this.selectedRowData:{};
		this.getDetailsInfo();
		this.infoTypeActive = 'rwxx';
		this.carrierItems = [
			{
				label: '订单生成',
			},
			{
				label: '货物外发',
			},
			{
				label: '货物返回',
			},
			{
				label: '货物到达',
			},
			{
				label: '返回客户',
			}
		];
	}
	ngAfterViewInit(): void{
		this.initFancybox();
	}

	/**
	 * 获取详情信息。
	 */
	getDetailsInfo() {
		let  id= this.selectedRowData.taskID || this.selectedRowData.id;
		this.api.call("AftermarketTaskController.getReturnTaskCarrierDetails", {taskId: id}).ok(json => {
            this.carrierDetailRespVo = json.result
		}).fail((err) => {
		});
	}

	// 标签切换
	selectInfoPanel(type): void {
		this.infoTypeActive = type;
	}

    /**
     *货物到达
     */
    showArrival(){
        this.arrivalIf = true;
        this.mask.show();
        this.returnIf;//关闭返回发货人
    }
     //取消
    arrivalCancle(){
        this.arrivalIf = false;
        this.mask.hide()
    }
    //保存
    arrivalSure(){
        this.showSuccess("success","提示","操作成功");
        this.arrivalCancle();

    }

    /**
     * 返回货物
     */
    showReturn(){
      this.returnIf = true;
      this.mask.show();
      this.arrivalIf;//关闭货物到达
    }
    //取消
    returnCancle(){
        this.returnIf = false;
        this.mask.hide();
    }
    //保存
    returnSure(){
        this.returnIf = false;
        this.mask.hide();
        this.showSuccess("success","提示","操作成功")
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }
	/**
	 * 图片大图预览
	 */
	initFancybox() {
		$(function () {
			$("a[rel=fancybox]").fancybox({
				'titlePosition': 'over',
				'cyclic': true,
				'scrolling':'yes',
				'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
					return '<span id="fancybox-title-over">' + (currentIndex + 1) +
						' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
				}
			});
		});
	}
}
