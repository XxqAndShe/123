/**
 * Created by giscafer on 2017-04-06.
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
import {DragBoxService} from "app/share/app-service/drag-box.service";
import {VLateralPriceResponseVo} from "app/modules/base-set/page/price-manage/page/lateral-price/vLateralArea/vLateralPriceResponse.vo";
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService} from "primeng/components/common/api";
import {VLateralAreaRequestVo} from "./vLateralArea/vLateralAreaRequest.vo";
@Component({
    selector: 'lateral-form',
    templateUrl: './lateral-form.component.html',
    styleUrls: ['./lateral-form.component.css'],
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
export class LateralFormComponent implements OnInit {

    constructor(public drag: DragBoxService,public api:API, public confirmationService:ConfirmationService) {
    }


    public areaCodeFlag: boolean = false;
    public branchFeeFlag : boolean = false;
    public exceedVolumeUnitPriceFlag : boolean = false;
    public exceedVolumeFlag : boolean = false;
    public exceedDistanceUnitPriceFlag : boolean = false;
    public exceedDistanceFlag : boolean = false;
    public btnState: number = 0;
    objIndex:any = ["branchFee","exceedVolumeUnitPrice","exceedVolume","exceedDistanceUnitPrice","exceedDistance"];//限制输入函数定义
    @Input() boxState;
    @Input()selectedRows;//接收传回数据
    @Input() vLateralPriceResponseVo: VLateralPriceResponseVo;
    @Output()
    boxClocs = new EventEmitter<any>();

    //区域code
    //public areaCode: string;


    ngOnInit() {
        this.vLateralPriceResponseVo = new VLateralPriceResponseVo();
        this.selectedRows = this.selectedRows[0]?this.selectedRows[0]:this.selectedRows;
        this.vLateralPriceResponseVo.areaCode = this.selectedRows.areaCode;
        this.vLateralPriceResponseVo.branchFee = this.selectedRows.branchFee;
        this.vLateralPriceResponseVo.exceedVolume = this.selectedRows.exceedVolume;
        this.vLateralPriceResponseVo.exceedVolumeUnitPrice=this.selectedRows.exceedVolumeUnitPrice;
        this.vLateralPriceResponseVo.exceedDistance = this.selectedRows.exceedDistance;
        this.vLateralPriceResponseVo.exceedDistanceUnitPrice = this.selectedRows.exceedDistanceUnitPrice;
        this.vLateralPriceResponseVo.id = this.selectedRows.id;
    }
    cancel() {
        let obj={
            box:false,
            flag:'cancel',
        }
        this.boxClocs.emit(obj);
    }
    saveSuccess(){
        let obj={
            box:false,
            flag:'save',
        }
        this.boxClocs.emit(obj);
    }

    /**
     * 保存操作
     */
    saveHandler() {
        ////console.log(this.vLateralPriceResponseVo.areaCode);
        if (!this.vLateralPriceResponseVo.areaCode) {

            setTimeout(() => {
                this.areaCodeFlag = false;
            }, 4000)
            return this.areaCodeFlag = true;
        }

        if (!this.vLateralPriceResponseVo.branchFee) {

            setTimeout(() => {
                this.branchFeeFlag = false;
            }, 4000)
            return this.branchFeeFlag = true;
        }

        if (!this.vLateralPriceResponseVo.exceedVolumeUnitPrice) {

            setTimeout(() => {
                this.exceedVolumeUnitPriceFlag = false;
            }, 4000)
            return this.exceedVolumeUnitPriceFlag = true;
        }

        if (!this.vLateralPriceResponseVo.exceedVolume) {

            setTimeout(() => {
                this.exceedVolumeFlag = false;
            }, 4000)
            return this.exceedVolumeFlag = true;
        }

        if (!this.vLateralPriceResponseVo.exceedDistanceUnitPrice) {

            setTimeout(() => {
                this.exceedDistanceUnitPriceFlag = false;
            }, 4000)
            return this.exceedDistanceUnitPriceFlag = true;
        }

        if (!this.vLateralPriceResponseVo.exceedDistance) {

            setTimeout(() => {
                this.exceedDistanceFlag = false;
            }, 4000)
            return this.exceedDistanceFlag = true;
        }

        //this.vLateralPriceResponseVo为新增或者修改记录
        this.api.call("GoodsBranchPriceController.branchPriceAddOrUpdate",this.vLateralPriceResponseVo).ok(json=>{
            ////console.log(this.vLateralPriceResponseVo);
            ////console.log(json.result);
            if(json.result != null){
                if(this.vLateralPriceResponseVo.id){
                    this.confirmationService.confirm({
                        message: '修改支线价格成功',
                        header: '提示',
                        accept: () => {
                            this.saveSuccess();
                        }
                    });
                }else{
                    this.confirmationService.confirm({
                        message: '新增支线价格成功',
                        header: '提示',
                        accept: () => {
                            this.saveSuccess();
                        }
                    });
                }
            }
        }).fail(err=>{

        });
    }

    /*限制输入，小数点后两位*/
    clear(obj) {
        ////console.log(obj.value)
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            obj.value = parseFloat(obj.value);
        }
    }
}
