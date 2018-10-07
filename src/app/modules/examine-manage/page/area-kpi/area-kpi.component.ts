import { Component, OnInit } from '@angular/core';

import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import { AreaKpiVo } from '../vo/area-kpi.vo';
import {ApiService} from "../../../../share/app-service/api-service";
@Component({
	templateUrl: './area-kpi.component.html',
	styleUrls: [
		'./area-kpi.component.css'
	]
})

export class AreaKpiComponent implements OnInit {
	startDate:any;
	endDate:any;
    msgs: any;
	isSelectedArr1 = new Array();  //每行数据是否选中的布尔值数组
	selectNum1 = 0;  //表格选中个数
	allSelect1 = 0;  //表格总checkbox的状态，0为未选择，1为选择部分，2为全选
	isSelectedArr2 = new Array();  //每行数据是否选中的布尔值数组
	selectNum2 = 0;  //表格选中个数
	allSelect2 = 0;  //表格总checkbox的状态，0为未选择，1为选择部分，2为全选
	areaKpiVo: AreaKpiVo;

    orderPromptness:any;//预约
    installPromptness:any;//安装
    hourPromptness:any;//48小时安装
    damageRate:any;//破损率
    loading:any;


    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

	billSource: any = 'All';//运单来源

	// 日历组件
	constructor(public datePickerService: DatepickerService,public apiService: ApiService){}
	zh: any=this.datePickerService.locale();
	inputStyle: any={ // 输入框样式
		// 'width': 95+'px',
		'height': 30+'px',
		'textAlign': 'left',
		'cursor': 'default'
	};
	yearRange: string="2000:2020";


	bigAreas: any[] = [];

	smallAreas: any[] = [];

	ngOnInit(): void {
		for (let i = this.bigAreas.length-1; i >= 0 ; i--) {
			this.isSelectedArr1[i] = false;
		}
		for (let i = this.smallAreas.length-1; i >= 0 ; i--) {
			this.isSelectedArr2[i] = false;
		}

		this.areaKpiVo = new AreaKpiVo();

		this.endDate = new Date();
		this.startDate = new Date(new Date().getTime() - 24*60*60*1000);

        this.doSearch();

	}
		//选择某一行
	rowSelect(index: number, areaIndex: number) {  //未完待续
		if(areaIndex === 1) {
			if(this.isSelectedArr1[index] === true) {
				this.selectNum1--;
			}else {
				this.selectNum1++;
			}
			this.isSelectedArr1[index] = !this.isSelectedArr1[index];
			if(this.selectNum1 === 0 ) {
				this.allSelect1 = 0;
			}else if(this.selectNum1 !== this.bigAreas.length) {
				this.allSelect1 = 1;
			}else {
				this.allSelect1 = 2;
			}
		}else {
			if(this.isSelectedArr2[index] === true) {
				this.selectNum2--;
			}else {
				this.selectNum2++;
			}
			this.isSelectedArr2[index] = !this.isSelectedArr2[index];
			if(this.selectNum2 === 0 ) {
				this.allSelect2 = 0;
			}else if(this.selectNum2 !== this.smallAreas.length) {
				this.allSelect2 = 1;
			}else {
				this.allSelect2 = 2;
			}
		}


	}

	//全选或者全不选
	toggleAllSelect(areaIndex: number) {
		if(areaIndex === 1) {
			let fillValue = false;
			if(this.allSelect1 === 1 || this.allSelect1 === 2) {
				this.allSelect1 = 0;
				fillValue = false;
				this.selectNum1 = 0;
			}else {
				this.allSelect1 = 2;
				fillValue = true;
				this.selectNum1 = this.bigAreas.length;
			}

			for(let i = this.isSelectedArr1.length-1; i>=0; i--) {
				this.isSelectedArr1[i] = fillValue;
			}
		}else {
			let fillValue = false;
			if(this.allSelect2 === 1 || this.allSelect2 === 2) {
				this.allSelect2 = 0;
				fillValue = false;
				this.selectNum2 = 0;
			}else {
				this.allSelect2 = 2;
				fillValue = true;
				this.selectNum2 = this.smallAreas.length;
			}

			for(let i = this.isSelectedArr2.length-1; i>=0; i--) {
				this.isSelectedArr2[i] = fillValue;
			}
		}
	}

	//选择查询时间判断是否大于当前时间
    onSelect(value){
        if(value > new Date()){
            this.showSuccess("warn", "提示", "查询时间不能大于当前系统时间");
            return;
        }
    }

