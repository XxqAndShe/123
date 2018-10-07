import {AbnoSource} from "./abnoSource.vo";
import {TaskReturnType} from "./taskReturnType.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class AbnormalTaskRequestVo{
    /**
     *任务类型
     */
    public taskType:string;

    /**
     * 开单网点
     */
    public billDepart:string;

    /**
     * 发货人
     */
    public shipper:string;

    /**
     * 运单号
     */
    public waybillId:string;

    /**
     * 任务单号
     */
    public taskId:string;

    /**
     * 处理开始时间
     */
    public handelStartTime:string;

    /**
     * 处理结束时间
     */
    public handelEndTime:string;

    /**
     *目的地
     */
    public destination:string;

    /**
     * 处理方式
     */
    public handelWay:string;

    /**
     * 异常类型(没完善)
     */
    public abnormalTypeId:string;

    /**
     *异常来源
     */
    public source:AbnoSource;

    /**
     *责任方
     */
    public abnormalDutyName:string;

    /**
     *服务类型
     */
    public serviceType:string;

    /**
     *处理人
     */
    public handlePerson:string;

    /**
     *返货运营商
     */
    public taskReturnType:TaskReturnType;
    /**
     * 是否异常售后跟踪
     */
    public trace:boolean;
  /**
   * 跟踪时间
   */
  public trackTime:string;


}
