export class DatepickerService{
    public locale():any{
        return {
            firstDayOfWeek: 0,
            dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: [ "一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月" ],
            monthNamesShort: [ "一","二","三","四","五","六","七","八","九","十","十一","十二" ]
        };
    }

    // 默认显示当天日期
    date1:Date=new Date(); //区域KPI
    date2:Date=new Date();
    date3:Date=new Date(); //发货人KPI
    date4:Date=new Date();
    date5:Date=new Date(); //师傅KPI
    date6:Date=new Date();
    date7:Date=new Date(); //
    date8:Date=new Date();

}