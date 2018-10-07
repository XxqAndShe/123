import { Component, OnInit } from '@angular/core';
import {DataChangeRequestVo} from "../../vo/data-change-request.vo";
import {API} from "../../../../share/lib/api/api";
import {DataChangeService} from "../../service/data-change.service";
import {DataChangeModalService} from "../../service/data-change-modal.service";
import {DataChangeModalResponseVo} from "../../vo/data-change-modal-response.vo";
import {DataChangeModalRequestVo} from "../../vo/data-change-modal-request.vo";
import { AreaService } from '../../../../share/app-service/area.service';
import { ShowOrHideMaskService } from '../../../../share/app-service/show-or-hide-mask.service'
import { modalAnimation } from "../../../../share/animation/modalAnimation.animation";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
import {overlayPanelHide} from "../../../../share/utils/gridUtil";

@Component({
	templateUrl: './data-change.component.html',
	styleUrls: [
		'./data-change.component.css'
	],
	animations: [
		modalAnimation
	]
})

export class DataChangeComponent implements OnInit {

	//输入框组件
	public temp:string;
	public suggestionResult:string[];//查询建议结果
	msgs:any;//公用提示
    loading:boolean;
	searchResult(event, type?) {
		this.api.call("UserWorkerController.findMasterByNameOrAccount",{
			realName:event.query,
			mobile:""
		}).ok(json => {
			this.suggestionResult=json.result;
			////console.log("查询成功")

		}).fail(json => {
			this.showSuccess("error","提示","查询失败！");

		})
	}

	searchResult2(event, type?) {
		////console.log(event.query)
		this.api.call("UserWorkerController.findMasterByNameOrAccount",{
			realName:"",
			mobile:event.query
		}).ok(json => {
			this.suggestionResult=json.result;
			////console.log("查询成功")

		}).fail(json => {

			////console.log("查询失败")
			////console.log(json)
			this.showSuccess("error","提示","查询失败！");

		})
	}

	// 右侧弹出块显示的控制变量
	isModuleDisplayArr = new Array();

	isModuleDisplayArr1 = new Array(); //用以控制动画
	curModalIndex = -1;
	// addrSelectHidden = true;
    //
	// areaText = "";

	dataChangeRequestVo:DataChangeRequestVo;
	dataChangeModalRequestVo:DataChangeModalRequestVo;
	dataChangeBeforeModalResponseVo:DataChangeModalResponseVo;
	dataChangeAfterModalResponseVo:DataChangeModalResponseVo;

	columns:any[]=[];
	data:any;
	// data:any[]=[];
	selections:any[] = [];
	selectNum:number = 0; //选中项数
	deleteSure:boolean = false;//已审核提示框
	moduleInfo = {};
	pendingAuditIf:boolean = false;//待审核
    loadingIf:boolean = false;//加载中
	constructor(public api:API,public dataChangeService:DataChangeService,
				public dataChangeModalService:DataChangeModalService,
				public areaService: AreaService,
				public mask:ShowOrHideMaskService,
				public RequestTokenService:RequestTokenService) {

	}
	ngOnInit():void{
		this.RequestTokenService.createToken()
		this.dataChangeBeforeModalResponseVo = new DataChangeModalResponseVo();
		this.dataChangeAfterModalResponseVo = new DataChangeModalResponseVo();
		this.dataChangeModalRequestVo = new DataChangeModalRequestVo();
		this.dataChangeRequestVo = new DataChangeRequestVo();

		this.dataChangeRequestVo.typeOfService = "All";
		this.dataChangeRequestVo.valueAddService = "All";
		this.dataChangeRequestVo.auditStatus = "pendingAudit";
		for(let i=0; i<2; i++){
			this.isModuleDisplayArr[i] = false;
			this.isModuleDisplayArr1[i] = false;
		}


		let that = this;
		/*this.dataChangeModalService.getAfterData(function(data){
			// Object.assign(that.dataChangeAfterModalResponseVo,data.result);
			that.dataChangeAfterModalResponseVo = Object.create(data.result);
			////console.log(data.result);
		},this.dataChangeModalRequestVo,"MasterInfoChangeController.getInfoChange")

		this.dataChangeModalService.getBeforeData(function(data){
			// that.dataChangeBeforeModalResponseVo.masterName = "li";
			that.dataChangeBeforeModalResponseVo = Object.create(data.result);
			// ////console.log(data.result);
		},this.dataChangeModalRequestVo,"MasterInfoChangeController.getInfoBefore")*/

		this.columns.push({
			field:"departmentName",
			header:"所属网点",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"masterName",
			header:"师傅名称",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"masterAccount",
			header:"师傅手机",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"serviceAreaStr",
			header:"服务区域",
			sortable:false,
			filter:true,
			link:true
		});
		this.columns.push({
			field:"goodsCatalog",
			header:"货品类别",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"auditStatusCN",
			header:"审核状态",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"verifier",
			header:"审核人",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"auditTime",
			header:"审核时间",
			sortable:false,
			filter:true
		});



	}

