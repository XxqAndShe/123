/**
 * Created by xiaoluo on 2017-08-23.
 * 投诉列表请求VO
 */
export class VComplaintListReqVo {
    /**
     * 创建开始时间
     */
    dataCreatedBeginTime: string;
    /**
     * 创建结束时间
     */
    dataCreatedEndTime: string;
    /**
     * 责任人名称
     */
    dutyName: string;
    /**
     * /是否已回访
     */
    visitedStatus: string;
    /**
     * 任务单号
     */
    taskTitles: string;
    /**
     * 投诉大类ID
     */
    bigCatalogId: string;
    /**
     * 投诉小类ID
     */
    smallCatalogId: string;
    /**
     * 投诉人姓名
     */
    complainantName: string;
    /**
     * 是否成立
     */
    complaintResult: string;
    /**
     * 发货人名称
     */
    shipperName: string;
    /**
     * 处理状态
     */
    complaintDealStatus: string;
}
