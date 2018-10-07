import { Component,EventEmitter,Output} from '@angular/core';

@Component({
    selector:"intime-aside",
    templateUrl: './intime-aside.component.html',
    styleUrls: [
        './intime-aside.component.css'
    ]
})

export class IntimeAsideComponent {
    // 原型修改前添加条件
    // conditionNum = [];
    // num:number=-1;
    // isChoice=[];
    /**
     * 点击添加条件
     */
    // addCondition(){
    //     if(this.conditionNum.length==5){
    //         alert("最多添加五个条件")
    //     }else{
    //         this.conditionNum.push(this.num++);
    //         this.isChoice.push(false);
    //     }
    // }

    // removeCondition(i){
    //     this.conditionNum.splice(i,1);
    //     this.isChoice.splice(i,1);
    // }
    /**
     * 类似checkbox是否选中
     */
    // changeChoice(i){
    //     this.isChoice[i]=!this.isChoice[i];
    // }
    /**
     * 关闭侧边栏
     */

    @Output() closeModal = new EventEmitter<boolean>();
    hideModal(){
        ////console.log(111)
        this.closeModal.emit(false);
    }

}