	displayModal(index) {
		//判断单选
		if(this.selections.length>1){
			this.showSuccess("warn","提示","只能选择一条任务消息");
			return;
		}
			if(this.selections[0].departmentName !== "一智通供应链管理有限公司"&&this.selections[0].departmentName !== "一智通临时网点(存储解约师傅)"){
		    this.showSuccess("warn","提示","不能操作网点师傅");
		    return;
        }
		this.dataChangeAfterModalResponseVo = new DataChangeModalResponseVo;
		this.dataChangeBeforeModalResponseVo = new DataChangeModalResponseVo;
		//调用后台接口，获取变更数据
    this.api.call("MasterInfoChangeController.getInfoChange",this.dataChangeModalRequestVo).ok(data=>{
      this.dataChangeAfterModalResponseVo = Object.create(data.result);
    }).fail(err=>{
      this.showSuccess("error","错误",err.error);
    });
		//this.dataChangeModalService.getAfterData(function (data) {
			//that.dataChangeAfterModalResponseVo = Object.create(data.result);
			////console.log(data.result);
		//}, this.dataChangeModalRequestVo, "MasterInfoChangeController.getInfoChange");

		//调用后台接口，获取变更前数据
    this.api.call("MasterInfoChangeController.getInfoBefore",this.dataChangeModalRequestVo).ok(data=>{
      that.dataChangeBeforeModalResponseVo = Object.create(data.result);
    }).fail(err=>{
      this.showSuccess("error","错误",err.error);
    });
		//this.dataChangeModalService.getBeforeData(function (data) {
			//that.dataChangeBeforeModalResponseVo = Object.create(data.result);
			////console.log(data.result);
		//}, this.dataChangeModalRequestVo, "MasterInfoChangeController.getInfoBefore");

		if (index == 0) {
			//判断师傅审核
			if (this.selections[0].auditStatusCN == "待审核") {
				this.moduleInfo = {
					title: '师傅资料审核',
					tip: '待审核资料',
					isAudit: true,

				};
				index = 0;
				var that = this;
				this.isModuleDisplayArr[index] = true;
				setTimeout(function () {
					that.isModuleDisplayArr1[index] = true;
				}, 0);
				this.curModalIndex = index;
			} else if(this.selections[0].auditStatusCN == "审核"){
				/*提示框*/
				this.deleteSure = true;
				this.mask.show();
			}

		} else if (index == 1) {
			this.moduleInfo = {
				title: '师傅变更资料',
				tip: '审核通过资料',
				isAudit: false
			};
			index = 0;
			var that = this;
			this.isModuleDisplayArr[index] = true;
			setTimeout(function () {
				that.isModuleDisplayArr1[index] = true;
			}, 0);
			this.curModalIndex = index;
		}

	}
	/*确认已审核提示框*/
	ConfirmDeleteSure(){
		this.deleteSure = false;
		this.mask.hide();
	}
	/**
	* 确认审核刷新*/
	saveModal(isClose:boolean){
		this.doSearch();
		this.selectNum =0;
		this.showSuccess("success","提示","操作成功");
		var that = this;
		this.isModuleDisplayArr1[this.curModalIndex] = isClose;
		setTimeout(function(){
			that.isModuleDisplayArr[that.curModalIndex] = isClose;
		}, 200);
	}

