/**
 * Created by hua on 2017-02-20.
 */
export class TaskQueryRequestVo {
    /**
     * 节点类型
     */
    public taskStatus: string;
    /**
     * 地区代码
     */
    public areaCode: string;
    /**
     * 运单号
     */
    public waybillId: string;
    /**
     * 干线开始时间
     */
    public startDate: string;
    /**
     * 干线结束时间
     */
    public endDate: string;
    /**
     * 开单网点
     */
    public billingOrg: string;
    /**
     * 收货人
     */
    public consignee: string;
    /**
     * 发货人
     */
    public shipper: string;
    /**
     * 发货人
     */
    public disUser: string;
    /**
     * 干线状态
     */
    public trunkSts: string;
    /**
     * 师傅姓名
     */
    public userName: string;
    /**
     * 分配人
     */
    public distributionName: string;

    /**
     * 当前页
     */
    public currentPage: string;
    /**
     * 每页显示记录数
     */
    public pageSize: string;
}