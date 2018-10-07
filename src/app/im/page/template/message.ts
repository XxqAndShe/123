

export function getAnswerMessageTmpl(headImgUrl:string,userName: string, dateTime: any, message: string, type: any, seat?: any) {

    switch (type) {
        case "TEXT":
            return textMsg(headImgUrl,userName, dateTime, message, seat);
        case "IMAGE":
            return imgMsg(headImgUrl,userName, dateTime, message, seat);
        case "FILE":
            return fileMsg(headImgUrl,userName, dateTime, message, seat);
        case "TASK":
            return orderMsg(headImgUrl,userName, dateTime, message, seat);
        default:
            return ``;
    }
}
/**
 *
 * @param userName
 * @param dateTime
 * @param message
 * @param seat
 * @returns {string}
 */
let textMsg = (headImgUrl:string,userName: string, dateTime: any, message: string, seat?: any) => {
    let head = headImgUrl || '/assets/touxiang.jpg';
    let positionCls = 'right';
    if (!seat) {
        positionCls = "left"
    }
    return `
            <div class="chat_box">
               <div class="${positionCls}">
                   <p>${dateTime}</p>
                      <div class="u_pic"><img src="${head}" alt=""></div>
                      <div class="u_cont" id="u_cont">
                         <p>${userName}</p>
                         <div class="text_chat" id="text_chat">${message}</div>
                    </div>
               </div>
            </div>
            `;
};
/**
 * 图片信息
 * @param userName
 * @param dateTime
 * @param message
 * @param seat
 * @returns {string}
 */
let imgMsg = (headImgUrl:string,userName: string, dateTime: any, message: string, seat?: any) => {
    let head = headImgUrl || '/assets/touxiang.jpg';
    var fileObj = JSON.parse(message);
    let imgUrl = "javascript:void(0)";
    let positionCls = 'right';
    if (!seat) {
        positionCls = "left";
        imgUrl = fileObj.url;
    }
    return `
            <div class="chat_box">
               <div class="${positionCls}">
                   <p>${dateTime}</p>
                      <div class="u_pic"><img src="${head}" alt=""></div>
                      <div class="u_cont" id="u_cont">
                         <p>${userName}</p>
                         <div class="text_chat" id="text_chat">
                            <a rel="fancybox" href="${fileObj.url}">
                              <img src="${fileObj.url}"/>
                            </a>
                        </div>
                    </div>
               </div>
            </div>
            `;
};
let orderMsg = (headImgUrl:string,userName: string, dateTime: any, message: any, seat?: any) => {
    let head = headImgUrl || '/assets/touxiang.jpg';
    var taskObj = JSON.parse(message);
    let positionCls = 'right';
    if (!seat) {
        positionCls = "left";
    }
    return `
            <div class="chat_box">
               <div class="${positionCls}">
                   <p>${dateTime}</p>
                      <div class="u_pic"><img src="${head}" alt=""></div>
                      <div class="u_cont" id="u_cont">
                         <p>${userName}</p>
                         <div class="order_chat" id="order_chat">
                            <p class="order_id"><a  id="task_id_a" data-orid="${taskObj.id}" data-ortype="${taskObj.taskType}" href="javascript:void(0);" style="color: dodgerblue;">${taskObj.taskId}</a></p>
                            <p class="order_id">收货人: ${taskObj.consignee}</p>
                            <p class="order_id">${taskObj.taskTypeCN}</p>
                         </div>
                    </div>
               </div>
            </div>
            `;
};
let fileMsg = (headImgUrl:string,userName: string, dateTime: any, message: any, seat?: any) => {
    let head = headImgUrl || '/assets/touxiang.jpg';
    var fileObj = JSON.parse(message);
    let positionCls = 'right';
    if (!seat) {
        positionCls = "left";
    }
    return `
            <div class="chat_box">
               <div class="${positionCls}">
                   <p>${dateTime}</p>
                      <div class="u_pic"><img src="${head}" alt=""></div>
                      <div class="u_cont" id="u_cont">
                         <p>${userName}</p>
                         <div class="file_chat" id="file_chat" >
                            <p class="file_id"><img style="width: 30px; height: 30px;" src="/assets/im-img/ico.png"><span>文件名:  ${fileObj.name}</span></p>
                            <a class="file_reject" id="file_reject"  href="javascript:;">拒绝</a>
                            <a class="file_accept" id="file_accept" target="_blank" href=${fileObj.url}>接收</a>
                         </div>
                    </div>
               </div>
            </div>
            `;
};

/*任务订单模板*/
export function getTaskOneTmpl(order: any) {
    if (!order) return ``;

    switch (order.orderType) {
        case 1:
            return OneTpl(order);
        case 2:
            return SecondTpl(order);
        case 3:
            return ThirdTpl(order);
        default:
            return ``;
    }

}

/*新任务 type:1*/
let OneTpl = (order: any) => {
    return `
              <li class="h1">任务号：${order.taskDetails.taskTitle}<b>${order.taskDetails.taskStatus}</b></li>
              <li>安装类型：${order.taskDetails.waybillServiceType}</li>
              <li>安装产品：${order.goods}</li>
              <li>配送费:<b>¥ ${order.taskDetails.branchFee}</b></li>
              <li>安装费:<b>¥ ${order.taskDetails.installFee}</b></li>
              
              <li class="h1">安装信息</li>
              <li>安装地址：${order.taskDetails.receiveAddress}</li>
              <li>客户姓名：${order.taskDetails.consigneeName}</li>
              <li>联系电话：${order.taskDetails.consigneeTel}</li>
              
              <li class="h1">提货信息</li>
              <li>提货地址：${order.taskDetails.addr}</li>
              <li>提货  码：${order.taskDetails.code}</li>
              <li>提货电话：${order.taskDetails.tel}</li>
            `;
};
/*返修 type:2*/
let SecondTpl = (order: any) => {
    return `
              <li class="h1">任务号：${order.taskDetails.title}<b>${order.taskDetails.taskStatus}</b></li>
              <li>返货货物：${order.goods}</li>
              <li>返货费:<b>¥ ${order.taskDetails.picFee}</b></li>
              
              <li class="h1">返货信息</li>
              <li>收货地址：${order.taskDetails.consigneeAddr}</li>
              <li>收货姓名：${order.taskDetails.consigneeName}</li>
              <li>收货电话：${order.taskDetails.consigneeMobile}</li>
              
              <li class="h1">提货信息</li>
              <li>提货地址：${order.taskDetails.picAddr}</li>
              <li>提货电话：${order.taskDetails.picUpManMobile}</li>
            `;
};
/*维修 type:3*/
let ThirdTpl = (order: any) => {
    return `
              <li class="h1">任务号：${order.taskDetails.title}<b>${order.taskDetails.taskStatus}</b></li>
              <li>维修信息说明：<b> ${order.taskDetails.remark}</b></li>
              <li>维修费:<b>¥ ${order.taskDetails.masterFee}</b></li>
              
              <li class="h1">维修信息</li>
              <li>维修地址：${order.taskDetails.consigneeAddr}</li>
              <li>客户姓名：${order.taskDetails.consigneeName}</li>
              <li>联系电话：${order.taskDetails.consigneeMobile}</li>
            `;
};




