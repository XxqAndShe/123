import {UserVo} from "./user.vo";
/**
 * Created by zhaojinglong on 2017-02-25.
 */
export class TaskNodeVo{
    /**
     * 操作节点类型
     */
    public nodeType:string;
    /**
     * 操作人
     */
    public vUser:UserVo;
    /**
     * 操作时间
     */
    public operationTime:string;
    /**
     * 操作信息
     */
    public operationInfo:string;

}