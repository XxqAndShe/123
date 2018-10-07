/**
 * Created by 罗有利 on 2017-02-27.
 * 仲裁处理跟踪日志Vo
 */
export class TrackWinRequestVo {

    /**
     * 仲裁ID
     */
    public abID: string;
    /**
     * 跟踪时间分钟 ，暂时不用此字段
     */
    public tracktimeStr: string;
    /**
     * 跟踪日期时间
     */
    public trackTime: string;
    /**
     * 跟踪内容
     */
    public trackContent: string;
    /**
     * 跟踪人
     */
    public trackManId: string;
}