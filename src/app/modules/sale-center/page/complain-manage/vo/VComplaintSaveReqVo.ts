/**
 * Created by xiaoluo on 2017-08-24.
 * 添加投诉请求VO
 */
export class VComplaintSaveReqVo {
    /**
     * id
     */
    id: string;
    /**
     * 投诉单号
     */
    complaintNo: string;
    /**
     * 任务号
     */
    taskTitle: string;
    /**
     * 投诉人姓名
     */
    complainantName: string;
    /**
     * 投诉人电话
     */
    complainantMobile: string;
    /**
     * 投诉内容
     */
    complaintContent: string;
    /**
     * 投诉来源
     */
    complaintSource: string;
    /**
     * 图片地址
     */
    fileInfos: string;
}
