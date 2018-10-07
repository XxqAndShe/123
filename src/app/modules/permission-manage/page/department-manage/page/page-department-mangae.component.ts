/**
 * Created by hua on 2017-02-27.
 */
import {Component, OnInit} from "@angular/core";
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';
@Component({
    templateUrl:'./page-department-manage.component.html',
    styleUrls: [
        './page-department-manage.component.css'
    ]
})
export class PageDepartmentManageComponent implements OnInit{
    constructor(public mask:ShowOrHideMaskService){
    }

    // 左侧数据模拟
    managerList=[
        {name:"一智通总部",list:["财务管理中心","人力资源中心","技术中心","销售中心","运营管理中心","订单服务中心","企业发展中心"]},
        {name:"枢纽营业部",list:["东莞营业部","沙集营业部","成都营业部","石井营业部","深惠营业部","中山营业部","顺德营业部"]}
    ]

    titSelectNull=true;//title全不选
    titSelectSome=false;//title半选
    titSelectAll=false;//title全选
    selectNull=[];
    selectNum=0;//已选数
    // 右侧数据模拟
    tableTitle=['部门','隶属部门','部门负责人','负责人电话','地址','备注信息','更新人','更新时间',];
    tableData=[
        {department:'东莞营业部',upperDepartment:'枢纽营业部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'人力资源中心',upperDepartment:'一智通总部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'技术中心',upperDepartment:'一智通总部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'产品中心',upperDepartment:'一智通总部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'品质部门',upperDepartment:'一智通总部---运营管理中心',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'财务管理中心',upperDepartment:'一智通总部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'},
        {department:'企业发展中心',upperDepartment:'一智通总部',leader:'萧萧',leaderPhone:'18825085203',address:'',remarkMsg:'',updater:'李丽',updateTime:'2016-12-12'}
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