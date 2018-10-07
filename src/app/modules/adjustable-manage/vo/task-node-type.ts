export class TaskNodeType {
    /*待分配*/
    waitDistribution: number;
    /*待接单*/
    distributionWaitAccept: number;
    /*待预约*/
    waitAppointment: number;
    /*待签收*/
    waitSign: number;
    /*已签收*/
    doSign: number;
    /*已作废*/
    invalid: number;
    /*全部类型*/
    all: number;
}