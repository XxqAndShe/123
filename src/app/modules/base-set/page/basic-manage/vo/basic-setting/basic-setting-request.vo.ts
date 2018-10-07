/**
 * 售后基础管理vo
 *
 * @Author hao
 * @Date 2017/2/23
 */

export class BasicSettingRequestVo {

    /**
     * 名称
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

    /*
    * p1-p5选择下拉框*/
    selectP:string

}
