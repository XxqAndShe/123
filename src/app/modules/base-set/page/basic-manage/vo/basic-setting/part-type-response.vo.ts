import {PageInfoVo} from "../page-info.vo";
import {ContentVo} from "./content.vo";

/**
 * 补件任务类型 响应vo
 *
 * @Author hao
 * @Date 2017/2/23
 */
export class PartTypeResponseVo extends PageInfoVo {

    /**
     * 主要信息
     */
    contentVo: ContentVo;

}
