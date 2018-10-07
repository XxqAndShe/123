import {Component, OnInit} from "@angular/core";
import {API} from "../../../../share/lib/api/api";
import {DatepickerService} from "../../../../share/app-service/datepicker.service";
import {MenuItem} from "primeng/components/common/api";
@Component({
    templateUrl: "./demo-test.component.html",
    styleUrls: ["./demo-test.component.css"]
})
export class DemoTestComponent implements OnInit {

    /*
     *
     *  取消按钮*/
    // 日期组件
    Date: string;
    zh: any = this.datepickerService.locale();
    inputStyle: any = { // 输入框样式
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";

    constructor(public api: API,
                public datepickerService: DatepickerService) {
    }

    url: string = "http://localhost:4200/data/test.json";

    public testAPI(): any {

        this.api.call("schoolApiController.addClazz", {
            name: "三年一班"
        }).ok(data => {
            ////console.log(data);
        }).fail(data => {
            console.error(data);
        });
    }

    public items: MenuItem[];

    ngOnInit() {
        this.items = [{
            label: '功能组件',
            items: [
                {label: '表格ui-grid', icon: 'fa-file', url: '/modules/demo/grid-test'},
                {label: '选择弹窗select-box', icon: 'fa-file', url: '/modules/demo/select-box-test'},
                {label: '确认提示confirm', icon: 'fa-file', url: '/modules/demo/confirm-dialog'}
            ]
            },
            {
                label: '业务组件',
                items: [
                    {label: '区域选择', icon: 'fa-file', url: '/modules/demo/area-component-test'},
                    {label: '区域树', icon: 'fa-file', url: '/modules/demo/tree-test'},
                    {label: '字典选择', icon: 'fa-file', url: '/modules/demo/area-component-test'},
                    {label: '开单网点', icon: 'fa-file', url: '/modules/demo/department-select-test'},
                    {label: '异常类型选择', icon: 'fa-file', url: '/modules/demo/exception-select-test'},
                    {label: '发货人选择', icon: 'fa-file', url: '/modules/demo/shipper-select-test'},
                    {label: '收货人选择', icon: 'fa-file', url: '/modules/demo/cnee-select-test'},
                    {label: '师傅名称/师傅账号', icon: 'fa-file', url: '/modules/demo/master-select-test'},
                    {label: '维修品名', icon: 'fa-file', url: '/modules/demo/repair-goods-select-test'},
                    {label: '品名', icon: 'fa-file', url: '/modules/demo/good-select-test'}
                ]
            },
            {
                label: '附件组件',
                items: [
                    {label: '图片&文件上传', icon: 'fa-file', url: '/modules/demo/pic-upload-test'}
                ]
            },
            {
                label: '图表组件',
                items: [
                    {label: 'Echarts指令', icon: 'fa-file', url: '/modules/demo/echarts-select-test'}
                ]
            }];
    }

    text: string;

    results: string[];

    search(event) {
        if (event.query.startsWith("a")) {
            this.results = ["aaa", "aab", "aac"];
        }
        else if (event.query.startsWith("b")) {
            this.results = ["bbb", "bba", "bbc"];
        }
    }

}
