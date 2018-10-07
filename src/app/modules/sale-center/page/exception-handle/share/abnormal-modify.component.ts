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
} from "@angular/core";
import {DragBoxService} from "../../../../../share/app-service/drag-box.service";
import {ExceptionDataService} from "../../../../base-set/page/basic-manage/service/exception-data.service";
import {AbnormalTypeRequestVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
import {AbnormalModifyVo} from "../vo/abnormal-modify-request.vo";
import {ExceptionDealService} from "../service/exception-deal.service";
import {WaybillAbnormalRequestVo} from "../vo/waybill-abnormal-request.vo";
import {WaybillAbnormalEditVo} from "../../../../../modules/sale-center/page/exception-handle/vo/abnormal-edit.vo"
import {API} from "../../../../../share/lib/api/api";
import {data} from "../../../../base-set/page/intel-manage/page/intel-addr-manage/data";
import {RequestTokenService} from "../../../../../share/app-service/request-token.service";

@Component({
    selector: 'abnormal-modify',
    templateUrl: './abnormal-modify.component.html',
    styleUrls: ['../../../../../share/view/exception-record/abnormal-record.component.css'],
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
export class AbnormalModifyComponent implements OnInit {
    public orderState: string = 'hide';
    public btnState: number = 0;
    @Input() boxState;
    @Output() boxClocs = new EventEmitter<any>();

    @Input()
    selectedWaybillAbnormal:any;
    msgs:any;//公共提示

    public waybillAbnormalEditVo:any={};

    //输入框组件
    public temp:string;
    public suggestionResult:string[];//查询建议结果

    constructor(
        public drag: DragBoxService,
        public api: API,
        public requestTokenService: RequestTokenService
    ) {
    }

    ngOnInit() {
        let box = document.getElementById('abnormal_box');
        let moveArea = document.getElementById("abnormal_move_area");
        this.drag.dragEle(moveArea, box);
        // //console.log("selectedWaybillAbnormal");
        Object.assign(this.waybillAbnormalEditVo, this.selectedWaybillAbnormal);
        // //console.log(this.waybillAbnormalEditVo);
        // //console.log("selectedWaybillAbnorma2");
        //回显图片使用
        this.waybillAbnormalEditVo.files=this.selectedWaybillAbnormal.fileInfos;
        //图片id绑定
        this.waybillAbnormalEditVo.fileInfos=_.map(this.waybillAbnormalEditVo.files,'id');
        this.requestTokenService.createToken();
    }

    closeBox() {
        this.boxClocs.emit('exception-modify');
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


    //删除已经选择预上传的图片
    removePreUploadPic(e) {
        let check = e.target.parentNode.classList.contains("upload-pic");
        if (check){
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        }

    }

    // 异常修改,与异常登记使用同一个vo
    addAbnormal(){
        // //console.info(this.waybillAbnormalEditVo);
        this.api.call("AbnormalController.abnormalEdit", this.waybillAbnormalEditVo).ok(data => {
            Object.assign(this.selectedWaybillAbnormal, this.waybillAbnormalEditVo);
            this.showSuccess("success","提示","异常修改成功！");
            let that = this;
            setTimeout(function () {
                that.boxClocs.emit('exception-modify');
            },1000);
        }).fail(data => {
            this.showSuccess("error","提示","出现未知错误！");
        })
    }
    /*公共弹窗提示*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [{severity:severity, summary:summary, detail:detail}];
    }
}
