/**
 * 异常登记, 请求vo
 *
 * @Author wuxinghai
 * @2017/04/10
 */
export class WaybillAbnormalEditVo{
    /**
     * 异常id
     * */
    public id:string;
    /**
     * 运单编号
     * */
    public waybillId:string;
    /**
     * 异常大类
     * */
    public bAbnormalTypeID:string;
    /**
     * 异常小类
     * */
    public abnormalTypeID:string;
    /**
     * 反馈人
     * */
    public  feedbackMan:string;
    /**
     * 反馈人电话
     * */
    public feedBackPhone:string;
    /**
     * 异常描述
     * */
    public  describe:string;
    /**
     * 异常图片
     * */
    public  fileInfos:string[];

    /**
     * 异常来源
     */
    public source: string;

}