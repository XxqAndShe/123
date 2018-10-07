import {CustomerVo} from "./customer.vo";
import {UserJztVo} from "./user-jzt.vo";
import {TaskNodeVo} from "./task-node.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class RepairTaskVo{
    /**
     * 异常售后任务ID
     */
    public id:string;
    /**
     * 维修师傅
     */
    public realName:string;
    /**
     * 售后单号
     */
    public maintno:string;
    /**
     * 任务类型
     */
    public repairType:string;
    /**
     * 维修费用
     */
    public installFee:string;
    /**
     * 商家承担金额
     */
    public assumeFee:string;
    /**
     * 备注
     */
    public remark:string;
    /**
     * 商品名称
     */
    public productName:string;
    /**
     * 异常售后任务节点
     */
    public vTaskNodes:TaskNodeVo[];
    /**
     * 发货人
     */
    public shipper:CustomerVo;
    /**
     * 收货人
     */
    public consignee:CustomerVo;
    /**
     * 师傅
     */
    public vUserJzt:UserJztVo;

}