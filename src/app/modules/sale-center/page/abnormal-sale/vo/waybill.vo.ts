import {CustomerVo} from "../../scheduling/vo/customer.vo";
import {AreaVo} from "./area.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class WaybillVo{
    /**
     * 运单号
     */
    public waybillId:string;
    /**
     * 发货人
     */
    public shipper:CustomerVo;
    /**
     * 收货人
     */
    public consignee:CustomerVo;
    /**
     * 收货地址
     */
    public receiveAddress:string;
    /**
     * 开单网点
     */
    public orgName:string;
    /**
     * 代收货款
     */
    public replaceCharge:string;
    /**
     * 付款方式
     */
    public payType:string;
    /**
     * 到付
     */
    public payArrive:string;
    /**
     * 现付
     */
    public payCash:string;
    /**
     * 月结
     */
    public payMonth:string;
    /**
     * 回单付
     */
    public payReturn:string;
    /**
     * 干线结束时间
     */
    public trunkEndDate:string;
    /**
     * 包装件数
     */
    public packingNumber:string;
    /**
     * 总件数
     */
    public items:string;
    /**
     * 总重量
     */
    public weights:string;
    /**
     * 总体积
     */
    public volumes:string;
    /**
     * 目的地
     */
    public vArea:AreaVo;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}