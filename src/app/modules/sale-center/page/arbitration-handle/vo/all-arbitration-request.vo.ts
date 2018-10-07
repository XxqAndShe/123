/**
 * Created by 罗有利 on 2017-03-15.
 * 仲裁处理查询请求Vo
 */
export class AllArbitrationRequestVo {

    /**
     * 异常ID
     */
    abId:string;
    /**
     * 登记开始时间
     */
    dateStart:string;
    /**
     * 登记结束时间
     */
    dateEnd :string;
    /**
     * /当前页
     */
    pageNum: string;
    /**
     * /每页显示记录数
     */
    pageSize: string;
    /**
     * 运单号
     */
    waybillId :string;
    /**
     * 异常中文状态
     */
    arbStatus:string = 'All';
    /**
     * 处理开始时间
     */
    handleStartDate:string;
    /**
     * 处理结束时间
     */
    handleEndDate:string;
    /**
     * 仲裁时间
     */
    arbDate:string;
    /**
     * 异常大类
     */
    bigType:string;
    /**
     * 异常小类
     */
    smallType:string;
    /**
     * 异常类型编号
     */
    abTypeCode:string;
    /**
     * 异常来源
     */
    source:string;
    /**
     * 是否跟踪
     */
    isTrack:string;
    /**
     * 跟踪时间
     */
    trackTime:string;

}
