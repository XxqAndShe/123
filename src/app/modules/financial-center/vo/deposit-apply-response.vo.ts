import {UserRequestVo} from "./user-request.vo";
/**
 * Created by 李鹏程 on 2017-02-25.
 */
export class DepositApplyResponseVo{

    /**
     * 师傅账号，姓名
     */
    public vUserJzt:UserRequestVo

    /**
     * 可提现金额
     */
    public canWithdrawal:string;

    /**
     * 提现中金额
     */
    public inWithdraw:string;

    /**
     * 不可提现金额
     */
    public noWithdrawal:string;
}