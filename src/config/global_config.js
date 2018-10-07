/**
 * 全局配置文件，服务地址配置
 * Created by giscafer on 2017-05-23.
 */

/**
 * 报表服务地址
 * @type {string}
 */
// window.reportUrl = "http://localhost:13000";
// window.reportUrl = "http://192.168.1.10:5004";
window.reportUrl = "http://120.76.247.73:11010"; //生产库
/**
 * 核心服务地址
 * @type {string}
 */
// window.baseUrl = "https://core.1ziton.com/api/core";
//  window.baseUrl = "http://192.168.1.114:12000";
//  window.baseUrl = "http://localhost:12000";
//  window.baseUrl = "http://192.168.1.64:12000";
// window.baseUrl = "http://192.168.1.10:5003";
window.baseUrl = "http://120.76.247.73:11006"; //IPS准生产

/**
 * IM配置
 * IM关闭，true为关闭，false为打开
 * @type {boolean}
 */
window.closeIMInterval = true;

/**
 * 接入列表轮询时间间隔（毫秒）
 * @type {number}
 */
window.imListInterval = 60000;
/**
 *  消息轮询（毫秒）
 * @type {number}
 */
window.msgRequestInterval = 1000;

/**
 * BOSS服务接口地址
 * @type {string}
 */
// window.bossBaseUrl = "http://192.168.1.84:12200";
//  window.bossBaseUrl = "http://localhost:12200";
window.bossBaseUrl = "http://120.76.247.73:11011";// 准生产BOSS后端

