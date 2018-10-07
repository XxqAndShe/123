/**
 * 分页信息vo
 *
 * @Author hao
 * @Date 2017/2/23
 */

export class PageInfoVo {
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
