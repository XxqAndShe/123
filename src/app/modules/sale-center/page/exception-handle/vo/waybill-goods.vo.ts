import {WaybillVo} from "../../abnormal-sale/vo/waybill.vo";
import {GoodsCatalogVo} from "./goods-catalog.vo";
/**
 * Created by siYuan on 2017-03-22.
 */
export class waybillGoodsVo{
    /**
     * 运单
     */
    public waybill:WaybillVo;
    /**
     * 宁崛峰，添加货品所需关联和字段
     * 品名
     */
    public productName:GoodsCatalogVo;
    /**
     * 服务类型
     */
    public typeOfService:string;
    /**
     * 包装
     */
    public packing:string;
    /**
     * 包装件数
     */
    public packingItems:number;
    /**
     * 安装件数
     */
    public installItems:number;
    /**
     * 重量
     */
    public weight:number;
    /**
     * 体积
     */
    public volumes:number;
    /**
     * 计费类型
     */
    public chargeType:string;
    /**
     * 单价
     */
    public price:number;
    /**
     * 运费
     */
    public tranSportCharge:number;
    /**
     * 安装费
     */
    public InstallCharge:number;
    /**
     * 送货费
     */
    public deliveryCharge:number;
    /**
     * 上楼费
     */
    public upstairsCharge:number;
    /**
     * 代收货款
     */
    public replaceCharge:number;
    /**
     * 代收手续费
     */
    public serviceCharge:number;
    /**
     * 声明价值
     */
    public valueCharge:number;
    /**
     * 保价费
     */
    public protectioncharge:number;
    /**
     * 回扣费
     */
    public commissioncharge:number;
    /**
     * 装卸费
     */
    public stevedorecharge:number;
    /**
     * 报关费
     */
    public declarantcharge:number;
    /**
     * 税费
     */
    public taxcharge:number;
    /**
     * 中转费
     */
    public changecharge:number;
    /**
     * 叉车费
     */
    public forkliftcharge:number;
    /**
     * 提货费
     */
    public takecharge:number;
    /**
     * 其他费
     */
    public ordercharge:number;
}