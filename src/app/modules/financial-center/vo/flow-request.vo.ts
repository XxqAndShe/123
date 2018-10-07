/**师傅流水查询请求vo
 * Created by 李鹏程 on 2017-02-25.
 */

export class FlowRequestVo{
    /**
     * 组织id
     */
    public organizationId:string;//默认值，测试使用(暂不考虑)

    /**
     * 师傅姓名
     */
    public masterName:string;

    /**
     * 师傅账号
     */
    public masterAccount:string;


    /**
     * 签收时间
     */
    public signTime:string;

    /**
     * 截止时间
     */
    public endTime:any;
    /**
     * 任务号
     */
    public waybillId:any;
    /**
     * 提现状态
     */
    public status:any;

    /**
     * 网点
     */
    public companyDepartmentOrPhone:any;

    /**
     * 师傅
     */
    public workNameOrMobile:any;
}
