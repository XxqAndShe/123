import {Injectable} from "@angular/core";
import {API} from "../../../../../share/lib/api/api";
import {WaybillAbnormalRequestVo} from "../vo/waybill-abnormal-request.vo";
import {WaybillAbnormalEditVo} from "../../../../../modules/sale-center/page/exception-handle/vo/abnormal-edit.vo"
/**
 * 异常处理 service
 *
 * @Author hao
 * @Date 2017/2/27
 */
@Injectable()
export class ExceptionDealService {

    constructor(public api: API) {}

    /**
     * 获取异常列表
     *
     * @param fn
     *          回调函数
     */
    findAbnormal(fn: Function) {
        this.api.call('AbnormalController.abnormalSearch', {})
            .ok(data => {
                fn(data);
            })
            .fail(data => {
                ////console.log(data);
            })
    }


    /**
     * 获取各种异常状态对应的数量
     *
     * @param fn
     *          回调函数
     */
    findAbnoHandleAmount(fn: Function) {
        this.api.call('exceptionRegistApiController.findAbnoHandleAmount')
            .ok(data => {
                fn(data);
            })
            .fail(data => {
                ////console.log(data);
            })
    }

    /**
     * 登记异常
     * @param fn
     * @param requestVo
     */
    addAbnormal(editVo: WaybillAbnormalEditVo) {
        this.api.call('abnormalController.abnormalEdit', editVo)
            .ok(data => {
                // TODO(优化)
                alert('登记成功!');
            })
            .fail(data => {
                // TODO(优化)
                ////console.log(data);
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("请联系管理员!");
                }
            })
    }

    /**
     * 异常登记获取运单信息
     * */
    getAddAbnormalWaybillInfo(fn: Function,vWaybillQuery ){
        this.api.call('abnormalRegistController.waybillQuery',vWaybillQuery)
            .ok(data => {
                // TODO(优化)
                fn(data)
            })
            .fail(data => {
                // TODO(优化)
                ////console.log(data);
            })
    }

}
