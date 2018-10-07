import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import {ArbitrationWinVo} from "../../../../modules/sale-center/page/arbitration-handle/vo/arbitration-win-reuqest.vo";
import {Responsible} from "../../../../modules/sale-center/page/arbitration-handle/share/vo/arbitration-responsible-vo";
import {API} from "../../../lib/api/api";
import {DragBoxService} from "../../../app-service/drag-box.service";
@Component({
    selector: 'view-arbitration-result-win',
    templateUrl: './view-arbitration-result.component.html',
    styleUrls: [
        './view-arbitration-result.component.css'
    ]
})

export class ViewArbitrationResultWinComponent implements OnInit {
    @Input() selections;//弹窗中异常信息传入的数据
    @Input() selectLineInfo;//模块传入的数据
    /**
     * 罗有利 2017-03-10
     * 仲裁处理接收参数
     */
    arbitrationWinVo: ArbitrationWinVo;
    /**
     * 罗有利 2017-03-11
     * 保存责任方，以便获取责任方参数
     */
    arbinfo: any = {};

    /**
     * 接收责任方主体
     * @type {{}}
     */
    arbsubject: any[] = [];

    /**
     * 接收多个责任方数据
     * @type {{}}
     */
    responsible: Responsible;
    responsibles: any[] = [];
    msgs: any;//公共提示
    testLabel: string="";
    latestFollow:any[]=[];
    historyFollow:any[]=[];

    constructor(public api: API,public drag: DragBoxService) { }

    data: any;
    ngOnInit() {
        this.arbitrationWinVo = new ArbitrationWinVo();
        this.responsible = new Responsible();
        this.arbsubject = [];
        let resObj = { responsible: this.responsible, arbsubject: this.arbsubject };
        this.responsibles.push(resObj);
        this.initColumns();
        this.history();
    }
    isshowContent = [true, false, false, false];
    changeContent(index) {
        for (var i = 0; i < this.isshowContent.length; i++) {
            this.isshowContent[i] = false;
        }
        this.isshowContent[index] = true;
    }
    //点击×，关闭弹框
    @Output() hideWin = new EventEmitter<boolean>();
    hideModal() {
        this.hideWin.emit(false);
    }
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }
    //历史仲裁修改表格数据
    columns: any[] = [];
    initColumns(): void {
        this.columns.push({
            field: 'vWaybill.waybillId',
            header: '运单号'
        });
        this.columns.push({
            field: 'wayAbnoBigType',
            header: '异常类型'
        });
        this.columns.push({
            field: 'wayAbnoSmallType',
            header: '异常小类'
        });
        this.columns.push({
            field: 'arbResponsible',
            header: '仲裁责任方'
        });
        this.columns.push({
            field: 'arbSubject',
            header: '仲裁责任方主体'
        });
        this.columns.push({
            field: 'abnoBigType',
            header: '仲裁异常类型'
        });
        this.columns.push({
            field: 'abnoSmallType',
            header: '仲裁异常小类'
        });
        this.columns.push({
            field: 'arborMan',
            header: '仲裁人'
        });
        this.columns.push({
            field: 'dateCreated',
            header: '仲裁时间'
        })
    }

    /**
     * 加载仲裁修改历史记录
     * @param $event
     */
    load($event): any {
        this.arbitrationWinVo.abID = this.selectLineInfo && this.selectLineInfo.id?this.selectLineInfo.id:'';
        this.api.call("ArbitrationController.queryHistoryArbitration", $event, {
            abId: this.arbitrationWinVo.abID
        }).ok(json => {
            this.data = json.result;
        });
    }

    history() {
        if(this.selectLineInfo.id){
            this.arbitrationWinVo.abID = this.selectLineInfo.id;
            this.api.call("TrackController.findAbnormalTrackInfo", { "first": 0, "rows": 100 }, {
                abnormalId: this.arbitrationWinVo.abID
            }).ok(json => {
                let count = 0;
                let result: any = json.result || [];
                result.forEach((follow) => {
                    count++;
                    if (count == 1) {
                        this.latestFollow.push({
                            followContent: follow["remark"],
                            follower: follow["operator"],
                            followTime: follow["trackedTime"]
                        });
                    } else {
                        this.historyFollow.push({
                            followContent: follow["remark"],
                            follower: follow["operator"],
                            followTime: follow["trackedTime"]
                        });
                    }
                });
            }).fail(err => {

            });
        }
    }
}
