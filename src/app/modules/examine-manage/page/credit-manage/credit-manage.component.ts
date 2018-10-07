import { Component, OnInit } from '@angular/core';
import { modalAnimation } from "../../../../share/animation/modalAnimation.animation";
import {API} from "../../../../share/lib/api/api";
import {ApiService} from "../../../../share/app-service/api-service";

@Component({
	templateUrl: './credit-manage.component.html',
	styleUrls: [
		'./credit-manage.component.css'
	],
	animations: [
		modalAnimation
	]
})

export class CreditManageComponent implements OnInit {
	selectNum = 0;  //表格选中个数
	modalState: string = 'out';
	masterName: string;//顶部查询字段
	masterId: any;//顶部查询字段
	selectionRow;// 选中的行
	master = {};//详情

	componentVo: any = {};
	msgs:any;//弹窗提示
    loading:boolean;

	//输入框组件
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

	columns: any[]=[];
	initColumns():void{
		this.columns.push({
			field: 'realName',
			header: '安装师傅',
			sortable: true,
		}),
		this.columns.push({
			field: 'mobile',
			header: '安装师傅账号',
			sortable: true,
		}),
		this.columns.push({
			field: 'creditLevel',
			header: '信用级别',
			sortable: true,
		}),
		this.columns.push({
			field: 'creditPoints',
			header: '信用分数',
			sortable: true,
		}),
		this.columns.push({
			field: 'maxOrder',
			header: '最大接单数',
			sortable: true,
		}),
		this.columns.push({
			field: 'teamAmount',
			header: '团队人数',
			sortable: true,
		}),
		this.columns.push({
			field: 'carWeight',
			header: '仓库面积',
			sortable: true,
		}),
		this.columns.push({
			field: 'warehouseAddress',
			header: '仓库地址',
			sortable: true,
		})
	}

	constructor(public api: API,
				public apiService: ApiService) {}

	ngOnInit(): void {
		this.initColumns();
	}

	displayModal() {
		this.modalState = 'in';
	}
	closeModal() {
		this.modalState = 'out';
	}

	data: any;
	load(page){
		this.findComponent(page);
	}
	//查询所有师傅
	findComponent(page){
	    this.loading = true;
		this.apiService.report().call("creditManagementController.creditManagementFind", page, this.componentVo)
	      .ok(data => {
	        var result = data.result || {};
	        this.data = result;
	        this.loading = false;
	      })
	      .fail(data => {
	          this.loading = false;
	        if (data.code) {
	          this.showSuccess("error","提示",data.error)
	        } else {
				this.showSuccess("error","提示","请联系管理员")

	        }
	      })
	}

	//查询师傅用户信用详情
	rowSelect(row){
		this.selectNum = 1;
		this.selectionRow = row[0] || {};
		//查询详情
		this.apiService.report().call("creditManagementController.findCreditManagementDetail", {
        	"userWorkerId":this.selectionRow.id
        })
        .ok(data => {

			this.master = {
				name: this.selectionRow.masterName,
				creditLevel: data.result.creditRating,
				creditScore: data.result.creditScore,
				tableData: [
					{
						name: '预约及时率',
						data: [
							'笔数', '占比', '分数',
							'及时', data.result.reservation.timelyQuantity, data.result.reservation.timelyAccountingFor+"%", data.result.reservation.timelyFraction,
							'超时', data.result.reservation.timeOutQuantity, data.result.reservation.timeOutAccountingFor+'%', 0,
							'得分', data.result.reservation.timelyQuantity + data.result.reservation.timeOutQuantity, '', data.result.reservation.timelyFraction
						]
					},
					{
						name: '安装及时率',
						data: [
							'笔数', '占比', '分数',
							'及时', data.result.installationRate.timelyQuantity, data.result.installationRate.timelyAccountingFor+"%", data.result.installationRate.timelyFraction,
							'超时', data.result.installationRate.timeOutQuantity, data.result.installationRate.timeOutAccountingFor+'%', 0,
							'得分', data.result.installationRate.timelyQuantity + data.result.installationRate.timeOutQuantity, '', data.result.installationRate.timelyFraction
						]
					},
					{
						name: '48小时安装完成率',
						data: [
							'笔数', '占比', '分数',
							'及时', data.result.installationCompletion48.timelyQuantity, data.result.installationCompletion48.timelyAccountingFor+"%", data.result.installationCompletion48.timelyFraction,
							'超时', data.result.installationCompletion48.timeOutQuantity, data.result.installationCompletion48.timeOutAccountingFor+'%', 0,
							'得分', data.result.installationCompletion48.timelyQuantity + data.result.installationCompletion48.timeOutQuantity, '', data.result.installationCompletion48.timelyFraction
						]
					},
					{
						name: '破损率',
						data: [
							'笔数', '占比', '分数',
							'破损', data.result.damaged.timeOutQuantity, data.result.damaged.timeOutAccountingFor+"%", data.result.damaged.timelyFraction,
							'完好', data.result.damaged.timelyQuantity, data.result.damaged.timelyAccountingFor+'%', 0,
							'得分', data.result.damaged.timeOutQuantity + data.result.damaged.timelyQuantity, '', data.result.damaged.timelyFraction
						]
					}
				]
			}


        })
        .fail(data =>{
        	console.error(data);
            if (data.code) {
				this.showSuccess("error","提示",data.error);
            } else {
				this.showSuccess("error","提示","查询失败，请联系管理员！");
            }
        })
	}
	/*公共弹窗提示*/
	showSuccess(severity: string, summary: string, detail: string) {
		this.msgs = [];
		this.msgs.push({severity: severity, summary: summary, detail: detail});
	}

}
