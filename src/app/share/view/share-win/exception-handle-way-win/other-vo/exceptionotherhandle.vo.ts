/**
 * Created by xiaohai on 2017/4/18.
 */
export class ExceptionOtherHandleVo{
    /**
     * 异常处理ID
     */
   public abnormalId:string;
    /**
     * 其他任务信息
     */
   public taskOther:any;
    /**
     * 其他任务运单修改信息
     */
   public taskOtherWaybill:any;
    /**
     * 其他任务商品信息
     * */
   public taskOtherWaybillGoods:any[];
    /**
     *  其他任务责任方信息Id(字典表Id)
     * */
   public taskOtherWaybillDutysId:any[];
    /**
     * 费用信息
     * */
   public abnormalOtherFees:any[];
}