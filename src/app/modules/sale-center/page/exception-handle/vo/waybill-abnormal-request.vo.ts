/**
 * 异常处理, 请求vo
 *
 * @Author hao
 * @2017/2/27
 */
export class WaybillAbnormalRequestVo {
    /**
     *  异常id
     */
    id: string;

    /**
     *  异常编号
     */
    abnormalNum: string;

    /**
     * 安装师傅
     */
    worker : string;

    /**
     *  运单号
     */
    waybillId: string;

    /**
     * 开单网点
     */
    billDepartId: string;

    /**
     * 发货人
     */
    shipper: string;

    /**
     *  跟踪信息
     */
    trackContent: string;

    /**
     *  收货人
     */
    consigneeName: string;

    /**
     *  收货人电话
     */
    consigneeMobile: string;

    /**
     *  异常来源
     */
    source: string;

    /**
     *  专线单号
     */
    waybillOutInfoId: string;

    /**
     *  异常大类
     */
    abnormalTypeBId: string;

    /**
     *  异常小类
     */
    abnormalTypeSId: string;

    /**
     *  异常类型
     */
    abnormalTypeId: string;

    /**
     *  异常描述
     */
    abnormalDesc: string;

    /**
     *  目的站
     */
    endCity: string;

    /**
     *  收货人省
     */
    receiveProvince: string;

    /**
     *  收货人城镇
     */
    receiveCity: string;

    /**
     *  反馈人
     */
    feedbackMan: string;

    /**
     *  联系方式
     */
    contactWay: string;

    /**
     *  异常状态
     */
    abnoHandleSts: string;

    /**
     *  网点名称
     */
    organizationName: string;

    /**
     *  责任方id
     */
    abnormalDutyId: string;

    /**
     *  是否仲裁
     */
    ifArbitrate: string;

    /**
     *  发货人名称
     */
    shipperName: string;

    /**
     *  处理人
     */
    handlePerson: string;

    /**
     * 处理时间
     */
    handleTime: string;
    /**
     *  处理人名称
     */
    handlePersonName: string;

    /**
     * 登记时间
     */
    registerTime: string;

    /**
     * 创建时间
     */
    stringdateCreated: string;

    /**
     *  登记人名称
     */
    registerPersonName: string;

    /**
     *  登记人id
     */
    registerPersonId: string;

    /**
     *  是否锁定
     */
    ifLock: string;

    /**
     *  是否回复
     */
    ifReply: string;

    /**
     *  是否紧急
     */
    ifUrgent: string;

    /**
     *  是否跟踪
     */
    ifTrack: string;

    /**
     *   处理方式
     */
    handleWay: string;

    /**
     *   售后任务单号
     */
    maintno: string;

    /**
     *   返货运营商名称
     */
    returnOperator: string;

    /**
     *   服务类型
     */
    typeOfService: string;

    /**
     * 售后任务类型
     */
    taskType: string;

    /**
     *  图片
     *  TODO(类型不对, 要对应java里的List)
     */
    fileInfo: string[];

    /**
     *  起始登记时间
     */
    registerTimeBegin: string;

    /**
     *  结束登记时间
     */
    registerTimeEnd: string;

    /**
     *  起始追踪时间
     */
    trackDateStart: string;

    /**
     *  结束追踪时间
     */
    trackDateEnd: string;

    /**
     * 是否锁定
     */
    lock: boolean;

    /**
     *  起始处理时间
     */
    hanTimeBegin: string;

    /**
     *  结束处理时间
     */
    hanTimeEnd: string;

    rejected: Boolean;//已否决
    rejectReason: String;//否决原因
    abnormalDutyName: String;
    assumeFee: number;

    /**
     * 超时未处理:handle;提醒未处理:remind;
     */
    overTime: string;
    /**
     * 可处理
     */
    client: string;
}
