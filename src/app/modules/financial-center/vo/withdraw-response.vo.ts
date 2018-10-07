/**
 * 财务中心-提现管理-查询响应vo
 * Created by 李鹏程 on 2017-02-24.
 */
export class WithdrawResponseVo{
    /**
     * 师傅姓名
     */
    public realName:string;

    /**
     * 师傅手机号码，账号
     */
    public mobile:string;

    /**
     * 提现状态
     */
    public withdrawStatus:string;

    /**
     * 审核状态
     */
    public auditStatus:string;

    /**
     * 提现金额
     */
    public withdrawalAmount:string;

    /**
     * 标准成本
     */
    public standardCost:string;

    /**
     * 提现方式，账号类型
     */
    public userAccount:string;

    /**
     * 提现账号
     */
    public bankAccount:string;

    /**
     * 审批人
     */
    public auditPerson:string;

    /**
     * 申请时间
     */
    public applyTime:string;

    /**
     * 审批时间
     */
    public auditTime:string;

    /**
     * 审核备注
     */
    public remarks:string;
    /**
     * 提现流水号
     */
    public wdNo:string;
}