/**
 * 师傅流水详情requestVo
 * Created by 李鹏程 on 2017-02-27.
 */
export class
MasterFlowDetailRequestVo{
    /**
     * 师傅姓名
     */
    public masterAccount:string;//师傅id

    /**
     * 运单号
     */
    public waybillId:string;

    /**
     * 提现流水号
     */
    public wdNo:string;

    /**
     * 审批人
     */
    public auditPerson:string;

    /**
     * 打款人
     */
    public playMoneyPerson:string;

    /**
     * 提现状态
     */
    public withdrawStatus:string;

    /**
     * 签收时间
     */
    public signTime:string;

    /**
     * 截止时间
     */
    public endTime:string;

    /**
     * 当前页
     */
    public currentPage:number=0;

    /**
     * 每页显示记录数
     */
    public pageSize:number=10;

    /**
     * 日期类型
     */
    public dateType:string;

}
