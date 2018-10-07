import {PageInfoVo} from "../page-info.vo";
import {ContentVo} from "./content.vo";

/**
 * 异常类型 响应vo
 *
 * @Author hao
 * @Date 2017/2/23
 */
export class AbnormalTypeResponseVo extends PageInfoVo {

    /**
     * id
     */
    id: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 是否仲裁, 枚举
     */
    ifArbitrate: string;
    /**
     * 父
     */
    parent: ContentVo;

}