	//查询方法
	doSearch() {
       this.loading = true;

        if (!this.startDate || !this.endDate) {
            this.showSuccess("warn", "提示", "请输入查询时间");
            return;
        }
        if(this.startDate > new Date() || this.endDate > new Date()){
            this.showSuccess("warn", "提示", "查询时间不能大于当前系统时间");
            return;
        }

        this.apiService.report().call("QueryAreaKPIController.findAreaKPIData",{
            "startDate" : this.startDate,
            "endDate" : this.endDate,
            "billSource" : this.billSource
        }).ok(json => {
            this.loading = false;
            var result = json.result || {};
            // var result = {};
            console.log(JSON.stringify(result)=="{}");

            if(JSON.stringify(result)!="{}") {
                //预约
                if (result.reservationRateSum == 0) {
                    this.areaKpiVo.orderPromptness = '0%';
                } else {
                    this.areaKpiVo.orderPromptness = Math.round(result.reservationRateValid / result.reservationRateSum * 10000) / 100.00 + "%";
                }
                this.areaKpiVo.orderIntime = String(result.reservationRateValid);
                this.areaKpiVo.orderTotal = String(result.reservationRateSum);
                if (result.kpiSum == 0) {
                    this.areaKpiVo.orderPromptnessQuota = '0%';
                    this.areaKpiVo.installPromptnessQuota = '0%';
                    this.areaKpiVo.hourPromptnessQuota = '0%';
                    this.areaKpiVo.damageRateQuota = '0%';
                } else {
                    this.areaKpiVo.orderPromptnessQuota = Math.round(result.reservationRateSum / result.kpiSum * 10000) / 100.00 + "%";
                    this.areaKpiVo.installPromptnessQuota = Math.round(result.installationRateSum / result.kpiSum * 10000) / 100.00 + "%";
                    this.areaKpiVo.hourPromptnessQuota = Math.round(result.installationCompletionRate48Sum / result.kpiSum * 10000) / 100.00 + "%";
                    this.areaKpiVo.damageRateQuota = Math.round(result.damageRateSum / result.kpiSum * 10000) / 100.00 + "%";
                }

                //安装
                if (result.installationRateSum == 0) {
                    this.areaKpiVo.installPromptness = '0%';
                } else {
                    this.areaKpiVo.installPromptness = Math.round(result.installationRateValid / result.installationRateSum * 10000) / 100.00 + "%";
                }
                this.areaKpiVo.installIntime = String(result.installationRateValid);
                this.areaKpiVo.installTotal = String(result.installationRateSum);

                //48小时安装
                if (result.installationCompletionRate48Sum == 0) {
                    this.areaKpiVo.hourPromptness = '0%';
                } else {
                    this.areaKpiVo.hourPromptness = Math.round(result.installationCompletionRate48Valid / result.installationCompletionRate48Sum * 10000) / 100.00 + "%";
                }
                this.areaKpiVo.hourInstallIntime = String(result.installationCompletionRate48Valid);
                this.areaKpiVo.hourInstallTotal = String(result.installationCompletionRate48Sum);

                if (result.damageRateSum == 0) {
                    this.areaKpiVo.damageRate = '0%';
                } else {
                    this.areaKpiVo.damageRate = Math.round(result.damageRateValid / result.damageRateSum * 10000) / 100.00 + "%";
                }
                this.areaKpiVo.damageNum = String(result.damageRateValid);
                this.areaKpiVo.damageTotal = String(result.damageRateSum);
            }
        }).fail(data => {
            this.loading = false;
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                this.showSuccess("warn", "提示", "请联系管理员！");
            }
        });


