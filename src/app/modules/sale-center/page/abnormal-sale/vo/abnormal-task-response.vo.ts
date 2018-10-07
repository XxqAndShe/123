import {AbnormalTaskVo} from "./abnormal-task.vo";
import {WaybillAbnormalVo} from "./waybill-abnormal.vo";
import {WaybillVo} from "./waybill.vo";
import {CustomerVo} from "../../scheduling/vo/customer.vo";
import {TaskTrackVo} from "./task-track.vo";
import {AbnormalTypeResponseVo} from "../../../../base-set/page/basic-manage/vo/basic-setting/abnormal-type-response.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class AbnormalTaskResponseVo{
   /**
    * 异常售后任务返回值对象
    */
   public vAbnormalTask:AbnormalTaskVo;
   /**
    * 运单异常表返回值对象
    */
   public vWaybillAbnormal:WaybillAbnormalVo;
   /**
    * 运单
    */
   public vWaybill:WaybillVo;
   /**
    * 发货人
    */
   public shipper:CustomerVo;
   /**
    * 收货人
    */
   public consignee:CustomerVo;
   /**
    * 异常售后任务跟踪信息响应值对象
    */
   public vTaskTrack:TaskTrackVo;
   /**
    * 跟踪状态
    */
   public abnoTrackSts:string;
   /**
    * 服务类型
    */
   public serviceType:string;
   /**
    * 售后状态
    */
   public nodeType:string;
   /**
    * 异常类型
    */
   public vAbnormalType:AbnormalTypeResponseVo;
   /**
    * 异常类型父类
    */
   public vAbnormalTypeParent:AbnormalTypeResponseVo;

}