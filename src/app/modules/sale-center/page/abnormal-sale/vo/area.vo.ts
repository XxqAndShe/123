import {CustomerVo} from "../../scheduling/vo/customer.vo";
import {UserJztVo} from "../../scheduling/vo/user-jzt.vo";
/**
 * Created by zhaojinglong on 2017-02-23.
 */
export class AreaVo{
    /**
     * id
     */
    public id:string;
    /**
     * 国标码
     */
    public code:CustomerVo;
    /**
     * 名称
     */
    public name:CustomerVo;
    /**
     * 地址全称
     */
    public fullName:string;
    /**
     * 父节点
     */
    public parent:AreaVo;
    /**
     * 家装通用户
     */
    public userJzts:UserJztVo[];
    /**
     * 当前页
     */
    public currentPage:string;
    /**
     * 每页显示记录数
     */
    public pageSize:string;

}