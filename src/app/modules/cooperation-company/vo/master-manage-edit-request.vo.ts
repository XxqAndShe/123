import Any = jasmine.Any;
/**
 * Created by jianconglee on 2017-02-24.
 */

export class MasterManageEditRequestVo{
    /**
     * 师傅Id
     */
    public masterId:string;
    /**
     * 师傅名称
     */
    public masterName:string;
    /**
     * 师傅帐号
     */
    public masterAccount:string;
    /**
     * 服务区域
     */
    public areaCode:string[];
    /**
     * 服务地区
     */
    // public areas:Area[];
    /**
     * 服务类型
     */
    public typeOfService:any[];
    /**
     * 增值服务
     */
    public valueAddService:string;
    /**
     * 审核状态
     */
    public auditStatus:string;
    /**
     * 证件类型
     */
    public documentType:string;
    /**
    * 证件照片*/
    public documentImg:string[];
    /**
     * 证件号
     */
    public documentNumber:string;
    /**
     * 帐号类型
     */
    public userAccount:any;
    /**
     * 账号
     */
    public bankAccount:any;
    /*
    *支付宝认证姓名*/
    public alipayName:any;
    /*
    * 支付包账号*/
    public alipayAccount:any;
    /**
     * 开户名
     */
    public accountName:any;
    /**
     * 银行名称
     */
    public bankName:any;
    /**
     * 银行支行名称
     */
    public subBranchName:any;
    /**
     * 最大接单数
     */
    public maxOrder:any;
    /**
     * 动态最大接单数
     */
    public dynamicMaxOrder:string;

    /**
     * 保证金阀值
     */
    public marginThreshold:string;
    /**
     * 已缴纳保证金
     */
    public marginPaid:string;
    /**
     * 团队人数
     */
    public teamsNum:string;
    /**
     * 车辆数量
     */
    public carsNum:string;
    /**
     * 车辆容积（方）
     */
    public carVolume:string;
    /**
     * 仓库容积
     */
    public warehouseVolume:string;
    /**
     * 仓库地址
     */
    public warehouseAddress:string;
    /**
     * 合作方式
     */
    public cooperationMethod:string;
    /**
     * 商品范围
     */
    public ProductRange:string;
    /**
     * 结款方式
     */
    public paymentMethod:any;
    /**
     * 工资结算方式
     */
    public wageSettlement:any;
    /**
     * 开发票
     */
    public invoice:string;
    /**
     * 电商节最大处理订单数
     */
    public maxOrders:string;
    /**
     * 平均日订单量
     */
    public averageOrder:string;
    /**
     * 合作时间
     */
    public cooperationTime:string;
    /**
     * 一智通订单占比（%）
     */
    public orderProportion:string ;
    /**
     * 合作单位
     */
    public cooperationUnit:string;
    /**
     * 通行证
     */
    public passport:string;
    /***
     *
     */
   public  cooperationDate:string;
    /**
     *
     */
    public strs:any;
    /**
     * 维修(页标签）
     */

    /**
     * 维修类型标签
     */
    public   maintenanceLable:any[];
    /**
     * 返货
     */
  public  returnGoods:String
}