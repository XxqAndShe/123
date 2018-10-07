/**
 * Created by hua on 2017-02-20.
 *
 */
export class AdjustableRequestVo{
    /**
     * 节点类型
     */
    public nodeType:string;
    /**
     * 地区代码
     */
    public areaCode:string;
    /**
     * 运单号
     */
    public waybillId:string;
    /**
     * 干线开始时间
     */
    public beginDate:string;
    /**
     * 干线结束时间
     */
    public endDate:string;
    /**
     * 开单网点
     */
    public billingOrg:string;
    /**
     * 干线状态
     */
    public trunkSts:string;
    /**
     * 发货人
     */
    public shipper:string;
    /**
     * 收货人
     */
    public consignee:string;
    /**
     * 师傅名称
     */
    public jztUserName:string;
    /**
     * 分配人
     */
    public disUser:string;
    /**
     * 任务状态:待分配
     */
    public taskStatus : string;
    /**
     * 签收状态:是否正常签收
     */
    public isNormalSign : string;
    /**
     * 干线状态是否结束
     */
    public finish : string;
    /**
     * 日期类型
     */
    public dateType : string;

    /**
     * 跟进人
     */
    public followPerson : string;
    /**
     * 收货地址
     */
    public consigneeAdr : string;
}