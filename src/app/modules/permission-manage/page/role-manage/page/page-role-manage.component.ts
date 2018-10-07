/**
 * Created by hua on 2017-02-27.
 */
import {Component,OnInit} from "@angular/core";
import {  ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';

@Component({
    templateUrl:"./page-role-manage.component.html",
    styleUrls:["./page-role-manage.component.css"]
})
export class PageRoleManageComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService){
    }

    // 左侧数据模拟
    managerList=[{name:"系统管理员",list:["系统检测员","技术员"]},
                  {name:"技术管理员",list:["技术总监","技术员"]},
                  {name:"财务管理员",list:["财务管理员","销售管理员"]},
                  ]

    titSelectNull=true;//title全不选
    titSelectSome=false;//title半选
    titSelectAll=false;//title全选
    selectNull=[];
    selectNum=0;//已选数
    // 右侧数据模拟
    tableTitle=['角色名称','更新对象','更新时间','更改前值','更改后值'];
    tableData=[
        {roleName:'财务管理员',updateObj:'超级管理员',updateTime:'2016-12-12 12:00:00',updateBef:'IPS系统-调度管理-调度任务',updateAft:'IPS系统-调度管理-维修任务'},
        {roleName:'销售管理员',updateObj:'超级管理员',updateTime:'2016-12-12 12:00:00',updateBef:'IPS系统-调度管理-调度任务',updateAft:'IPS系统-调度管理-维修任务'},
        {roleName:'技术管理员',updateObj:'超级管理员',updateTime:'2016-12-12 12:00:00',updateBef:'IPS系统-调度管理-调度任务',updateAft:'IPS系统-调度管理-维修任务'},
        {roleName:'产品管理员',updateObj:'超级管理员',updateTime:'2016-12-12 12:00:00',updateBef:'IPS系统-调度管理-调度任务',updateAft:'IPS系统-调度管理-维修任务'}
    ];
    isshow=[];
    ngOnInit():void{
        this.isshow.length=this.managerList.length;
        for(var i=0;i<this.isshow.length;i++){
            this.isshow[i]=false;
        }

        this.selectNull.length=this.tableData.length;
        for(var i=0;i<this.selectNull.length;i++){
            this.selectNull[i]=true;
        }
    }

    /**
     * 左侧ul隐藏显示
     * @param index
     */
    showUl(index:number){
        this.isshow[index]=!this.isshow[index];
    }

    /**
     * 行选择
     *
     */
    changeMode(i:number){
        this.selectNull[i]=!this.selectNull[i];
        if(this.selectNull[i]==true){
            this.selectNum--;
        }else{
            this.selectNum++;
        }
        if(this.selectNum==this.selectNull.length){
            this.titSelectNull=false;
            this.titSelectSome=false;
            this.titSelectAll=true;
        }else if(this.selectNum==0){
            this.titSelectNull=true;
            this.titSelectSome=false;
            this.titSelectAll=false;
        }else{
            this.titSelectNull=false;
            this.titSelectSome=true;
            this.titSelectAll=false;
        }
    }

    /**
     * 标题选择
     */
    changeTitleMode(){
        this.titSelectNull=!this.titSelectNull;
        this.titSelectAll=!this.titSelectAll;
        if(this.titSelectSome){
            this.titSelectSome=false;
            this.titSelectAll=true;
            this.titSelectNull=false;
        }
        if(this.titSelectNull){
            this.selectNum=0;
            for(var i=0;i<this.selectNull.length;i++){
                this.selectNull[i]=true;
            }
        }else if(this.titSelectAll){
            ////console.log(11)
            this.selectNum=this.selectNull.length;
            for(var i=0;i<this.selectNull.length;i++){
                this.selectNull[i]=false;
            }
        }
    }

    /**
     * 新增弹框添加
     */
    isAddWin=false;
    isModifyWin=false;
    isSearchWin=false;
    isDelWin=false;
    //由子组件传值过来
    isshowWin(show:boolean){
        this.isAddWin=show;
        this.isModifyWin=show;
        this.isSearchWin=show;
        this.isDelWin=show;
    }
    showAdd(){
        this.isAddWin=true;
        this.mask.show();
    }
    showModify(){
        this.isModifyWin=true;
        this.mask.show();
    }
    showSearch(){
        this.isSearchWin=true;
        this.mask.show();
    }
    showDel(){
        this.isDelWin=true;
        this.mask.show();
    }

}