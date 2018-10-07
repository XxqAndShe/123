import {Component, OnInit,AfterViewInit} from '@angular/core';
import {CertifyManageRequestVo} from "../../vo/certify-manage-request.vo";
import {API} from "../../../../share/lib/api/api";
import {CertifyManageService} from "../../service/certify-manage.service";
import { AreaService } from '../../../../share/app-service/area.service';
import { ShowOrHideMaskService } from '../../../../share/app-service/show-or-hide-mask.service';
import { RequestTokenService } from "../../../../share/app-service/request-token.service";
import {overlayPanelShow,overlayPanelHide} from "../../../../share/utils/gridUtil";

@Component({
  templateUrl: './certify-manage.component.html',
  styleUrls: [
    './certify-manage.component.css'
  ]
})

export class CertifyManageComponent implements OnInit,AfterViewInit{
	certifyManageRequestVo:CertifyManageRequestVo;

	columns:any[]=[];
	data:any;
	// data:any[]=[];
	selections:any[] = [];
	msg:any;
	areaCode1: any;
	msgs:any;
    loading:boolean;

	//输入框组件
	public temp:string;
	public suggestionResult:string[];//查询建议结果
    loadingIf:boolean = false;//加载中
	searchResult(event, type?) {
		////console.log(event.query)
		this.api.call("UserWorkerController.findMasterByNameOrAccount",{
			realName:event.query,
			mobile:""
		}).ok(json => {
			this.suggestionResult=json.result;
			////console.log("查询成功")

		}).fail(json => {
			this.showSuccess("error","提示","查询失败！");
			////console.log("查询失败")
			////console.log(json)

		})
	}

	searchResult2(event, type?) {
		this.api.call("UserWorkerController.findMasterByNameOrAccount",{
			realName:"",
			mobile:event.query
		}).ok(json => {
			this.suggestionResult=json.result;

		}).fail(json => {
			this.showSuccess("error","提示","查询失败！")

		})
	}
	constructor(public api:API,
				public certifyManageService:CertifyManageService,
				public areaService: AreaService,
				public mask: ShowOrHideMaskService,
				public RequestTokenService:RequestTokenService) {

	}

