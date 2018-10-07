import {UserVo} from "./user.vo";
export class VGoods {

    /**
     * 品名ID
     */
    public id: string;

    /**
     * 商品名称
     */
    public name: string = "";

    /**
     * 单价
     */
    public costFee: string;

    /**
     * 备注
     */
    public remark: string;

    /**
     * 更新人
     */
    public vUser: UserVo;

}
