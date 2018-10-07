import {TaskReturnDetail} from "./taskReturnDetail.vo";
/**
 * Created by hjd on 2017-04-21.
 */
export class TaskReturnV0{


    /**运营商*/
    taskReturnType: string;

    /**任务主表*/
    task: string;

    /**异常信息*/
    abnormal: string;

    /**返货任务明细表*/
    taskReturnDetails: TaskReturnDetail[];

    /**收货联系人*/
    consignee: string;

    /**收货人联系方式*/
    consigneeMoblie: string;

    /**收货地址*/
    consigneeAdr: string;

    /**商家承担金额*/
    assumeFee: number;

    /**备注*/
    remark: string;

    /**提货点*/
    pickUpPoint: string;

    /**收货点*/
    receivePoint: string;

    /**提货联系人*/
    pickUpMan: string;

    /**提货地址*/
    pickUpAdr: string;

    /**提货费用*/
    picFee: number;

    /**提货联系人方式*/
    pickUpManMobile: string;

    /**安装师傅*/
    userWorker: string;
}