	/*关闭动画*/
	closeModal(isClose: boolean) {
		var that = this;
		this.isModuleDisplayArr1[this.curModalIndex] = isClose;
		setTimeout(function(){
			that.isModuleDisplayArr[that.curModalIndex] = isClose;
		}, 200);
	};

	load($event):any{
		 this.api.call("MasterInfoChangeController.getMasterModifyList",$event,this.dataChangeRequestVo).ok(json=>{
		 	this.data = json.result;
		 this.loading = false;
		 });
	}
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('MasterInfoChangeController.getMasterModifyList', {
            first:0,
            rows:99999999
        }, this.dataChangeRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }

	/*关闭列表上按钮*/
	DeleteSelectNum(){
		this.selectNum = 0;
        this.selections = [];
	}

	/*表格点击选中状态*/
	rowSelect($event):any{
		this.selections=$event;
		this.selectNum = this.selections.length;
		//解决取消选中列表错
		if(!$event[0]){
		    return
        };
		this.dataChangeModalRequestVo.masterId = this.selections[0].masterId;
		this.dataChangeModalRequestVo.masterAccount = this.selections[0].masterAccount;
		if (this.selections[0].auditStatusCN == '待审核') {
			this.dataChangeModalRequestVo.auditStatus = "pendingAudit";
			this.pendingAuditIf = true;//待审核按钮
		} else if (this.selections[0].auditStatusCN == '通过') {
			this.dataChangeModalRequestVo.auditStatus = "pass";
			this.pendingAuditIf = false;//待审核按钮
		} else if (this.selections[0].auditStatusCN == '不通过') {
			this.dataChangeModalRequestVo.auditStatus = "notPass";
			this.pendingAuditIf = false;//待审核按钮
		}
		////console.log($event);
	}
	/**
	 * 查询操作
	 */
	doSearch($event?:any):any{
		this.load({first:0,rows:10});
		this.loading = true;
        this.DeleteSelectNum();//点击查询的时候清空列表
	}


	//区域悬浮
	serviceAreas:any;

	/**
	 * 选中的单元格数据
	 */
	cellOverEvent: any;
	// cellMouseEnter($event,...restObj:any[]): any {
    //
	// 	let op1=restObj[0];
	// 	//如果是跟踪信息字段则显示浮动窗口op
	// 	if ($event.field == "serviceAreaStr") {
	// 		this.cellOverEvent = JSON.stringify($event);
	// 		op1.toggle($event.originalEvent);
	// 		this.serviceAreas = $event.row.serviceAreaGrid;
	// 	}
	// }
	// cellMouseLeave($event,...restObj:any[]){
	// 	overlayPanelHide($event,restObj,['serviceAreaStr']);
	// }
    /**
     * 服务区域弹窗
     */
    cellClick(cell,op1): void {
        //console.log(cell);
        if (cell.field == "serviceAreaStr") {
            this.cellOverEvent = JSON.stringify(cell);
            //this.serviceAreas = cell.row.serviceAreaGrid;
            var masterId = cell.row.masterId;
            this.mask.show();
            this.loadingIf = true;
            this.serviceAreas = [];
            this.api.call("masterInfoChangeController.queryUserWorkerModifyAreaCity", {"masterId":masterId}).ok(data=>{
                this.serviceAreas = data.result ||[];
                this.mask.hide();
                this.loadingIf = false;
                op1.toggle(cell.originalEvent);
            }).fail(err=>{
                this.showSuccess("error", "提示", err.error);
            });
        }
    }
	/*公用提示组件*/
	showSuccess(severity:string,summary:string,detail:string) {
		this.msgs = [];
		this.msgs.push({severity:severity, summary:summary, detail:detail});
	}
	// 地址组件
	dataHandler: Function = this.areaService.selectBoxHandler();

}

