import {AbnormalDutyContextVo} from "./abnormal-duty-context.vo";
/**
 * 异常责任方返回值VO
 * Created by hao on 2017/2/22.
 */

export class AbnormalDutyVo {
    /**
     * content
     */
    public abnormalDutyContextVos: AbnormalDutyContextVo[];
    /**
     * 是否为首页
     */
    public first: string;
    /**
     * 是否为末页
     */
    public last: string;
    /**
     *
     */
    public number: string;
    /**
     *
     */
    public numberOfElements: string;
    /**
     * 每页显示记录数
     */
    public size: string;
    /**
     * 总记录数
     */
    public sotalElements: string;
    /**
     * 总页数
     */
    public totalPages: string;
}