	ngOnInit():void{
		this.RequestTokenService.createToken();
		this.certifyManageRequestVo = new CertifyManageRequestVo();
		this.certifyManageRequestVo.typeOfService = "All";
		this.certifyManageRequestVo.valueAddService = "All";
		this.certifyManageRequestVo.auditStatus = "pendingAudit";
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
			field:"serviceArea",
			header:"服务区域",
			sortable:false,
			filter:true,
            link:true
		});
		this.columns.push({
			field:"auditStatus",
			header:"审核状态",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"idType",
			header:"证件类型",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"idNo",
			header:"证件号",
			sortable:false,
			filter:true,
			defaultTipsHidden:true,
            width:'150px'
		});
		this.columns.push({
			field:"accountType",
			header:"账户类型",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"accountName",
			header:"持卡人",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"bankAccount",
			header:"银行账号",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"bankName",
			header:"银行名称",
			sortable:false,
			filter:true
		});
		this.columns.push({
			field:"subBranchName",
			header:"支行名称",
			sortable:false,
			filter:true
		});
	}
    ngAfterViewInit(): void {
        this.initFancybox();
    }
	selectNum:number = 0;
	STC:boolean = false;//未添加联系人提示框
	NotThrough:boolean = false;//认证不通过弹窗，默认隐藏
	isThrough:boolean = false;//认证通过弹窗，默认隐藏
	isSure:boolean = false;//操作成功提示框
	NotPassTxT:string = '';//表单输入
	NotByReason:string = '';//确认和取消后对应的值


	/*点击认证不通过，触发函数*/
	CertificationNotThrough(){
		//判断单选
		if(this.selections.length>1){
			this.showSuccess("warn","提示","只能选择一条任务消息");
			return;
		}
		////console.log(this.selections);
		if(this.selections.length == 0){
			this.STC = true;
			this.mask.show();
		}else {
			this.NotThrough = true;
			this.mask.show();
		}

	}
   /*获得教的，给出提示*/
	fnfocus(){
		this.showSuccess("info","提示","字符在200以内且不为空")
	}
	/*失去焦点给出提示*/
	fnblur(value:string){
		////console.log(value);
        if(value.length == 0){
			this.showSuccess("error","提示","输入不能为空")
		}
	}
	/*点击认证不通过提示框确认按钮，触发函数*/
	itemsNotThrough:string = '请输入不通过原因';
		ConfirmNotThrough($event){
			if(this.NotPassTxT.length == 0){
				this.itemsNotThrough = '输入原因不能为空';
				this.showSuccess("error","提示","输入不能为空")
			}else {
				this.NotByReason = this.NotPassTxT;//确认对应为表单输入的值;确认后输出的理由为this.NotByReason
                this.certifyManageRequestVo.auditStatusOrder = "notPass";
                this.certifyManageRequestVo.authFailedReason = this.NotPassTxT;//确认对应为表单输入的值
				this.NotThrough = false;
				this.mask.hide();
                this.checkCertifiedInfo($event);
				this.showSuccess("success","提示","操作成功！")
			}
	}
	/*取消认证不通过*/
	CancelNotThrough(){
		this.NotThrough = false;
		this.mask.hide();
		// this.certifyManageRequestVo.authFailedReason = this.NotPassTxT = null;//取消对应为空
	}

	/*点击认证通过触发函数*/
	CertificationThrough(){
		//判断单选
		if(this.selections.length>1){
			this.showSuccess("warn","提示","只能选择一条任务消息");
			return;
		}
		if(this.selections.length == 0){
			this.STC = true;
			this.mask.show();
		}else {
			this.isThrough = true;
			this.mask.show();
		}
	}

	/*点击确认，关闭弹窗*/
	ConfirmThrough($event){
		this.certifyManageRequestVo.auditStatusOrder = "pass";
		this.certifyManageRequestVo.authFailedReason = null;
		this.checkCertifiedInfo($event);
		this.selectNum = 0;
		this.isThrough = false;
		this.showSuccess("success","提示","操作成功！");
		this.mask.hide()

	}

	/*点击取消，关闭弹窗*/
	CancelThrough(){
		this.isThrough = false;
		this.mask.hide();
	}

	/*关闭“操作成功”提示框*/
	ConfirmSure(){
		this.isSure = false;
		this.mask.hide();
	}
	/*点击删除按钮*/
	DeleteSymbol(){
		this.isSure = false;
		this.STC = false;
		this.NotThrough = false;
		this.isThrough = false;
		this.mask.hide();
	}
	/*确认“请添加联系人”*/
	SelectTheContact(){
		this.STC = false;
		this.mask.hide();
	}

	/*关闭列表上按钮*/
	DeleteSelectNum(){
		this.selectNum = 0;
        this.selections = [];
	}

	load($event):any{
		 this.api.call("masterAuthController.getTobeCertifiedList",$event,this.certifyManageRequestVo).ok(json=>{
		 	this.data = json.result;
		 }).fail(json=>{
		 	this.showSuccess("error","提示",json.error)
		 });
	}

    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('masterAuthController.getTobeCertifiedList', {
            first:0,
            rows:99999999
        }, this.certifyManageRequestVo)
            .ok(data => {
                // data.result.idNo =data.result.idNo?data.result.idNo.toString():data.result.idNo;
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
                this.showSuccess("error", "提示", "导出查询失败！");
            });
    }
	/**
	 * 查询操作
	 */
	doSearch($event) {
	    this.loading = true;
		this.api.call("masterAuthController.getTobeCertifiedList", $event, this.certifyManageRequestVo)
            .ok(json => {
				this.data=json.result;
				this.loading = false;
			})
            .fail(json => {
				this.showSuccess("error","提示",json.error);
                this.loading = false;
			});
		this.DeleteSelectNum();//查询清空数组
	}

	/*表格点击选中状态*/
	rowSelect($event):any{
		this.selections=$event;
		if(!$event[0]){
            this.selectNum = 0;
            return;
        }
		if (this.selections[0].auditStatus.includes("待审核")) {
			this.selectNum = this.selections.length;
		}else {
            this.selectNum = 0;
		}
            this.certifyManageRequestVo.masterId = $event[0].masterId;
            console.log(this.certifyManageRequestVo.masterId);
	}

	//服务区域浮动数据
	serviceAreas:any[];
	//身份证正面
	idHeads:any;
	//身份证反面
	idTails:any;
	//身份证手持照
	idHand:any;
	/**
	 * 选中的单元格显示详细数据
	 */
	cellOverEvent:any;
	cellMouseEnter($event,...restObj:any[]): any {
        overlayPanelShow($event, restObj, ['idNo']);
			this.cellOverEvent = JSON.stringify($event);
			// op2.toggle($event.originalEvent);
			this.idHeads = $event.row.idHeads;
			this.idTails = $event.row.idTails;
			this.idHand = $event.row.idHand;
	}
	cellMouseLeave($event,...restObj:any[]){
		overlayPanelHide($event,restObj,['idNo']);
	}
    /**
     * 服务区域弹窗
     */
    cellClick(cell,op1): void {
        //console.log(cell);
        if (cell.field == "serviceArea") {
            this.cellOverEvent = JSON.stringify(cell);
            //this.serviceAreas = cell.row.serviceAreaGrid;
            var masterId = cell.row.masterId;
            this.mask.show();
            this.loadingIf = true;
            this.serviceAreas = [];
            this.api.call("UserWorkerOperationeController.getUserWorkerAreaCity", {"masterId":masterId}).ok(data=>{
                this.serviceAreas = data.result ||[];
                this.mask.hide();
                this.loadingIf = false;
                op1.toggle(cell.originalEvent);
            }).fail(err=>{
                this.showSuccess("error", "提示", err.error);
            });
        }
    }
	//地址组件
	dataHandler: Function = this.areaService.selectBoxHandler();

	/**
	 * 改变认证状态
	*/
	checkCertifiedInfo($event):any {
		////console.log(this.certifyManageRequestVo);
		this.api.call("masterAuthController.checkCertifiedInfo",this.certifyManageRequestVo)
            .ok(json => {
				this.load($event);
			})
            .fail(json => {
				this.showSuccess("error","提示",json.error);
			});
	}

    /**
     * 身份证点击放大
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
	/*公共弹窗提示*/
	showSuccess(severity:string,summary:string,detail:string) {
		this.msgs = [];
		this.msgs.push({severity:severity, summary:summary, detail:detail});
	}

}