        this.apiService.report().call("QueryAreaKPIController.findLarAreaData",{"first": 0, "rows": 10},{
            "startDate" : this.startDate,
            "endDate" : this.endDate,
            "billSource" : this.billSource
        })
            .ok(data => {
                this.bigAreas = [];
                console.log("------------------findLarAreaData-----------------------");
                var result = data.result || {};
                var content = result.content || [];
                console.log(content);
                console.log("------------------findLarAreaData-----------------------");

                if(content.length != 0){
                    content.forEach((larAreaData) => {
                        if (larAreaData.reservationRateSum == 0) {
                            this.orderPromptness = '0%';
                        } else {
                            this.orderPromptness = Math.round(larAreaData.reservationRateValid / larAreaData.reservationRateSum * 10000) / 100.00 + "%";
                        }
                        if (larAreaData.installationRateSum == 0) {
                            this.installPromptness = '0%';
                        } else {
                            this.installPromptness = Math.round(larAreaData.installationRateValid / larAreaData.installationRateSum * 10000) / 100.00 + "%";
                        }
                        if (larAreaData.installationCompletionRate48Sum == 0) {
                            this.hourPromptness = '0%';
                        } else {
                            this.hourPromptness = Math.round(larAreaData.installationCompletionRate48Valid / larAreaData.installationCompletionRate48Sum * 10000) / 100.00 + "%";
                        }
                        if (larAreaData.damageRateSum == 0) {
                            this.damageRate = '0%';
                        } else {
                            this.damageRate = Math.round(larAreaData.damageRateValid / larAreaData.damageRateSum * 10000) / 100.00 + "%";
                        }
                        this.bigAreas.push({
                            regionLarge: larAreaData.regionLarge,
                            realName: larAreaData.realName,
                            reservationRateValid: larAreaData.reservationRateValid,
                            reservationRateSum: larAreaData.reservationRateSum,
                            orderPromptness: this.orderPromptness,
                            installationRateValid: larAreaData.installationRateValid,
                            installationRateSum: larAreaData.installationRateSum,
                            installPromptness: this.installPromptness,
                            installationCompletionRate48Valid: larAreaData.installationCompletionRate48Valid,
                            installationCompletionRate48Sum: larAreaData.installationCompletionRate48Sum,
                            hourPromptness: this.hourPromptness,
                            damageRateValid: larAreaData.damageRateValid,
                            damageRateSum: larAreaData.damageRateSum,
                            damageRate: this.damageRate,
                            kPISumPer : larAreaData.kPISumPer,
                            rank : larAreaData.rank
                        });
                    });
                }
            })
            .fail(data => {
                if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            });

        this.apiService.report().call("QueryAreaKPIController.findSmallAreaData",{"first": 0, "rows": 10},{
            "startDate" : this.startDate,
            "endDate" : this.endDate,
            "billSource" : this.billSource
        })
            .ok(data => {
                this.smallAreas = [];
                console.log("------------------findSmallAreaData-----------------------");
                var result = data.result || {};
                var content = result.content || [];
                console.log(content);
                console.log("------------------findSmallAreaData-----------------------");

                if(content.length != 0){
                    content.forEach((smallAreaData) => {
                        if (smallAreaData.reservationRateSum == 0) {
                            this.orderPromptness = '0%';
                        } else {
                            this.orderPromptness = Math.round(smallAreaData.reservationRateValid / smallAreaData.reservationRateSum * 10000) / 100.00 + "%";
                        }
                        if (smallAreaData.installationRateSum == 0) {
                            this.installPromptness = '0%';
                        } else {
                            this.installPromptness = Math.round(smallAreaData.installationRateValid / smallAreaData.installationRateSum * 10000) / 100.00 + "%";
                        }
                        if (smallAreaData.installationCompletionRate48Sum == 0) {
                            this.hourPromptness = '0%';
                        } else {
                            this.hourPromptness = Math.round(smallAreaData.installationCompletionRate48Valid / smallAreaData.installationCompletionRate48Sum * 10000) / 100.00 + "%";
                        }
                        if (smallAreaData.damageRateSum == 0) {
                            this.damageRate = '0%';
                        } else {
                            this.damageRate = Math.round(smallAreaData.damageRateValid / smallAreaData.damageRateSum * 10000) / 100.00 + "%";
                        }
                        this.smallAreas.push({
                            regionSmallge: smallAreaData.regionSmallge,
                            realName: smallAreaData.realName,
                            reservationRateValid: smallAreaData.reservationRateValid,
                            reservationRateSum: smallAreaData.reservationRateSum,
                            orderPromptness: this.orderPromptness,
                            installationRateValid: smallAreaData.installationRateValid,
                            installationRateSum: smallAreaData.installationRateSum,
                            installPromptness: this.installPromptness,
                            installationCompletionRate48Valid: smallAreaData.installationCompletionRate48Valid,
                            installationCompletionRate48Sum: smallAreaData.installationCompletionRate48Sum,
                            hourPromptness: this.hourPromptness,
                            damageRateValid: smallAreaData.damageRateValid,
                            damageRateSum: smallAreaData.damageRateSum,
                            damageRate: this.damageRate,
                            kPISumPer : smallAreaData.kPISumPer,
                            rank : smallAreaData.rank
                        });
                    });
                }
            })
            .fail(data => {
                if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            });
	}
}
