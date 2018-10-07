/**
 * Created by xiaoluo on 2017-08-24.
 * 投诉处理VO
 */
export class VComplaintDealReqVo {
    /**
     * 关联的投诉ID
     */
    complaintId: string;
    /**
     * 投诉资料ID
     */
    masterId: string;
    /**
     * 处理状态
     */
    complaintDealStatus: string;
    /**
     * 投诉人姓名
     */
    complainantName: string;
    /**
     * 责任方
     */
    complaintDuty: string;
    /**
     * 责任人名称
     */
    dutyName: string;
    /**
     * 责任人电话
     */
    dutyMobile: string;
    /**
     * 处罚金额
     */
    penaltyFee: string;
    /**
     * 投诉结果
     */
    complaintResult: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 是否服务补救
     */
    hasCompensate: boolean;
    /**
     * 补偿金额
     */
    compensateFee: number;
    /**
     * 补偿备注
     */
    compensateRemark: string;
}
