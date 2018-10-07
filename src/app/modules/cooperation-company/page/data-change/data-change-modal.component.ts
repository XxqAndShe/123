import {Component, EventEmitter, Output, Input, OnInit} from "@angular/core";
import {DataChangeModalResponseVo} from "../../vo/data-change-modal-response.vo";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {DataChangeModalRequestVo} from "../../vo/data-change-modal-request.vo";
import {API} from "../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../share/app-service/request-token.service";

@Component({
	selector: 'data-change-modal',
	templateUrl: './data-change-modal.component.html',
	styleUrls: [
		'./data-change-modal.component.css'
	]
})

export class DataChangeModalComponent implements OnInit{
	@Input() dataChangeAfterModalResponseVo:DataChangeModalResponseVo;
	@Input() dataChangeBeforeModalResponseVo:DataChangeModalResponseVo;
	@Input() dataChangeModalRequestVo:DataChangeModalRequestVo;
	constructor(public mask:ShowOrHideMaskService,public api:API,
				public RequestTokenService:RequestTokenService){

	}

	ngOnInit(): void {
		this.RequestTokenService.createToken();
		// ////console.log("test"+this.dataChangeAfterModalResponseVo);
		// ////console.log("test"+this.dataChangeBeforeModalResponseVo);
	}
	title = '师傅资料审核';
	tip = '待审核资料';
	isAudit = true;

	@Input() moduleInfo:any;
	@Output() closeModal = new EventEmitter<boolean>();
	@Output() saveModal = new EventEmitter<boolean>();

	close() {
		this.closeModal.emit(false);

	}
	/*审核未通过*/
	//失去焦点判断
	notthro:boolean = false;
	fnNot(value:string){
		if(value.length == 0){
			this.itemsNotThrough = '输入原因不能为空';
		}else {
			this.notthro = true;
		}
	}
	msgs:any;//公用提示框
	NotThrough:boolean = false;
	NotPassTxT:string;//表单输入
	NotByReason:string;//确认和取消后对应的值
	notThrough(){
		this.NotThrough = true;
		this.mask.show();
	}
	itemsNotThrough:string = '请输入不通过原因(0/200)';
    loading:boolean;
	ConfirmNotThrough(){
	    this.loading = true;
		if(this.NotPassTxT !=undefined && this.NotPassTxT !=""){
			this.NotByReason = this.NotPassTxT;//确认对应为表单输入的值;确认后输出的理由为this.NotByReason
			this.NotThrough = false;
			this.dataChangeModalRequestVo.auditStatus = "notPass";
			this.dataChangeModalRequestVo.auditRemark = this.NotByReason;
			this.checkInfoChange();
			this.mask.hide();
		}else {
			this.showSuccess("warn","提示","原因不能为空");
		}
	}
	/*取消不通过*/
	CancelNotThrough(){
		this.NotThrough = false;
		this.mask.hide();
	}
/*操作成功*/

	through(){
		this.dataChangeModalRequestVo.auditStatus = "pass";
		this.checkInfoChange();
	}


	checkInfoChange():any {

		this.api.call("MasterInfoChangeController.checkInfoChange",this.dataChangeModalRequestVo).ok(data=>{
			this.saveModal.emit(false);
			this.loading = false;
		}).fail(err=>{
			this.showSuccess("error","提示",err.error);
			this.loading = false;
		 });
	}
	/*公用提示组件*/
	showSuccess(severity:string,summary:string,detail:string) {
		this.msgs = [];
		this.msgs.push({severity:severity, summary:summary, detail:detail});
	}
}
