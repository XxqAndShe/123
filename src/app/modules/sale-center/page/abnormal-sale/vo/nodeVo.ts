/**
 * Created by Administrator on 2017-06-02.
 */
export class NodeVo {

    /**
     * 任务状态
     * @type {string}
     */
    public taskStatus:string = "";

    /**
     * 运单号
     */
    public waybillId: string = "";

    /**
     * 任务号
     */
    public title: string = "";

    /**
     * 异常编号
     */
    public abnormalNum: string = "";

    /**
     * 处理人
     */
    public handlePerson: string = "";

    /**
     * 节点时间列表
     */
    public stepTimes: string[] = [];
    /**
     * 节点位置
     */
    public stepActive: number = 0;
}
