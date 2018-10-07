import {WaybillVo} from "../../sale-center/page/abnormal-sale/vo/waybill.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class InsTaskTrackResponseVo{
   /**
    * 运单号信息
    */
   public waybill:WaybillVo;
   /**
    * 任务类型
    */
   public taskType:string;
   /**
    * 任务状态
    */
   public taskSts:string;
   /**
    * 分配人
    */
   public disUser:string;

}