/**
 * Created by siYuan on 2017-03-22.
 */
export class GoodsCatalogVo{
    /**
     * 商品名称
     * 要求同步节点下，不能有相同类
     */
    public productName:string;
    /**
     * 当前级别
     * 支持3级（0、1、2级）
     */
    public currentLevel:string;
    /**
     * 当前显示位置
     * 用于排序用（新增时，默认放当前级最后一个位置）
     */
    public currentLocation:number;
    /**
     * 上级id
     */
    public parentId:string;
    /**
     * 本级id
     */
    public Id:string;
    /**
     * 当前页
     */
    public currentPage:number;
    /**
     * 每页大小
     */
    public pageSize:number;
}