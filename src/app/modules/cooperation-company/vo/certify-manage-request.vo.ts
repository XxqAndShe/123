/**
 * Created by jianconglee on 2017-02-27.
 */

export class CertifyManageRequestVo{
    /**
     * 服务区域代码
     */
    public areaCode:string;
    /**
     * 常规服务
     */
    public typeOfService:string;
    /**
     * 增值服务
     */
    public valueAddService:string;
    /**
     * 审核状态
     */
    public auditStatus:string;
    /**
     * 师傅名称
     */
    public masterName:string;
    /**
     * 师傅帐号
     */
    public masterAccount:string;
    /**
     * 师傅用户ID
     */
    public masterId:string;
    /**
     * 认证不通过的原因
     */
    public authFailedReason:string;
    /**
     * 审核指令 pass notPass
     */
    public auditStatusOrder:string;
}