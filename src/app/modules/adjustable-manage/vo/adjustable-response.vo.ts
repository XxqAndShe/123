/**
 * Created by hua on 2017-02-20.
 */
export class AdjustableResponseVo{
   /*
     调度管理-调度任务  响应-订单分类数据
   */

   public orderType:any={
      /*待分配*/
      waitDistribution:0,
      /*待接单*/
      waitReceive:0,
      /*待预约*/
      waitAppointment:0,
      /*待签收*/
      waitSign:0,
      /*已签收*/
      alreadySign:0,
      /*已作废*/
      alreadyInvalid:0,
      /*全部类型*/
      allType:0
   };
   /*
   订单详细信息弹框
    */
   public orderInfo:any={
      /*订单号*/
      orderNum:'',
      /*客户电话*/
      customerTel:'',
      /*开单网点*/
      openOrderAdd:'',
      /*目的地*/
      destination:'',
   };
   /*
   订单基本信息
    */
   public orderBaseInfo:any={
      /*发货人 和电话*/
      sendMan:'',
      sendTel:'',
      /*收货人 和电话*/
      receiveMan:'',
      receiveTel:'',
      /*发货人地址 和收货人地址*/
      sendAdd:'',
      receiveAdd:'',
      /*费用，总费用、配送费、安装费*/
      sendMaster:'',//发货师傅
      sendMasterTel:'',//发货师傅
      receiveMaster:'',//收货师傅
      receiveMasterTel:'',//收货师傅
      allFee:'',
      sendFee:'',
      installFee:'',
      /*预约上门时间*/
      timeBooking:'',
      /*是否需要核销*/
      verification:'',
      /*付款方式*/
      paymentMethod:'',
      /*合计金额*/
      allMoneny:'',
      allWeight:'',//产品总重量
      /*产品详情信息*/
      production:[
         {
            productionName:'',//产品名称
            packaging:'',//包装类型
            productionNum:'',//产品件数
            weight:'',//重量
            volume:'',//体积
            billingWay:'',//计费方式,
            declaredValue:'',
            fee:'',//费用
            valuationFee:'',//保价费
            installFee:'',//安装费
            sendGoodFee:'',//送货费
            pickUpFee:'',//提货费
         }
      ]
   };
   /*
   提货信息
    */
   public pickUpGoodInfo:any={
      logisticsCompany:'',//物流公司
      logisticsOrder:'',//物流单号
      pickUpTel:'',//提货电话,
      pickUpNum:'',//提货码
      pickUpAdd:'',//提货地址
      pickUpMark:'',//提货备注
   };
   /*
   签收信息
    */
   public signInfo:any={
     signMan:'',//签收人
     signState:'',//签收状态
     signDes:'',//签收描述
     signPic:''//签收图片
  }
}