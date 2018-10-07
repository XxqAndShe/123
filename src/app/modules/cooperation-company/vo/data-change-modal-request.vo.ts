/**
 * Created by jianconglee on 2017-02-27.
 */

export class DataChangeModalRequestVo{
    /**
     * 师傅姓名
     */
    public masterName:string;
    /**
     * 师傅帐号
     */
    public masterAccount:string;
    /**
     * 师傅id
     */
    public masterId:string;
    /**
     * 师傅审核状态
     */
    public auditStatusCN:string;
    /**
     * 是否通过审核，pass, notPass
     */
    public auditStatus:string;
    /**
     * 不通过的原因
     */
    public auditRemark:string;
}