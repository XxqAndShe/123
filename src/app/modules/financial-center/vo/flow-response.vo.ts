import {TotalMoneyVo} from "./total-money.vo";
/**师傅流水查询响应vo
 * Created by 李鹏程 on 2017-02-25.
 */

export class FlowResponseVo{
    /**
     * 师傅id
     */
    public id:string;
    /**
     * 师傅姓名
     */
    public masterName:string;

    /**
     * 师傅账号
     */
    public masterAccount:string;

    /**
     * 签收时间
     */
    public signTime:string;

    /**
     * 截止时间
     */
    public endTime:string;

    /**
     * 总利润
     */
    public totalProfit:string;

    /**
     * 总标准成本
     */
    public totalStandardCost:string;
    /**
     * 支线费
     */
    public branchFee:string;
    /**
     * 安装费
     */
    public installFee:string;

    /**
     * 师傅提现金额详情vo
     */
    public totalMoneyVo:TotalMoneyVo;
    /**
     * 提现状态
     */
    public  withdrawStatus:string;
    /**
     * 提现金额
     */
    public  withdrawalAmount:string;
    /**
     * 提现方式
     */
    public  userAccountType:string;
    /**
     * 提现账号
     */
    public  bankAccount:string;
    /**
     * 申请时间
     */
    public  applyTime:string;
    /**
     * 审批人
     */
    public  auditPerson:string;
    /**
     * 审批时间
     */
    public  auditTime:string;

    /**
     * 审批备注
     */
    public auditRemark:string;

}
