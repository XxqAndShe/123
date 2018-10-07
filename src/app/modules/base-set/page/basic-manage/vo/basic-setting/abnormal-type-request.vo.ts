import {BasicSettingRequestVo} from "./basic-setting-request.vo";
/**
 * 异常类型 请求vo
 *
 * @Author hao
 * @Date 2017/2/23
 */
export class AbnormalTypeRequestVo extends BasicSettingRequestVo {

    /**
     * id
     */
    id: string;
    /**
     * 父id
     */
    parentId: string;
    /**
     * 异常登记
     */
    level: string;
    /**
     * 是否仲裁
     */
    ifArbitrate: string;

}
