import {CustomerVo} from "./customer.vo";
import {UserJztVo} from "./user-jzt.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class AfterDispatchRequestVo{
    /**
     * 发货人
     */
    public shipper:CustomerVo;
    /**
     * 收货人
     */
    public consignee:CustomerVo;
    /**
     * 运单号
     */
    public waybillId:string;
    /**
     * 售后单号
     */
    public maintno:string;
    /**
     * 异常售后任务ID
     */
    public abnormalTaskId:string;
    /**
     * 师傅
     */
    public vUserJzt:UserJztVo;
    /**
     * 节点类型
     */
    public nodeType:string;
    /**
     * 售后任务类型#维修、返货、补件、其他
     */
    public taskType:string;
    /**
     * 地区Code
     */
    public areaCode:string;
    /**
     * 任务生成时间 (开始)
     */
    public createTimeStart:string;
    /**
     * 任务生成时间(结束)
     */
    public createTimeEnd:string;
    /**
     * 跟踪时间 (开始)
     */
    public trackTimeStart:string;
    /**
     * 跟踪时间(结束)
     */
    public trackTimeEnd:string;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}