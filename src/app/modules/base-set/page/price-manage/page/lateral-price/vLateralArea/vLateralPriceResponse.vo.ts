/**
 * Created by Administrator on 2017/4/4.
 *
 */

//TODO 后端人员自行修改，此vo为测试
/**
 * 支线价格查询条件vo
 */
export class VLateralPriceResponseVo {

    /**
     * 支线价格id
     */
    public id: string;

    /**
     * 政区code
     */
    public areaCode: string;

    /**
     * 区域名称
     */
    public areaName: string;

    /**
     * 支线费
     */
    public branchFee: string;
    /**
     * 超方定义(立方米)
     */
    public exceedVolume: string;

    /**
     * 超方单价
     */
    public exceedVolumeUnitPrice: string;

    /**
     * 超远定义(公里)
     */
    public exceedDistance: string;

    /**
     * 超远单价(元)
     */
    public exceedDistanceUnitPrice: string;
}

