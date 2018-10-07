import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ShowOrHideMaskService } from "../../../../../share/app-service/show-or-hide-mask.service";
import { DragBoxService } from "../../../../../share/app-service/drag-box.service";
import { ArbitrationWinVo } from "../vo/arbitration-win-reuqest.vo";
import { API } from "../../../../../share/lib/api/api";
import { Responsible } from "./vo/arbitration-responsible-vo";
import { RequestTokenService } from "../../../../../share/app-service/request-token.service";

@Component({
    selector: 'arbitration-win',
    templateUrl: './arbitration-win.component.html',
    styleUrls: [
        './arbitration-win.component.css'
    ]
})

export class ArbitrationWinComponent implements OnInit {
    testLabel:any;
    @Input() selections: any;
    @Input() winname: any[];
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
    latestFollow: any[] = [];
    historyFollow: any[] = [];
    abnormalPics: any[] = [];
    arbStatus: string;
    source: string;
    ifYZT: boolean = false;//责任方是否一智通
    constructor(public mask: ShowOrHideMaskService, public drag: DragBoxService,
        public api: API,
        public requestTokenService: RequestTokenService
    ) { }

    data: any = {};
    ngOnInit() {
        this.arbStatus = this.selections && this.selections[0]['arbStatus'];
        this.source=this.selections && this.selections[0]['vAbnormal']['strSource'];
        let dialogArea = document.getElementById('dialog_title');

        let dialogBox = document.getElementById('dialog_box');
        this.drag.dragEle(dialogArea, dialogBox);
        this.arbitrationWinVo = new ArbitrationWinVo();
        /**
         * 初值页面数据
         */
        this.lableinit();
        this.responsible = new Responsible();
        this.arbsubject = [];
        let resObj = { responsible: this.responsible, arbsubject: this.arbsubject };
        this.responsibles.push(resObj);
        ////console.log(this.responsibles);
        this.initColumns();
        this.requestTokenService.createToken();

        //跟进信息模拟数据
        this.history();

        this.getGZImg();

        this.getAbnormalPic();

    }

    isshowContent = [true, false, false, false];
    changeContent(index) {
        for (var i = 0; i < this.isshowContent.length; i++) {
            this.isshowContent[i] = false;
        }
        this.isshowContent[index] = true;
    }
    trackByResponsible(index: number, resp: Responsible) {
        return resp.dutyName;
    }
    //点击+，添加责任方
    // responNum=[0];//保存责任方数
    // i=0;
    addRespon() {
        // this.i++;
        // this.responNum.push(this.i);
        let responsible = new Responsible();
        this.arbsubject = [];
        let resObj = { responsible: responsible, arbsubject: this.arbsubject };
        this.responsibles.push(resObj);
        // this.responsibles.push([responsible,this.arbsubject]);
        ////console.log(this.responsibles);
        ////console.log(this.responsibles.length)
    }
    removeRespon(i) {
        ////console.log(i);
        if (this.responsibles.length !== 1) {
            this.responsibles.splice(i, 1);
        }
    }
    //点击×，关闭弹框
    @Output() hideWin = new EventEmitter<boolean>();
    @Output() confirm = new EventEmitter();
    hideModal() {
        this.hideWin.emit(false);
        this.mask.hide();
    }
    //罗有利 2017-03-10 仲裁处理
    SaveArbitration() {
        ////console.log(this.responsibles);
        if (this.selections)
            this.arbitrationWinVo.abID = this.selections && this.selections[0]['vAbnormal']['id'];
        let abnormalDutys = _.map(this.responsibles, 'responsible');
        ////console.log('abnormalDutys',abnormalDutys)
        this.api.call("ArbitrationController.handleAbortion", {
            id: this.arbitrationWinVo.abID,
            abnoBigType: this.arbitrationWinVo.abnoBigType,
            AbnoSmallType: this.arbitrationWinVo.abnoSmallType,
            abnoTypecode: this.arbitrationWinVo.abnoTypecode,
            abnormalDutys: abnormalDutys,
            arbitrationOpinions: this.arbitrationWinVo.arbitrationOpinions,
            ArbResponsible: this.arbitrationWinVo.arResponsible,
            ArbSubject: this.arbitrationWinVo.arbSubject
        }).ok(data => {
            this.showSuccess("success", "提示", "仲裁处理成功！");
            let that = this;
            setTimeout(function () {
                that.confirm.emit();
            }, 1000);
            this.mask.hide();
        }).fail(data => {
            ////console.log(data);
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                // alert("系统异常请联系管理员");
                this.showSuccess("error", "提示", "系统异常请联系管理员");
            }
        });
    }

    /**
     * 字典选中change事件
     * @param event
     */
    onChangeHandler(event, i) {
        if (this.selections) {
            this.arbitrationWinVo.abID = this.selections && this.selections[0]['vAbnormal']['id'];
        }
        // //console.log(event);
        this.api.call("ArbitrationController.getSubject", {}, {
            id: this.arbitrationWinVo.abID,
            responsible: event
        }).ok(data => {
            this.responsibles[i]['arbsubject'] = data.result;
            this.responsibles[i]['responsible']['subject'] = "";

            ////console.log(this.arbsubject);
            this.responsibles[i]['arbsubject'].forEach(item => {
                item.label = item.subject;
                item.value = item.subject;
            });
            this.responsibles[i]['responsible']['subject'] = this.responsibles[i]['arbsubject'][0].value || "";
        }).fail(data => {
            ////console.log(data);
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                this.showSuccess("error", "提示", "系统异常请联系管理员");
            }
        });
        //当责任方是一智通时，责任主体输入框可筛选
        if(event === '1ziton'){
            this.ifYZT = true;
        }else {
            this.ifYZT = false;
        }
    }

    /**
     * 页面初值化参数
     */
    lableinit() {

        if (this.selections)
            this.arbitrationWinVo.abID = this.selections && this.selections[0]['vAbnormal']['id'];
        this.api.call("ArbitrationController.getAbnormalinfo", {
            id: this.arbitrationWinVo.abID,
        }).ok(data => {
            this.arbinfo = data.result;
            ////console.log(this.arbinfo);
        }).fail(data => {
            ////console.log(data);
            if (data.code) {
                this.showSuccess("error", "提示", data.error);
            } else {
                this.showSuccess("error", "提示", "系统异常请联系管理员");

            }
        });

    }

    //获取异常图片
    getAbnormalPic() {
        let waybillId = this.selections && this.selections[0]['waybillId'];
        this.api.call("AbnormalController.findAbnormalPic", {
            abnormalId: this.arbitrationWinVo.abID,
            waybillId: waybillId
        }).ok(json => {
            let result: any = json.result || [];
            result.forEach((abnormalPic) => {
                this.abnormalPics.push({
                    picUrlPath: abnormalPic["picUrlPath"]
                });
            });
        }).fail(err => {
            //console.log(err);
        });
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
        if (this.selections)
            this.arbitrationWinVo.abID = this.selections && this.selections[0]['vAbnormal']['id'];
        this.api.call("ArbitrationController.queryHistoryArbitration", $event, {
            abId: this.arbitrationWinVo.abID
        }).ok(json => {
            this.data = json.result;
        });
    }

    history() {
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

    public GZImgs: any[] = [];
    getGZImg() {
        this.api.call("AbnormalController.findFileInfos", {
            abnormalId: this.arbitrationWinVo.abID
        }).ok(json => {
            let result: any = json.result || [];
            result.forEach(element => {
                this.GZImgs.push({
                    picUrlPath: element.picUrlPath,
                    picDate: element.picDate
                });
            });

        }).fail(err => {
            //console.log(err);
        });
    }
}
