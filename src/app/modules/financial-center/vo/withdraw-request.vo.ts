import {UserRequestVo} from "./user-request.vo";
/**财务中心-提现管理-查询请求vo
 * Created by 李鹏程 on 2017-02-24.
 */

export class WithdrawRequestVo{

    /**
     * 师傅id list
     */
    public userWorkerIds:string[]=["0"];

    /**
     * 用户信息，师傅名称，账号
     */
    public user:UserRequestVo;

    /**
     * 审核状态
     */
    public auditStatus:string;

    /**
     * 提现状态
     */
    public withdrawStatus:string;

    /**
     * 申请开始时间
     */
    public beginTime:string;

    /**
     * 申请截止时间
     */
    public endTime:string;

    /**
     * 用户组织id 组织暂时不做
     */
    public userWorkerCompanyId:string;

    /**
     * 当前页
     */
    public currentPage:number = 0;

    /**
     * 每页显示记录数
     */
    public pageSize:number = 10;

    /**
     * 网点
     */
    public companyDepartmentOrPhone : string;

    /**
     * 师傅
     */
    public workNameOrMobile : string;
}
