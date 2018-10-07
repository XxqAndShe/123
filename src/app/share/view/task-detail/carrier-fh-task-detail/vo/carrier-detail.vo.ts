export class CarrierDetailRespVo{
    //运单号
    waybillId: string;
    //任务单号
    title: string;
    //异常编号
    abnormalNum: string;
    //分配人
    operator: string;
    //服务商类型
    taskReturnType: string;

    //----------节点展示 ---------//
    //进度显示处理
    stepActive: number;
    stepTimes: string[];
    //任务状态
    taskStatus: string;

    //-----------详情信息 ----------//
    //收货人姓名
    consigneeName: string;
    //收货人电话
    consigneeMobile: string;
    //收货地址
    consigneeAddr: string;

    //承运商名字
    carrier: string;
    //承运商联系电话
    cysMobile: string;
    //返货费用
    returnMoney: string;

    //返货商品详细
    taskReturnDetails: any[];
    //备注
    remark: string;

    //货物到达图片
    arriveImgs: string[];
    //返回客户备注
    arriveRemark: string;

    //返回客户图片
    returnCtmerImgs: string[];
    //返回客户备注
    returnCtmerRemark: string;

    //---------
    //轨迹-日志
    taskLogs: any[];
    //跟踪信息
    tracks: any[];
}
