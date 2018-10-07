import {Component, OnInit} from "@angular/core";
import {API} from "app/share/lib/api/api";
import {DatePipe} from "@angular/common";
import {doExportCSV} from "../share/utils/gridUtil";

// 天猫核销查询接口
const TMAIL_MSF_IDENTIFY_URL = "http://if.1ziton.com:8090/generalService/taobaoTop/makeOrder";

@Component({
    selector: 'app-msf-identify',
    templateUrl: './msf-identify.component.html',
    styleUrls: ['./msf-identify.component.css']
})
export class MsfIdentifyComponent implements OnInit {
    orderIds: string = '';
    msgs: any = [];
    data: any[] = [];
    columns = [{
        field: "orderSourceCode",
        header: '天猫单号',
        sortable: true
    },{
        field: "statusDesc",
        header: "核销状态",
        sortable: true
    },{
        field: "errorMessage",
        header: "核销内容",
        sortable: true
    },{
        field: "imgurls",
        header: "核销图片",
        sortable: true
    },{
        field: "identifyDate",
        header: "核销日期",
        sortable: true
    }];

    constructor(public api: API, public datePipe: DatePipe) {
    }

    ngOnInit() {
    }


    query() {
        this.data = [];
        let orderIds = this.orderIds || '';
        if (!orderIds) {
            return this.msgs.push({severity: 'info', summary: '提示', detail: '请填写天猫单号'})
        }
        orderIds = this.orderIds.trim().replace(/，/g, ',');
        orderIds = orderIds.replace(/\n/g, ',').replace(/,,/g, ',');
        let arr = orderIds.split(',');
        for (let id of arr) {
            this.request(id.trim());
        }
    }

    /**
     * 天猫单号
     * @param orderSourceCode
     */
    request(orderSourceCode) {

        let params = {
            "orderSourceCode": orderSourceCode,
            "serviceType": 0
        }
        // 天猫核销状态检查
        this.api.get(TMAIL_MSF_IDENTIFY_URL, params).then(res => {
            let obj = {
                "orderSourceCode": params['orderSourceCode']
            };
            let json = res.json();
            let query_response = json.tmall_msf_identify_status_query_response || {};
            let responseResult = query_response['result'] || '';
            if (!responseResult) {
                let msg = params['orderSourceCode'] + ' 核销状态查询失败';
                this.msgs.push({severity: 'warn', summary: '核销查询失败', detail: msg});
                return;
            }
            let si = responseResult.indexOf('={');
            let ei = responseResult.indexOf('},');
            let responseRes = responseResult.substring(si + 1, ei + 1);
            let resultJson = {};
            try {
                resultJson = JSON.parse(responseRes) || {};
            } catch (e) {
                //如果json解析错误，则可能是查询核销失败，此时返回接口提示的错误信息
                let si1 = responseResult.indexOf('errorMessage=');
                let ei2 = responseResult.indexOf(', gmtCurrentTime');
                if (ei2 < si1) {
                    ei2 = responseResult.indexOf(', errorCode')
                }
                let errorMessage = responseResult.substring(si1 + 13, ei2) || '核销状态查询失败！';
                if (errorMessage.indexOf('errorMessage') !== -1) {
                    obj['errorMessage'] = responseResult;
                } else {
                    obj['errorMessage'] = errorMessage;
                }
                this.data.push(obj);
                return;
            }
            obj['statusDesc'] = resultJson['statusDesc'];
            obj['identifyDate'] = resultJson['identifyDate'];
            obj['signTime'] = resultJson['signTime'];
            obj['imgurls'] = resultJson['imgurl'] || [];
            if (resultJson['identifyDate']) {
                let date = new Date(resultJson['identifyDate']);
                obj['identifyDate'] = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
            }
            this.data.push(obj);
            this.initFancybox();
        }).catch(err => {
            this.msgs.push({severity: 'error', summary: '接口调用失败', detail: err});
        });
    }

    doExport() {
        doExportCSV(this.data,this.columns,'天猫核销状态查询结果');
    }

    initFancybox() {
        setTimeout(() => {
            let data = this.data || [];
            for (let i = 0; i < data.length; ++i) {
                if ($("a[rel=fancybox_" + i + "]").length) {
                    $("a[rel=fancybox_" + i + "]").fancybox({
                        'titlePosition': 'over',
                        'cyclic': true,
                        'scrolling': 'yes',
                        'showNavArrows': false,
                        'loop': false,
                        'titleFormat': function (title, currentArray, currentIndex, currentOpts) {
                            return '<span id="fancybox-title-over">' + (currentIndex + 1) +
                                ' / ' + currentArray.length + (title.length ? '   ' + title : '') + '</span>';
                        }
                    })
                }
            }
        }, 800);
    }

}
