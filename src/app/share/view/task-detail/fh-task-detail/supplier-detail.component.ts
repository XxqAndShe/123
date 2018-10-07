import {Component, OnInit, EventEmitter, Output, Input, AfterViewInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {API} from "../../../lib/api/api";
import {VTaskRepairDeatils} from "../../../../modules/sale-center/page/scheduling/vo/task-repair-details.vo";
import {ShowOrHideMaskService} from "../../../app-service/show-or-hide-mask.service";
import {GoodsArriveRespVo} from "./vo/goods-arrive.vo";
import {ReturnClientRespVo} from "./vo/return-client.vo";

@Component({
	selector: 'supplier-detail',
	templateUrl: './supplier-detail.component.html',
	styleUrls: [
		'./supplier-detail.component.css'
	]
})

export class SupplierDetailComponent implements OnInit, AfterViewInit {
	@Output() closeModal = new EventEmitter<any>();
	@Input() selectedRowData;
	constructor(public api: API,
    public mask:ShowOrHideMaskService) {
	}

	con(){
		////console.log(this.selectedRowData)
	}
	// 切换标签
	public infoTypeActive: string;
	// 进度
	public servicerItems: MenuItem[];
    //货物到达
    arrivalIf:boolean = false;
    //返回客户
    returnIf:boolean = false;
    //提示
    msgs:any;
	totalActiveIndex: number = 1; // 总进度
	columns: any[] = [];

	//任务状态下面的时间数组
	// timeArr: any[]=["2017-04-17 11:32","2017-04-17 11:32"];

    goodsArriveRespVo = new GoodsArriveRespVo();
    returnClientRespVo = new ReturnClientRespVo();
	close() {
		this.closeModal.emit();
	}

	ngOnInit() {
		this.selectedRowData=this.selectedRowData?this.selectedRowData:{};
		this.getDetailsInfo();

		this.infoTypeActive = 'rwxx';

		this.servicerItems = [
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
				label: '提货',
			},
			{
				label: '师傅签收',
			},
			{
				label: '货物到达',
			},
			{
				label: '返回客户',
			}
		];
		this.initColumns();
	}
	ngAfterViewInit(): void{
		this.initFancybox();
	}
	initColumns(): void{
		this.columns.push({
			field: 'productName',
			header: '商品名称',
			sortable: true,
			filter: true
		});
		this.columns.push({
			field: 'pieces',
			header: '数量',
			sortable: true,
			filter: true
		});
		this.columns.push({
			field: 'weight',
			header: '重量',
			sortable: true,
			filter: true
		});
		this.columns.push({
			field: 'volume',
			header: '体积（方）',
			sortable: true,
			filter: true
		})
	}

	taskReturnDetails = []    //返货明细列表数据

	/**
	 * 获取返货明细
	 */
	load(page) : any {
		////console.log("load event is %o", page);
		let  id= this.selectedRowData.taskID || this.selectedRowData.id;

		this.api.call("AftermarketTaskController.getVTaskReturnDetail", page,{taskId: id}).ok(json => {
			////console.log("----" + json);
			this.taskReturnDetails = json.result;
		}).fail((err) => {
			////console.log(err);
		});
	}

	public detailsVo: VTaskRepairDeatils = new VTaskRepairDeatils();

	/**
	 * 获取详情信息。
	 */
	getDetailsInfo() {
		let  id= this.selectedRowData.taskID || this.selectedRowData.id;

		this.api.call("AftermarketTaskController.getReturnTaskInfo", {taskId: id}).ok(json => {
			//debugger;
			////console.log("----" + json);
			this.detailsVo = json.result;
			this.goodsArriveRespVo = json.result.goodsArriveNode || {};
			this.returnClientRespVo = json.result.returnCustomerNode || {};
		}).fail((err) => {
			////console.log(err);
		});
	}

	// 标签切换
	selectInfoPanel(type): void {
		this.infoTypeActive = type;
		switch (type){
			case 'rwxx':

			case 'gjxx':

			case 'gzxx':

		}
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
