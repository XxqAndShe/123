/**
 * 提现管理-付款明细responseVo
 * Created by 李鹏程 on 2017-02-28.
 */
export class PaidResponseVo{

    /**
     * 申请人
     */
    public applyPerson:string;

    /**
     * 提现申请时间
     */
    public applyTime:string;

    /**
     *提现状态
     */
    public withdrawStatus:string;

    /**
     * 提现方式，账户类型
     */
    public userAccount:string;


    /**
     * 应付单号
     */
    public bePayNo:string;
    /**
     * 实付单号
     */
    public actPayNo:string;

    /**
     * 提现金额
     */
    public withdrawalAmount:string;

    /**
     * 付款金额
     */
    public paidAmount:string;

    /**
     * 未付款金额
     */
    public noPaidAmount:string;
    /**
     * 审核状态
     */
    public auditState:string;
    /**
     * 总未付款金额
     */
    public totalNoPaidAmount:string;
    /**
     * 总付款金额
     */
    public totalPaidAmount:string;

    /**
     * 付款时间
     */
    public paidTime:string ;
    /**
     * 付款人
     */
    public paidPerson:string;
}