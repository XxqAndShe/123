/**
 * Created by zhaojinglong on 2017-02-23.
 */

export class InsTaskTrackRequestVo{
    /**
     * 地区代码
     */
    public areaCode:string;
    /**
     * 运单号
     */
    public waybillId:string;
    /**
     * 跟踪人
     */
    public trackUser:string;
    /**
     * 开单网点
     */
    public billingOrg:string;
    /**
     * 收货人
     */
    public consignee:string;
    /**
     * 发货人
     */
    public shipper:string;
    /**
     * 安装师傅
     */
    public jztUserName:string;
    /**
     * 分配人
     */
    public disUser:string;
    /**
     * 任务状态
     */
    public taskSts:string;
    /**
     * 任务类型
     */
    public taskType:string;
    /**
     * 查询日期类型：下次跟进日期，开单日期，分配日期，签收日期，干线结束日期
     */
    public queryDateType:string;
    /**
     * 起始时间
     */
    public beginDate:string;
    /**
     * 结束时间
     */
    public endDate:string;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}