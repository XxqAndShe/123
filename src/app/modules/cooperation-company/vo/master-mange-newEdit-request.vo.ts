export class MasterManagenewEditRequestVo{
    /**
     * 组织id
     */
    public  id:string;
    /**
     * 最大接单数
     */
    public   maxOrder:string;
    /**
     * 保证金
     */
    public  bond:string;
    /**
     * 已缴纳保证金
     */
    public  payBond:string;
    /**
     * 团队人数
     */
    public teamAmount:string;
    /**
     * 车辆数量
     */
   public  carAamount:string;
    /**
     * 车辆容积
     */
    public  carVolume:string;
    /**
     * 仓库容积
     */
    public   warehouseAddress:string;
    /**
     * 通行证
     */
    public  pass:string;

    /**
     * 工资结算方式
     */
    public businessScope:string;
    /**
     * 电商活动最大接单量
     */
    public  activityAmount:string;
    /**
     *平均日订单量
     */
    public dayAamount:string;
    /**
     * 一智通分配订单占比
     */
    public  orderProportion:string;
    /**
     * 动态最大接单量
     */
    public   dynamicMaxOrder:string;
    /**
     * 动态接单量
     */
    public  dynamicOrder:string;
    /**
     * 入行时间
     */
    public   cooperationDate:string;
    /**
     * 合作方式
     */
    public   accountType:string;
    /**
     * 结算方式
     */
    public  paymentType:string;
    /**
     * 发票
     */
    public  invoice:string;
    /**
     * 合作时间
     */
    public  createDate:string;
}