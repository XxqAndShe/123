/**
 * 异常基础资料 请求vo
 *
 * @Author hao
 * @Date 2017/2/24
 */
export class ExceptionDataRequestVo {

    /**
     * page, 当前页, 选填, 默认1
     */
    page: string;
    /**
     * rows, 每页显示记录数, 选填, 默认10
     */
    rows: string;
    /**
     * id
     */
    id: string;
    /**
     * abnormalTypeSId 异常小类id, 选填
     */
    abnormalTypeSId: string;
    /**
     * abnormalTypeBId 异常大类id, 选填
     */
    abnormalTypeBId: string;
    /**
     * source 异常来源, 选填, 枚举
     */
    source: string[];
    /**
     * startRegDate 起始登记时间, 选填
     */
    startRegDate: string;
    /**
     * endRegDate 结尾登记时间, 选填
     */
    endRegDate: string;
    /**
     * 责任方id
     */
    abnormalDutyId: string;
    /**
     * 费用标准
     */
    feeStandard: string;
    /**
     * 处理方式
     */
    handleWay: string;
    /**
     * 操作步骤
     */
    operateType: string;
    /**
     * 异常备注
     */
    description: string;
    /**
     * 来源ID
     */
    sourceIds: string[] = [];
    
}
