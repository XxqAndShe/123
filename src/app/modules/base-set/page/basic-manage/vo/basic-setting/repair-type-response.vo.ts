import {PageInfoVo} from "../page-info.vo";
import {ContentVo} from "./content.vo";

/**
 * 维修任务类型vo
 *
 * @Author hao
 * @Date 2017/2/23
 */
export class  RepairTypeResponseVo extends PageInfoVo {
    /**
     * 主要信息
     */
    contentVos: ContentVo[];
}
