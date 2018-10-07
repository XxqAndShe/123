/**
 * Created by hua on 2017-01-08.
 */
import {
    Component,
    animate,
    trigger,
    state,
    transition,
    style,
    OnInit,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DragBoxService } from '../../app-service/drag-box.service';
import { WaybillAbnormalRequestVo } from "../../../modules/sale-center/page/exception-handle/vo/waybill-abnormal-request.vo";
import { ExceptionDataService } from "../../../modules/base-set/page/basic-manage/service/exception-data.service";
import { AbnormalTypeRequestVo } from "../../../modules/base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
import { ExceptionDealService } from "../../../modules/sale-center/page/exception-handle/service/exception-deal.service";
import { WaybillAbnormalEditVo } from "../../../modules/sale-center/page/exception-handle/vo/abnormal-edit.vo"
import { API } from "../../lib/api/api";
@Component({
    selector: 'abnormal-record',
    templateUrl: './abnormal-record.component.html',
    styleUrls: ['./abnormal-record.component.css'],
    animations: [trigger('detailBoxState', [
        state("show", style({
            height: '102px'
        })),
        state("hide", style({
            height: '0px'
        })),
        transition('hide=>show', animate('180ms ease-in'))
    ]), trigger('boxState', [
        state("show", style({
            transform: 'scale(1)',
            display: 'block'
        })),
        state("hide", style({
            transform: 'scale(0)',
            display: 'none'
        })),
        transition('hide<=>show', animate('180ms ease-in'))
    ])
    ]
})
export class AbnormalRecordComponent implements OnInit {
    public orderState: string = 'hide';
    public btnState: number = 0;
    @Input() boxState;
    @Input() wayBill: any;
    @Input() selectLineInfo;//表格选中数据
    @Output() boxClocs = new EventEmitter<any>();//确定
    @Output() abnormal = new EventEmitter<any>();//取消
    //输入框组件
    public abnormalTypeLabel: string = "";
    public temp: string;
    public suggestionResult: string[];//查询建议结果
    searchResult(event, type?) {
        if (type = 'receive') {
            //查询收货人
        }
        if (event.query.startsWith("a")) {
            this.suggestionResult = ["aaa", "aab", "aac"];
        }
        else if (event.query.startsWith("b")) {
            this.suggestionResult = ["bbb", "bba", "bbc"];
        }
    }
    files: string[];//上传异类图片

    // 异常
    public waybillAbnormalRequestVo: WaybillAbnormalRequestVo;
    public abnormalTypeRequestVo: AbnormalTypeRequestVo;
    public waybillAbnormalEditVo: WaybillAbnormalEditVo;
    // 父类id
    public parentId: string;
    // 异常大类
    public abnormalBTypeRequestVo: AbnormalTypeRequestVo;
    public abnormalBigType = [];
    // 异常小类
    public abnormalSTypeRequestVo: AbnormalTypeRequestVo;
    public abnormalSmallType = [];
    abnormalIf: boolean = false;
    //运单信息
    vWaybillQuery: any = {};
    constructor(
        public drag: DragBoxService,
        public exceptionDataService: ExceptionDataService,
        public exceptionDealService: ExceptionDealService,
        public api: API
    ) { }

