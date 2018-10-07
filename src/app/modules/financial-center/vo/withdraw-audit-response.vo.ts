/**
 * 提现审核，提现管理-提现明细responseVo
 * Created by 李鹏程 on 2017-02-27.
 */
export class WithdrawAuditResponseVo{

    /**
     * 师傅姓名
     */
    public realName:string;

    /**
     * 师傅手机号码，账号
     */
    public mobile:string;

    /**
     * 提现金额
     */
    public withdrawAmount:string;

    /**
     * 申请时间
     */
    public applyTime:string;

    /**
     * 提现方式，账号类型
     */
    public userAccount:string;

    /**
     * 提现账号
     */
    public bankAccount:string;

    /**
     * 持卡人
     */
    public accountName:string;
    /**
     * 银行名称
     */
    public bankName:string;

    /**
     * 银行支行名称
     */
    public subBranchName:string;

    /**
     * 运单号
     */
    public waybillId:string;

    /**
     * 服务类型
     */
    public serviceType:string;

    /**
     * 品名,运单货物
     */
    public productNames:string;

    /**
     * 收货人姓名
     */
    public consignee:string;
    /**
     * 收货人地址
     */
    public consigneeAddr:string;

    /**
     * 任务金额
     */
    public taskAmount:string;

    /**
     * 标准成本
     */
    public standardCost:string;

    /**
     * 签收时间
     */
    public signTime:string;
    /**
     * 提现列表
     */
    public wdNo:string;
    /**
     * 审核状态
     */
    public auditState:string;
    /**
     * 提现方式
     */
    public withdrowType:string;
    /**
     * 任务类型
     */
    public taskType:string;
}
