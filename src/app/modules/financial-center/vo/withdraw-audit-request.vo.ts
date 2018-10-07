/**
 * Created by 李鹏程 on 2017-02-28.
 */
export class WithdrawAuditRequestVo{

    /**
     * 师傅名称
     */
    public realName:string;
    /**
     * 是否通过
     */
    public pass:boolean = false;

    /**
     * 提现编号
     */
    public wdNo:string;

    /**
     * 师傅账号，手机号码
     */
    public mobile:string;
    /**
     * 审核状态
     */
    public auditState:string;
    /**
     * 不通过原因
     */

    public noPassReson:string;

}
