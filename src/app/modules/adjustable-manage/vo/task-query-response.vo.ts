import {InsTaskTrackResponseVo} from "./instask-track-response.vo";
import {ProductVo} from "./product.vo";
import {UserJztVo} from "../../sale-center/page/scheduling/vo/user-jzt.vo";
// import {WaybillVo} from "./waybill.vo";
/**
 * Created by ning on 2017-02-20.
 */
export class TaskQueryResponseVo {
    /**
     * 运单号信息
     */
    // public waybill: WaybillVo;

    /**
     * ?服务类型
     */
    public typeOfService: String;

    /**
     * 跟踪信息
     */
    public trackRemark: InsTaskTrackResponseVo[]

    /**
     * 服务类型
     */
    public serviceType: String;

    /**
     * 货品
     */
    public productList: ProductVo[];

    /**
     * 师傅名称，账号
     */
    public jztUser: UserJztVo;

    /**
     * 分配人
     */
    public disUser: String;

    /**
     * 任务状态
     */
    public taskSts: String;

    /**
     * 支线费
     */
    public branchFee: String;

    /**
     * 安装费
     */
    public installPrice: String;

    /**
     * 提货日期
     */
    public pickUpDate: String;

    /**
     * 提货电话
     */
    public pickUpTel: String;

    /**
     * 提货地址
     */
    public pickUpAddress: String;

    /**
     * 是否星标
     */
    public isStar: String;

    /**
     * 倒计时
     */
    public countDown: String;

    /**
     * 接单日期
     */
    public acceptDate: String;

    /**
     * 预约时间
     */
    public reservationDate: String;

}