import {Injectable} from "@angular/core";
import {API} from "./share/lib/api/api";
import {environment} from "environments/environment.prod";

/**
 * 主配置类，所有的配置均在此
 * */
@Injectable()
export class AppConfig {
    /**
     * boss 接口服务地址
     * @type {string}
     */
    static  bossBaseUrl: string = "http://120.76.247.73:11011";
    /**
     * 报表服务地址
     * @type {string}
     */
    reportUrl: string = "http://localhost:13000";
    // reportUrl: string = "http://192.168.1.10:5004";
    // reportUrl: string = "http://119.23.150.232:11007";//生产库
    /**
     * 核心服务地址
     * @type {string}
     */
    baseUrl: string = "http://localhost:12000";
    // baseUrl: string = "http://192.168.1.10:5003";
    // baseUrl: string = "http://119.23.150.232:11009"; //生产库


    /**
     * 关闭IM轮询
     * @type {boolean} true关闭
     */
    static closeIMInterval: boolean = false;


    //二级菜单栏内容 键尾数用来指向title的索引,对应的英文为子路由路径
    menuContent = {
        'home-7': [['首页']],
        'adjustable-0': [['调度任务', '待  跟  踪', '时效预警', '综合查询'],
            ['adjustable-task', 'wait-tracking', 'time-abnormal', 'mix-search']],
        'examine-1': [['区域KPI', '发货人KPI', '师傅KPI', '信用管理'],
            ['area-kpi', 'shipper-kpi', 'master-kpi', 'credit-manage']],
        'cooperation-2': [['师傅/网点管理', '师傅认证管理', '资料变更审核'],
            ['master-manage', 'certify-manage', 'data-change']],
        'sale-3': [['异常处理', '仲裁处理', '售后任务', '售后调度', '投诉管理',/*'报表数据',*/],
            ['exception-handle', 'arbitration-handle', 'abnormal-sale', 'scheduling', 'complain-manage', /*'form-data',*/]],
        'financial-4': [['提现管理', '营业流水', '师傅流水'],
            ['deposit-manager', 'sale-running', 'master-running']],
        'data-5': [['订单统计', '商家统计', '师傅统计', '调度统计', '异常统计'/*, '异常报表'*/],
            ['order-statistics', 'bus-statistics', 'master-statistics', 'adjust-statistics', 'abnormal-statistics', 'abnormal-report']],
        'base-6': [['智能分配管理', '价格管理', /*'地址库管理',*/ '及时率规则设置', '信用标准管理', '售后基础资料', '城市经理管辖区域', 'App版本管理','投诉资料设置'],
            ['intel-manage', 'price-manage', /*'addr-manage',*/ 'intime-rule', 'credit-manage', 'basic-manage', 'city-manage', 'app-manage','complaint-manage']],
        'permission-8': [['公司管理', '部门管理', '角色管理', '用户管理', '公司账号管理', 'API管理'],
            ['company-manage', 'department-manage', 'role-manage', 'user-manage', 'account-manage', 'api-manage']],
        'app': [['App版本管理']],
        'title': [['调度管理', '考核管理', '合作商', '售后中心', '财务中心', '数据统计', '基础设置', '首 页', '权限管理','知识库'],
            ['/modules/adjustable-manage', '/modules/examine-manage', '/modules/cooperation-company',
            '/modules/sale-center', '/modules/financial-center', '/modules/data-statistic',
            '/modules/base-set', '/modules/home', '/modules/permission-manage','/modules/service-information']],
        'service-9': [['资料库']]
    };

    constructor(public api: API) {
        //config_global属性控制是否外部可配置
        if (environment.config_global) {
            this.reportUrl = window['reportUrl'];
            this.baseUrl = window['baseUrl'];
            AppConfig.closeIMInterval = window['closeIMInterval'];
        }
        this.api.url = this.baseUrl + "/api.do";
    }
}
