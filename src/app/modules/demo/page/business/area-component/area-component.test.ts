import {Component} from "@angular/core";
@Component({
    templateUrl:"./area-component.test.html",
    styleUrls:["./area-component.test.css"]
})
export class AreaComponentTest{
    msgs:any[]=[];
    areaCode:String = "110106000000";
    districtCode:String = "";
    cityCode:String = "";
    provinceCode:String = "";
    valueCode:String = "";
    metaCode1:String;
    metaCode2:String="serviceProvider";
    //过滤字典
    filterOptions:any[]=['逗比'];
    /**
     * 测试label赋值
     * @type {string}
     */
    defaultLabel:string='请选择区域…';
    doTest():any{
        alert(this.areaCode);
    }
    doTest2():any{
        alert(this.metaCode1);
    }
    doTest22():any{
        alert(this.metaCode2);
    }

    showMsg(msg) {
        this.msgs.push({severity:'success', summary:'提示', detail:(msg?msg:'测试！')});
    }

    /**
     * 字典选中change事件
     * @param event
     */
    onChangeHandler(event){
       //console.info('onChangeHandler',event)
        this.showMsg('你选中了：'+event.value);
       setTimeout(()=>{
           this.msgs=[];
       },3000)
    }

    onFocusHandler(event){
        //console.info('onFocusHandler')
    }

    onBlurHandler(event){
        //console.info('onBlurHandler')
    }
    doCityCode(){
        alert(this.cityCode)
    }
}
