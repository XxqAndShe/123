import {AbnormalTaskVo} from "../../abnormal-sale/vo/abnormal-task.vo";
import {WaybillVo} from "../../abnormal-sale/vo/waybill.vo";
import {RepairTaskVo} from "./repair-task.vo";
import {ReturnTaskVo} from "./return-task.vo";
import {TaskTrackVo} from "../../abnormal-sale/vo/task-track.vo";
import {AreaVo} from "../../abnormal-sale/vo/area.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class AfterDispatchResponseVo{
   /**
    * 异常售后任务返回值对象
    */
   public vAbnormalTask:AbnormalTaskVo;
   /**
    * 运单
    */
   public vWaybill:WaybillVo;
   /**
    * 任务状态
    */
   public nodeType:string;
   /**
    * 维修任务信息
    */
   public vRepairTask:RepairTaskVo;
   /**
    * 返货任务信息
    */
   public vReturnTask:ReturnTaskVo;
   /**
    * 返货任务信息
    */
   public vTaskTrack:TaskTrackVo;
   /**
    * 返货任务信息
    */
   public vArea:AreaVo;

}