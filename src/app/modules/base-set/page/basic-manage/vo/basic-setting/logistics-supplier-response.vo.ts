import {PageInfoVo} from "../page-info.vo";
import {ContentVo} from "./content.vo";

/**
 * 物流供应商 响应vo
 *
 * @Author hao
 * @Date 2017/2/23
 */
export class LogisticsSupplierResponseVo extends PageInfoVo {

    /**
     * 主要信息
     */
    contentVo: ContentVo;

}
