/**
 * Created by 1 on 2017/8/21.
 */
export class ComplaitManageVo{
    /**
     * 投诉人
     */
    public createUserName:string;
    /**
     * 投诉小类id
     */
    public smallCatalogId:string;
    /**
     * 投诉大类id
     */
    public bigCatalogId:string;
    /**
     * 责任方
     */
    public complaintDuty:string;

    /**
     * 开始时间
     */
    public createBeginTime:string;
    /**
     * 结束时间
     */
    public createEndTime:any;
}
