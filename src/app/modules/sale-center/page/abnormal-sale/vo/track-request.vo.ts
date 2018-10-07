import {WaybillAbnormalVo} from "./waybill-abnormal.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class TrackRequestVo{
    /**
     * 跟踪日期
     */
    public trackTime:string;
    /**
     * 跟踪时间段
     */
    public time:string;
    /**
     * 跟踪信息
     */
    public remark:string;
    /**
     * 是否下次跟踪
     */
    public isNextTrack:string;
    /**
     * 任务Id
     */
    public taskId:string;
    /**
     * 跟踪信息Id
     */
    public id:string;
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}