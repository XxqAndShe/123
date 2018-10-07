/**
 * Created by hua on 2017-02-20.
 */
import {Injectable} from "@angular/core";
@Injectable()
export class AdjustableModuleVoService{
    /*获取台服务接口返回的数据  赋值给组件属性，*/
    getOrderType(localOrderObj:any,responseData:any){
        localOrderObj.waitDistribution=responseData.waitDistribution;
        localOrderObj.waitReceive=responseData.waitReceive;
        localOrderObj.waitAppointment=responseData.waitAppointment;
        localOrderObj.waitSign=responseData.waitSign;
        localOrderObj.alreadySign=responseData.alreadySign;
        localOrderObj.alreadyInvalid=responseData.alreadyInvalid;
        localOrderObj.allType=responseData.allType;
    }

    /*获取订单号的详细信息*/
    getOrderInfo(order:any,responseData:any){
        order.orderNum=responseData.orderNum;
        order.customerTel=responseData.customerTel;
        order.openOrderAdd=responseData.openOrderAdd;
        order.destination=responseData.destination;
    }

    /*获取订单基本信息数据*/
    getOrderBaseInfo(order:any,responseData:any){
                    order.sendMan=responseData.sendMan;
                    order.sendTel=responseData.sendTel;
                    /*收货人 和电话*/
                    order.receiveMan=responseData.receiveMan;
                    order.receiveTel=responseData.receiveTel;
                    /*发货人地址 和收货人地址*/
                    order.sendAdd=responseData.sendAdd;
                    order.receiveAdd=responseData.receiveAdd;
                    order.sendMaster=responseData.sendMaster;
                    order.receiveMaster=responseData.receiveMaster;
                    /*费用，总费用、配送费、安装费*/
                    order.allFee=responseData.allFee;
                    order.sendFee=responseData.sendFee;
                    order.installFee=responseData.installFee;
                    /*预约上门时间*/
                    order.timeBooking=responseData.timeBooking;
                    /*是否需要核销*/
                    order.verification=responseData.verification;
                    /*付款方式*/
                    order.paymentMethod=responseData.paymentMethod;
                    /*合计金额*/
                    order.allMoneny=responseData.allMoneny;
                    /*产品详情信息*/
                    for(let i=0,len=responseData.production.length;i<len;i++){
                        if(order.production.length<len){
                            for(let j=0;j<len-1;j++){
                                order.production.push(responseData.production[0]);
                            }
                        }
                        order.production[i].productionName=responseData.production[i].productionName;
                        order.production[i].packaging=responseData.production[i].packaging;
                        order.production[i].productionNum=responseData.production[i].productionNum;
                        order.production[i].weight=responseData.production[i].weight;
                        order.production[i].volume=responseData.production[i].volume;
                        order.production[i].billingWay=responseData.production[i].billingWay;
                        order.production[i].declaredValue=responseData.production[i].declaredValue;
                        order.production[i].fee=responseData.production[i].fee;
                        order.production[i].valuationFee=responseData.production[i].valuationFee;
                        order.production[i].installFee=responseData.production[i].installFee;
                        order.production[i].sendGoodFee=responseData.production[i].sendGoodFee;
                        order.production[i].pickUpFee=responseData.production[i].pickUpFee;
                    }
    }

    /*获取订单提货信息*/
    getPickUpGoodInfo(pickup:any,responseData:any){
        pickup.logisticsCompany=responseData.logisticsCompany;
        pickup.logisticsOrder=responseData.logisticsOrder;
        pickup.pickUpTel=responseData.pickUpTel;
        pickup.pickUpNum=responseData.pickUpNum;
        pickup.pickUpAdd=responseData.pickUpAdd;
        pickup.pickUpMark=responseData.pickUpMark;
    }

    /*获取签收信息*/
    getSignInfo(sign:any,responseData:any){
        sign.signMan=responseData.signMan;
        sign.signState=responseData.signState;
        sign.signDes=responseData.signDes;
        sign.signPic=responseData.signPic;
    }
}