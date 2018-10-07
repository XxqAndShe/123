/**
 * Created by xiaoluo on 2017-08-23.
 * 申诉VO
 */
export class VComplaintAppealReqVo {
    /**
     * 关联的投诉ID
     */
    complaintId: string;
    /**
     * 申诉人姓名
     */
    appealName: string;
    /**
     * 申诉人电话
     */
    appealMobile: string;
    /**
     * 申诉内容
     */
    appealContent: string;
    /**
     * 投诉结果
     */
    complaintResult: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 图片地址
     */
    fileInfos: string;
}
