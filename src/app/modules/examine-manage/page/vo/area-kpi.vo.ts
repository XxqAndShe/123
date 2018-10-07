/*
 *created by 梁宗凯 on 2017-04-11
*/
export class AreaKpiVo{
    public orderPromptness: string = '0%';//预约及时率
    public orderIntime: string = '0';//预约及时数
    public orderTotal: string = '0';//预约总数
    public orderPromptnessQuota: string = '0%';//预约及时率指标

    public installPromptness: string = '0%';//安装及时率
    public installIntime: string = '0';//安装及时数
    public installTotal: string = '0';//安装总数
    public installPromptnessQuota: string = '0%';//安装及时率指标

    public hourPromptness: string = '0%';//48小时安装及时率
    public hourInstallIntime: string = '0';//及时数
    public hourInstallTotal: string = '0';//总数
    public hourPromptnessQuota: string = '0%';//指标

    public damageRate: string = '0%';//破损率
    public damageNum: string = '0';//破损数
    public damageTotal: string = '0';//总数
    public damageRateQuota: string = '0%';//指标

    public complainRate: string = '0%';//投诉率
    public complainNum: string = '0';//投诉数
    public complainTotal: string = '0';//总数
    public complainRateQuota: string = '0%';//指标

    public saleTime: string = '5';//售后时效
    public saleTimeQuota: string = '0%';//指标
}