    ngOnInit() {
        //默认表格带出单号
        if (this.selectLineInfo != undefined && this.selectLineInfo != "" && this.selectLineInfo != []) {
            this.vWaybillQuery.waybillId = this.selectLineInfo[0].waybillId;
        }
        let box = document.getElementById('abnormal_box');
        let moveArea = document.getElementById("abnormal_move_area");

        this.waybillAbnormalRequestVo = new WaybillAbnormalRequestVo();
        this.waybillAbnormalEditVo = new WaybillAbnormalEditVo();
        this.abnormalTypeRequestVo = new AbnormalTypeRequestVo();
        this.abnormalBTypeRequestVo = new AbnormalTypeRequestVo();
        this.abnormalSTypeRequestVo = new AbnormalTypeRequestVo();
        this.waybillAbnormalRequestVo = this.selectLineInfo;
        this.drag.dragEle(moveArea, box);
        this.getAddAbnormalWaybill();
    }
    msgs: any;//提示弹框
    /*公共弹窗提示*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [{ severity: severity, summary: summary, detail: detail }];
    }

    closeBox() {
        this.abnormal.emit();
        ////console.log(this.wayBill)
    }

    setPos() {
        return this.drag.setPosition(596, 472);
    }
    //点击查看眼睛按扭-查看运单详情
    clickShowOrderDetail(e, detailBox: any) {
        this.btnState = this.btnState == 0 ? -25 : 0;
        let _baStr = "url('/assets/tip-box-img/transport-icon.gif')" + this.btnState + "px 0 no-repeat";
        e.target.style.background = _baStr;
        this.orderState = this.orderState == 'hide' ? 'show' : 'hide';
        detailBox.style.display = detailBox.style.display == 'block' ? 'none' : 'block';
    }

    /**
     * 获取异常大类
     */
    getAbnormalBigType(): void {
        this.abnormalBigType = [];
        this.abnormalBTypeRequestVo.level = 'parent'; // 设置异常类型等级
        this.exceptionDataService.getAbnormalType(data => {
            for (let index of data.content) {
                this.abnormalBigType.push(index);
            }
        }, this.abnormalBTypeRequestVo)
    }

    /**
     * 选择异常大类
     */
    selectAbnormalBType(parentId = 'abnormalSmallType', name: string) {
        this.parentId = parentId;
        this.abnormalBTypeRequestVo.name = name;
        // 清空异常大类下拉框
        this.abnormalBigType = [];
    }
    /**
    * 查询品名和数量
    */
    getAddAbnormalWaybill(): any {
        // this.vWaybillQuery.waybillId = this.selectLineInfo[0].waybillId;
        console.debug(this.vWaybillQuery);
        // if(!this.vWaybillQuery.waybillId) return;
        this.exceptionDealService.getAddAbnormalWaybillInfo(
            data => {
                this.vWaybillQuery = data.result;
                console.debug(this.vWaybillQuery);
            }, this.vWaybillQuery);
    }
    /**
     * 选择异常小类
     */
    selectAbnormalSType(abnormalTypeSId: string, name: string) {
        this.waybillAbnormalRequestVo.abnormalTypeSId = abnormalTypeSId;
        this.abnormalSTypeRequestVo.name = name;
        // 清空异常小类下拉框
        this.abnormalSmallType = [];
    }


    /**
     * 获取异常小类
     */
    getAbnormalSmallType(): any {
        this.abnormalSmallType = []; // 清空abnormalSmallType
        this.abnormalSTypeRequestVo.parentId = this.parentId;
        this.abnormalSTypeRequestVo.level = 'son';
        this.exceptionDataService.getAbnormalType(data => {
            for (let index of data.content) {
                this.abnormalSmallType.push(index);
            }
        }, this.abnormalSTypeRequestVo);
    }

    /**
     * 登记异常
     */
    acceptTime;
    addAbnormal(): void {

        this.waybillAbnormalEditVo.waybillId = this.vWaybillQuery.waybillId;
        // this.waybillAbnormalEditVo.fileInfos=this.files;
        // console.debug(this.waybillAbnormalEditVo);
        // this.exceptionDealService.addAbnormal(this.waybillAbnormalEditVo);
        this.waybillAbnormalEditVo.source = "ips";
        // console.debug(this.waybillAbnormalEditVo)
        this.api.call('abnormalController.abnormalEdit', this.waybillAbnormalEditVo)
            .ok(data => {
                this.showSuccess("success", "提示", "异常登记成功！");
                this.boxClocs.emit('exception-record');
            })
            .fail(data => {
                if (data.code) {
                    this.showSuccess("error", "提示", data.error)
                } else {
                    this.showSuccess("warn", "提示", "未知错误")
                }
            })
    }

    onChange($event) {
        console.info($event);
        this.api.call("AbnormalGuideController.abnormalGuideFindOne", { abnormalTypeId: $event.value }).ok(data => {
            if (data.result) {
                this.waybillAbnormalEditVo.describe = data.result.description || "";
            }
        }).fail(data => {
            console.info(data);
        })
    }
}
