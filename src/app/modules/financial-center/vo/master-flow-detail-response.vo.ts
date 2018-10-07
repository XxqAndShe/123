/**
 * 师傅流水详情 responseVo
 * Created by 李鹏程 on 2017-02-27.
 */
export class MasterFlowDetailResponseVo{

    /**
     * 师傅姓名
     */
    public masterName:string;

    /**
     * 师傅账号
     */
    public masterAccout:string;

    /**
     * 运单号
     */
    public waybillId:string;

    /**
     * 提现金额
     */
    public withdrawalAmount:string;

    /**
     * 标准成本
     */
    public standardCost:string;

    /**
     * 差价
     */
    public profit:string

    /**
     * 签收时间
     */
    public signTime:string;

    /**
     * 提现状态
     */
    public withdrawStatus:string;

    /**
     * 申请时间
     */
    public applyTime:string;

    /**
     * 审批时间
     */
    public auditTime:string;

    /**
     * 审批人
     */
    public auditPerson:string;

    /**
     * 打款人
     */
    public playMoneyPerson:string;

    /**
     * 提现流水号
     */
    public withdrawId:string;
    /**
     * 核销码
     */
    //public orderSourceCode:string;
    public taskMoney:string;

    /**
     * 当前页
     */
    public currentPage:number;

    /**
     * 每页显示记录数
     */
    public pageSize:number;


}
