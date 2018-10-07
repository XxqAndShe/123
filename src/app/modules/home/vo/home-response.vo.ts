/**
 * 主页响应Vo
 */
export class HomeResponseVo {
    /**
     * 待跟踪任务数
     */
    public waitTrack: number;

    /**
     * 待调度任务
     */
    public waitDispatch: number;

    /**
     * 待维修任务
     */
    public waitFix: number;

    /**
     * 待返货
     */
    public waitReturn: number;

    /**
     * 待处理异常
     */
    public waitAbnormal: number;

    /**
     * 时效异常数
     */
    public waitAgingAnomaly: number;

}