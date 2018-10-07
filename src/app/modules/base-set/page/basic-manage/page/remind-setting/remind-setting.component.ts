import { Component, OnInit } from '@angular/core';

import {API} from "../../../../../../share/lib/api/api";

@Component({
	templateUrl: './remind-setting.component.html',
	styleUrls: [
		'./remind-setting.component.css'
	]
})

export class RemindSettingComponent {
	// nav插件引用设置
	navs = ["基础设置表","异常基础资料","提醒设置"];
	/*超过时效数据绑定*/
	exceedP1:string;
	exceedP2:string;
	exceedP3:string;
	exceedP4:string;
	exceedP5:string;
	/*处理时间数据绑定*/
	remindP1:string;
	remindP2:string;
	remindP3:string;
	remindP4:string;
	remindP5:string;
	/*修改人*/
    modifierP1:string;
	modifierP2:string;
	modifierP3:string;
	modifierP4:string;
	modifierP5:string;
	/*修改时间*/
	modiTimeP1:string;
	modiTimeP2:string;
	modiTimeP3:string;
	modiTimeP4:string;
	modiTimeP5:string;
	/*唯一ID*/
	IdP1:string;
	IdP2:string;
	IdP3:string;
	IdP4:string;
	IdP5:string;
	msgs:any;//公共弹窗
	curIndex = 2;
	navHrefs = [
		'modules/base-set/basic-manage/basic-setting',
		'modules/base-set/basic-manage/exception-data',
		'modules/base-set/basic-manage/remind-setting'
	];
	
	//修改的提醒设置
	abnormalHandlingRemindUpdateVo: any = [{"altered":false}, {"altered":false}, {"altered":false}, {"altered":false}, {"altered":false}];
	
	constructor( public api: API) {
    }
    
	ngOnInit(): void{
		this.getAbnormalHandlingRemind();
	}

	/*公用提示组件*/
	showSuccess(severity:string,summary:string,detail:string) {
		this.msgs = [];
		this.msgs.push({severity:severity, summary:summary, detail:detail});
	}
/*超过时效判断*/
	aging(value:string){
		////console.log(value.length);
		if(value.length == 0){
			this.showSuccess("warn","提示","处理超时时效不能为空")
		}
	 }
	 /*处理时间判断*/
	remindeTime(value:string){
		if(value.length == 0){
			this.showSuccess("warn","提示","提醒时间不能为空")
		}
	};
	
	//获取数据
	getAbnormalHandlingRemind(): void {
		this.api.call('abnormalHandlingRemindController.abnormalHandlingRemingFind', {"first":0,"rows":5}, {})
		.ok(data => {
			for(let index of data.result.content){
				switch(index.grade){
					case "P1":
						this.exceedP1 = index.handlingTime;
						this.remindP1 = index.remindTime;
						this.modifierP1 = index.userName;
						this.modiTimeP1 = index.alterTime;
						this.IdP1 = index.id;
						break;
					case "P2":
						this.exceedP2 = index.handlingTime;
						this.remindP2 = index.remindTime;
						this.modifierP2 = index.userName;
						this.modiTimeP2 = index.alterTime;
						this.IdP2 = index.id;
						break;
					case "P3":
						this.exceedP3 = index.handlingTime;
						this.remindP3 = index.remindTime;
						this.modifierP3 = index.userName;
						this.modiTimeP3 = index.alterTime;
						this.IdP3 = index.id;
						break;
					case "P4":
						this.exceedP4 = index.handlingTime;
						this.remindP4 = index.remindTime;
						this.modifierP4 = index.userName;
						this.modiTimeP4 = index.alterTime;
						this.IdP4 = index.id;
						break;
					case "P5":
						this.exceedP5 = index.handlingTime;
						this.remindP5 = index.remindTime;
						this.modifierP5 = index.userName;
						this.modiTimeP5 = index.alterTime;
						this.IdP5 = index.id;
						break;
				}
			}
		})
		.fail(data => {
			if(data.code){
				this.showSuccess("error","提示",data.error)
			}else{
				this.showSuccess("error","提示","操作失败, 请联系管理员!")
			}
		})
	}
	
	//判断是否修改
	select(grade): void {
		switch(grade){
			case "P1":
				this.abnormalHandlingRemindUpdateVo[0] = {altered: true, handlingTime: this.exceedP1, remindTime: this.remindP1, id: this.IdP1, grade: "P1"};
				break;
			case "P2":
				this.abnormalHandlingRemindUpdateVo[1] = {altered: true, handlingTime: this.exceedP2, remindTime: this.remindP2, id: this.IdP2, grade: "P2"};
				break;
			case "P3":
				this.abnormalHandlingRemindUpdateVo[2] = {altered: true, handlingTime: this.exceedP3, remindTime: this.remindP3, id: this.IdP3, grade: "P3"};
				break;
			case "P4":
				this.abnormalHandlingRemindUpdateVo[3] = {altered: true, handlingTime: this.exceedP4, remindTime: this.remindP4, id: this.IdP4, grade: "P4"};
				break;
			case "P5":
				this.abnormalHandlingRemindUpdateVo[4] = {altered: true, handlingTime: this.exceedP5, remindTime: this.remindP5, id: this.IdP5, grade: "P5"};
				break;
		}
	}
	
	/*保存*/
	preservation(){
		if(this.exceedP1 == undefined||this.exceedP1 == ""||this.exceedP2 == undefined||this.exceedP2 == ""||this.exceedP3 == undefined||this.exceedP3 == ""||
			this.exceedP4 == undefined||this.exceedP4 == ""||this.exceedP5 == undefined||this.exceedP5 == ""){
			this.showSuccess("warn","提示","处理超时时效不能为空")
		}else if(this.remindP1 == undefined||this.remindP1 == ""||this.remindP2 == undefined||this.remindP2 == ""||
			this.remindP3 == undefined||this.remindP3 == ""||this.remindP4 == undefined||this.remindP4 == ""||this.remindP5 == undefined||this.remindP5 == ""){
			this.showSuccess("warn","提示","提醒时间不能为空")
		}else {
			////console.log(this.abnormalHandlingRemindUpdateVo);
			this.api.call('abnormalHandlingRemindController.abnormalHandlingRemingUpdate', {vAbnormalHandlingReminds: this.abnormalHandlingRemindUpdateVo})
			.ok(data => {
				for(let index of data.result){
					if(index.altered == true){
						switch(index.grade){
							case "P1":
								this.modifierP1 = index.userName;
								this.modiTimeP1 = index.alterTime;
								this.IdP1 = index.id;
								break;
							case "P2":
								this.modifierP2 = index.userName;
								this.modiTimeP2 = index.alterTime;
								this.IdP2 = index.id;
								break;
							case "P3":
								this.modifierP3 = index.userName;
								this.modiTimeP3 = index.alterTime;
								this.IdP3 = index.id;
								break;
							case "P4":
								this.modifierP4 = index.userName;
								this.modiTimeP4 = index.alterTime;
								this.IdP4 = index.id;
								break;
							case "P5":
								this.modifierP5 = index.userName;
								this.modiTimeP5 = index.alterTime;
								this.IdP5 = index.id;
								break;
						}
					}
				}
				this.abnormalHandlingRemindUpdateVo = [{"altered":false}, {"altered":false}, {"altered":false}, {"altered":false}, {"altered":false}];
	            this.showSuccess("success","提示","操作成功！")
	        })
	        .fail(data =>{
	            if (data.code) {
	                this.showSuccess("error","提示",data.error)
	            } else {
	                this.showSuccess("error","提示","操作失败, 请联系管理员!")
	            }
	        })
			
		}
	}
}
