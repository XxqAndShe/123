import {TaskOtherFeeDutyVo} from "./taskotherfeeduty.vo"
import {TaskOtherFeeRepayVo} from "./taskotherfeerepay.vo"
/**
 * Created by xiaohai on 2017/4/18.
 */
export class AbnormalOtherFeeVo {
    /**
     * 费用名称
     */
    public name: string;
    /**
     * 费用金额
     */
    public fee: number;
    /**
     * 旧费用金额
     */
    public oldFee: number;
    /**
     * 责任人承担信息
     * */
    public taskOtherFeeDuties: TaskOtherFeeDutyVo[];
    /**
     * 补偿对象补偿信息
     * */
    public taskOtherFeeRepay: TaskOtherFeeRepayVo;
}