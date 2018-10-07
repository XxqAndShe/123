/**
 * Created by Administrator on 2017/5/23.
 */
export class addModifyMasterVo{
    /**
    * 地区*/
    public area:string;
    /**
     * 发货人*/
    public shipper:any;
    /**
     * 订单类型*/
    public ordertype:string;
    /**
     * 物流公司*/
    public transportCompany:string;

    public workerName:string;
    /**
     * 师傅姓名*/
    public workerNames:string[];

    //师傅数组
    public worker:any[];

    //id
    public id:string;
}
