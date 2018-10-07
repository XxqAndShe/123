/**
 * 异常责任方请求vo
 *
 * @Author hao
 * @Date 2017/2/23
 */

export class AbnormalDutyRequestVo {

    /**
     * id
     */
    id: string;
    /**
     * 异常责任方名称
     */
    name: string;
    /**
     * 当前页, 默认为1
     */
    page: string;
    /**
     * 每页显示记录数, 默认10
     */
    rows: string;

}
