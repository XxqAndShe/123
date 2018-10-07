/**
 * Created by xiaoluo on 2017-08-24.
 * 投诉回访VO
 */
export class VComplaintVisitedReqVo {
    /**
     * 关联的投诉ID
     */
    complaintId: string;
    /**
     * 对投诉处理态度
     */
    CmplaintDealSatisfaction: string;
    /**
     * 其他
     */
    others: string;
    /**
     * 回访是否成功
     */
    complaintVisitedResult: string;
}
