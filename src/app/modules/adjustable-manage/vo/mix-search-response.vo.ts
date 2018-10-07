/**
 * Created by 李鹏程 on 2017-02-23.
 * 综合查询响应vo
 */

export class MixSearchResponseVo{
    /**
     * 运单号信息
     */
    public waybill:string;

    // /**
    //  * ?服务类型
    //  */
    // public typeOfService:string;

    // /**
    //  * 跟踪信息
    //  */
    // List<VTrackRemarkResponse> trackRemark;

    /**
     * 服务类型
     */
    public serviceType:string;

    // /**
    //  * 货品
    //  */
    // List<VProduct> ProductList;

    /**
     * 师傅名称，账号
     */
    public jztUser:string;

    /**
     * 分配人
     */
    public disUser:string;

    /**
     * 任务状态
     */
    public taskSts:string;

    /**
     * 支线费
     */
    public branchFee:string;

    /**
     * 安装费
     */
    public installPrice:string;

    /**
     * 提货日期
     */
    public pickUpDate:string;

    /**
     * 提货电话
     */
    public pickUpTel:string;

    /**
     * 提货地址
     */
    public pickUpAddress:string;

    /**
     * 是否星标
     */
    public isStar:string;

    /**
     * 倒计时
     */
    public countDown:string;

    /**
     * 接单日期
     */
    public acceptDate:string;

    /**
     * 预约时间
     */
    public reservationDate:string;
}
