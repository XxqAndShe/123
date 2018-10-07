/**
 * 师傅提现金额详情vo
 * Created by 李鹏程 on 2017-02-25.
 */

export class TotalMoneyVo{

    /**
     * 账户余额,可提现
     */
    public canWithdraw:string = "0";

    /**
     * 已提现
     */
    public alreadyWithdrawed:string = "0";

    /**
     * 提现中
     */
    public inWithdraw:string = "0";

    /**
     * 不可提现
     */
    public cannotWithdraw:string = "0";

    /**
     * 总金额
     */
    public totalMoney:string = "0";
}
