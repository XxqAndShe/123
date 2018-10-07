import {TaskNodeVo} from "./task-node.vo";
import {ReturnItemVo} from "./return-item.vo";
import {CustomerVo} from "./customer.vo";
import {UserJztVo} from "./user-jzt.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class ReturnTaskVo{
    /**
     * 异常售后任务ID
     */
    public id:string;
    /**
     * 售后单号
     */
    public maintno:string;
    /**
     * 运营商
     */
    public returnOperator:string;
    /**
     * 异常售后任务跟踪节点
     */
    public vTaskNodes:TaskNodeVo[];
    /**
     * 售后返货明细
     */
    public vReturnItems:ReturnItemVo[];
    /**
     * 提货联系人
     */
    public pickUpMan:string;
    /**
     * 提货联系人电话
     */
    public pickUpPhone:string;
    /**
     * 返货总件数
     */
    public items:string;
    /**
     * 总体积
     */
    public volumes:string;
    /**
     * 提货费用
     */
    public installFee:string;
    /**
     * 提货人
     */
    public vPickUpMan:CustomerVo;
    /**
     * 收货人
     */
    public vConsignee:CustomerVo;
    /**
     * 师傅
     */
    public vUserJzt:UserJztVo;
    /**
     * 提货地址
     */
    public pickUpManAddress:string;
    /**
     * 收货地址
     */
    public consigneeAddress:string;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}