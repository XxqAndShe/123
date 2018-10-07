/**
 *  京东订单请求vo
 */
export class JdRportVo {
    /**
     *  订单开始日期
     */
    public startDate: string;
    /**
     *  订单结束日期
     */
    public endDate: string;

    /**
     *  签收开始日期
     */
    public signStartDate: string;
    /**
     *  签收结束日期
     */
    public signEndDate: string;
    /**
     * 运单号
     */
    public waybillId: string;
    /**
     * 京东订单号
     */
    public orderNo: string;
    /**
     * 服务类型
     */
    public servicesScope: string;
    /**
     * 是否签收
     */
    public signStatus: string = 'all';
    /**
     * 收货人
     */
    public receiver: string;
    /**
     * 收货地址
     */
    public receiverAddr: string;
}
