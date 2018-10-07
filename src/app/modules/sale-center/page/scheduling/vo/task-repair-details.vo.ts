import {VTaskLog} from "./task-log.vo";
import {VGoods} from "./goods.vo";
/**
 *  维修详情vo
 */
export class VTaskRepairDeatils {
    //---返修
    //运单号
    public waybillId: string = "";
    //任务单号
    public title: string = "";
    //异常编号
    public abnormalNum: string = "";
    public abnormalImgs: Array<string>;
    //分配人
    public operator: string = "";
    //节点日志，节点类型、节点操作时间-对象
    public taskLogs: Array<VTaskLog>;
    //发货人姓名
    public shipperName: string = "";
    //发货人电话
    public shipperMobile: string = "";
    //提货地址
    public deliveryAddress: string = "";
    //付款方式
    public payTypeName: string = "";
    public paymentType: string = "";
    //商家承担金额
    public assumefee: string = "";
    //运单金额
    public waybillFee: string = "";
    public remark: string = "";
    //合计金额
    public totalCost: string = "";
    //收货人姓名
    public consigneeName: string = "";
    //收货人电话
    public consigneeMobile: string = "";
    //收货地址
    public consigneeAddr: string = "";
    //分配师傅姓名
    public masterUserName: string = "";
    //师傅电话
    public masterUserMobile: string = "";
    //服务费,给师傅费用
    public masterFee: string = "";
    //预约上门时间
    public yuYueTime: string = "";
    //维修商品明细信息-对象
    public vGoodss: Array<VGoods>;
    public goodsNames: string;
    //任务完成描述
    public describe: string = "";
    //任务完成签收图片
    public signImgsPath: Array<string>;

    //任务状态
    public taskStatus: string;

    public stepTimes: Array<string>;
    public stepActive: number;

    //----------返货
    public taskReturnType: string = ""
    //提货费用
    public picFee: string = "";
    //提货人
    public picUpMan: string = "";
    //提货电话
    public picUpManMobile: string = "";
    //提货地址
    public picAddr: string = "";
    //指定物流公司
    public logisticsName: string = "";
    //指定物流公司电话
    public logisticsMobile: string = "";
    //----提货完成实际物流信息
    //实际物流公司名称
    public logisticsRealName: string = "";
    //物流单号
    public logisticsBill: string = "";
    //物流电话
    public logisticsTel: string = "";
    //提货实际金额
    public arrivePayMoney: string = "";
    public shipperAdr: string = "";
    public shippingAddress: string = "";
    public department: string = "";
    public departmentTel: string = "";
}
