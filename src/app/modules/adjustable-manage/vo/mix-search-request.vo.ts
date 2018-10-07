/**
 * Created by 李鹏程 on 2017-02-23.
 * 综合查询请求vo
 */

export class MixSearchRequestVo{



    /**
     * 地区Code
     */
    public areaCode:string;

    /**
     * 运单号
     */
    public waybillId:string;

    /**
     * 任务类型
     */
    public taskType:string;

    /**
     * 任务状态/节点类型
     */
    public taskNodeType:string;

    /**
     * 发货人
     */
    public shipper:string;

    /**
     * 收货人
     */
    public consignee:string;

    /**
     * 匹配类型
     */
    public matchType:string;

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
    public currentPage:number = 1;

    /**
     * 每页显示记录数
     */
    public pageSize:number = 10;
}
