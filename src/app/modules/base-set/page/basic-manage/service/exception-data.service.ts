import {Injectable} from '@angular/core';
import {API} from "../../../../../share/lib/api/api";
import {AbnormalTypeResponseVo} from "../vo/basic-setting/abnormal-type-response.vo";
import {AbnormalTypeRequestVo} from "../vo/basic-setting/abnormal-type-request.vo";
import {ExceptionDataRequestVo} from "../vo/exception-data/exception-data-request.vo";
/**
 * 异常基础资料service
 *
 * @Author hao
 * @Date 2017/2/24
 */
@Injectable()
export class ExceptionDataService {

    public abnormalTypeResponseVo: AbnormalTypeResponseVo;

    constructor(public api: API) {}

    /**
     * 获取异常基础资料
     */
    getExceptionData(requestVo: ExceptionDataRequestVo, fn: Function) {
        this.api.call('baseConfigApiController.findAbnoTypeGuide',requestVo)
            .ok(data => {
                fn(data);
            })
            .fail(data => {
                fn(data);
            })
    }

    /**
     * 获取异常类型
     * @param fn
     *          回调函数
     * @param requestVo
     *          AbnormalTypeRequestVo
     */
    getAbnormalType(fn: Function, requestVo: AbnormalTypeRequestVo): any {
        this.api.call('baseConfigApiController.getAbnormalType',requestVo)
            .ok(data => {
                this.abnormalTypeResponseVo = Object.assign(new AbnormalTypeResponseVo(), data.result);
                fn(this.abnormalTypeResponseVo);
            })
            .fail(data => {
                // TODO(待处理)
                ////console.log(data);
            })
    }

}

