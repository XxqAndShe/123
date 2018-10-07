import {AbnormalDutyRequestVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-duty-request.vo";
import {AbnormalTypeRequestVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-request.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class WaybillAbnormalVo{
    /**
     * 异常编号
     */
    public id:string;
    /**
     * 收货人
     */
    public consigneeName:string;
    /**
     * 处理人名称
     */
    public handlePersonName:string;
    /**
     * 处理方式
     */
    public handleWay:string;
    /**
     * 异常来源
     */
    public source:string;
    /**
     * 服务类型
     */
    public typeOfService:string;
    /**
     * 返货运营商名称
     */
    public returnOperator:string;
    /**
     * 异常类型
     */
    public vAbnormalType:AbnormalTypeRequestVo;
    /**
     * 责任方
     */
    public vAbnormalDuty:AbnormalDutyRequestVo;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}