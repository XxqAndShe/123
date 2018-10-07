import {WaybillVo} from "../../abnormal-sale/vo/waybill.vo";
import {AbnormalTypeResponseVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-response.vo";
/**
 * Created by siYuan on 2017-03-21.
 */
export class AbnormalModifyVo{

    public id:string;

    public waybillId:string; // 运单号

    public vWaybill:WaybillVo; // 运单

    public abnormalDesc:string; //异常描述

    public vAbnormalType:AbnormalTypeResponseVo //异常类型

    public abnormalTypeBId:string; // 异常大类id

    public abnormalTypeSId:string; // 异常小类id

    public feedbackMan:string; // 反馈人

    public contactWay:string; // 联系方式

    public source:string; //异常来源

    public cys:string; //承运商

    public  fileInfo:string[]; //异常图片
}