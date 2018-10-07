import {Component, OnInit} from '@angular/core';
import {AbnormalQuantityText} from "../../../../../../../mock/abnormal-quantity-text";
import {API} from "app/share/lib/api/api";
import {ApiService} from "../../../../../../share/app-service/api-service";
import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {AbnormalSingleTrendVo} from "../vo/abnormal-statistics.vo";
import {TreeNode} from "primeng/components/common/api";
import {getMonth, getTwelveMonth} from "../../../../../../share/utils/DateUtil";

@Component({
    templateUrl: './abnormal-quantity-static.component.html',
    styleUrls: ['./abnormal-quantity-static.component.css']
})
export class AbnormalQuantityStaticComponent implements OnInit {

    constructor(public api: API,
                public apiService: ApiService) {
    }

    //nav插件引用设置
    navs = ["异常单量统计", "异常单量趋势", "异常处理统计"];
    navHrefs = [
        'modules/data-statistic/abnormal-statistics/abnormal-quantity-static',
        'modules/data-statistic/abnormal-statistics/abnormal-quantity-trend',
        'modules/data-statistic/abnormal-statistics/abnormal-deal-static'
    ];
    curIndex = 0;

    // 初始化列
    columns: any[] = [];
    msgs: any;
    public AbnormalSingleTrendVo: AbnormalSingleTrendVo;
    abnormalTotal: any = 0;
    abnormalSingleTrendResponse: any = {};
    twelveMonth:any;
    loading:boolean;

    //TODO 测试数据
    AbnormalQuantityData: any;

    //提示弹框
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{severity: severity, summary: summary, detail: detail}];
    }

    ngOnInit() {
        this.AbnormalQuantityData = AbnormalQuantityText;
        this.AbnormalSingleTrendVo = new AbnormalSingleTrendVo();
        this.AbnormalSingleTrendVo.stringTime = getTwelveMonth()[1];
        this.twelveMonth = getTwelveMonth();
        this.initColumns();

        this.apiService.report().call("abnormalNumberController.abnormalNumberFind", {"first": 0, "rows": 1000}, {})
            .ok(data => {
                var result = data.result || {};
                var content = result.content || [];
                this.abnormalTotal = content[0].abnormalTotal;
            })
            .fail(data => {
                if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            })
    }

    initColumns(): void {
        this.columns.push({
                field: "abnormalType",
                header: "异常类目",
                sortable: true,
            },
            {
                field: "abnormalNumbers",
                header: "异常单量",
                sortable: true,
            },
            {
                field: "subtractor",
                header: "与上月对比",
                sortable: true,
            })
    }

	//输入月份搜索异常单量
    doSearch($event): void {
        this.loading = true;

        if (!this.AbnormalSingleTrendVo.stringTime) {
            this.showSuccess("warn", "提示", "请输入需要统计的月份");
            return;
        }

        this.apiService.report().call("abnormalNumberController.abnormalNumberFind", {
            "first": 0,
            "rows": 1000
        }, this.AbnormalSingleTrendVo)
            .ok(data => {
                this.loading = false;
                var result = data.result || {};
                var content = result.content || [];
                this.abnormalTotal = content[0].abnormalTotal || 0;
                if (this.AbnormalSingleTrendVo.abnormalTypeId) {
                    this.abnormalSingleTrendResponse = result;

                    //将大于0的前面加上+号
                    for (let i = 0; i < content.length; i++) {
                    	if( content[i]["subtractor"] > 0 ){
                    		this.abnormalSingleTrendResponse.content[i]["subtractor"] = "+"+content[i]["subtractor"];
                    	}
			        }
                }
            })
            .fail(data => {
                this.loading = false;
                if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            })
    }

    abnormalTypes: TreeNode[] = [];
    abnormalTree: any[];
    //加载异常树
    load(event) {
        if (!this.abnormalTree)
            this.api.call("AbnormalTypeController.queryWholeAbnormalTypeTree").ok(json => {
                this.abnormalTree = json.result || [];
                event.children = this.abnormalTree;
                //加载首个异常信息
                this.AbnormalSingleTrendVo.abnormalTypeId = this.abnormalTree[0].data;


                this.apiService.report().call("abnormalNumberController.abnormalNumberFind", {
                	"first": 0,
					"rows": 1000
				}, this.AbnormalSingleTrendVo)
	            .ok(data => {
	                var result = data.result || {};
	                var content = result.content || [];
	                this.abnormalTotal = content[0].abnormalTotal;
	                this.abnormalSingleTrendResponse = result;
	                //将大于0的前面加上+号
                    for (let i = 0; i < content.length; i++) {
                    	if( content[i]["subtractor"] > 0 ){
                    		this.abnormalSingleTrendResponse.content[i]["subtractor"] = "+"+content[i]["subtractor"];
                    	}
			        }
	            })
	            .fail(data => {
	                if (data.code) {
	                    this.showSuccess("error", "提示", data.error);
	                } else {
	                    this.showSuccess("warn", "提示", "请联系管理员！");
	                }
	            })
            });
    }

	//点击异常类型加载异常单量
    nodeSelect(event) {
        this.AbnormalSingleTrendVo.abnormalTypeId = event.node.data;
        this.apiService.report().call("abnormalNumberController.abnormalNumberFind", {
            "first": 0,
            "rows": 1000
        }, this.AbnormalSingleTrendVo)
            .ok(data => {
                var result = data.result || {};
                var content = result.content || [];
                this.abnormalSingleTrendResponse = result;
                //将大于0的前面加上+号
                for (let i = 0; i < content.length; i++) {
                	if( content[i]["subtractor"] > 0 ){
                		this.abnormalSingleTrendResponse.content[i]["subtractor"] = "+"+content[i]["subtractor"];
                	}
		        }
            })
            .fail(data => {
                if (data.code) {
                    this.showSuccess("error", "提示", data.error);
                } else {
                    this.showSuccess("warn", "提示", "请联系管理员！");
                }
            })
    }
}
