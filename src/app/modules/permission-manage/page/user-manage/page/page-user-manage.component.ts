/**
 * Created by hua on 2017-02-27.
 */
import { Component, OnInit } from "@angular/core";
import { ShowOrHideMaskService } from '../../../../../share/app-service/show-or-hide-mask.service';

@Component({
    templateUrl: './page-user-manage.component.html',
    styleUrls: [
        './page-user-manage.component.css'
    ]
})

export class PageUserManageComponent implements  OnInit{
    isShowArr = [false, false, false, false, false, false];
    simpleDialogText: string = "";
    complexDialogText = null;
    dialogTitle: string = "";
    isShow = [];

    allSelectStatus: number = 0;
    selectNum: number = 0;
    tdSelectArr: boolean[] = [];


    /**
     * 数据模拟
     */
    menuList= [
        {name:"总部", list:["财务管理中心", "人力资源中心", "技术中心", "销售中心", "运营管理中心", "订单服务中心", "企业发展中心", "众包网络中心", "供应链金融事业部", "平台业务事业部", "价格管理部", "电子商务部"]},
        {name:"枢纽", list:["东莞营业部", "沙集营业部", "成都营业部", "石井营业部", "深惠营业部", "中山营业部", "顺德营业部"]},
    ];
    tableTitle = ["工号", "姓名", "性别", "手机号", "部门", "角色", "在职状态", "更新人", "更新时间", "复制权限"];
    tableData = [
        {id:"00001", name:"李丽丽", sex:"女", phone:"13523369874", department:"财务中心", role:"财务总监", status:"在职", updatePeople:"李丽丽", updateTime:"2016-12-12", copyRight: "复制权限"},
        {id:"00002", name:"李丽丽", sex:"女", phone:"13523369874", department:"财务中心", role:"财务总监", status:"在职", updatePeople:"李丽丽", updateTime:"2016-12-12", copyRight: "复制权限"},
        {id:"00003", name:"李丽丽", sex:"女", phone:"13523369874", department:"财务中心", role:"财务总监", status:"在职", updatePeople:"李丽丽", updateTime:"2016-12-12", copyRight: "复制权限"},
        {id:"00004", name:"李丽丽", sex:"女", phone:"13523369874", department:"财务中心", role:"财务总监", status:"在职", updatePeople:"李丽丽", updateTime:"2016-12-12", copyRight: "复制权限"}
    ];

    ngOnInit() {
        for(let i=0, len=this.menuList.length; i<len; i++){
            this.isShow[i] = false;
        }
        // ////console.log(this.isShow);
        // ////console.log(this.menuList)
        // ////console.log(this.tableData);
        // ////console.log(this.tableTitle)
        //
        for(let i=0, len=this.tableData.length; i<len; i++){
            this.tdSelectArr[i] = false;
        }
        // ////console.log(this.tdSelectArr);
    }

    constructor(public mask:ShowOrHideMaskService){}

    showDialog(index) {
        this.isShowArr[index] = true;
        this.mask.show();
    }

    hideModal(isShow:boolean){
        for(let i=0, len=this.isShowArr.length; i<len; i++) {
            this.isShowArr[i] = isShow;
        }
    }

    setTotalSelect() {
        return {
            null: this.allSelectStatus==0,
            select: this.allSelectStatus==1,
            tick: this.allSelectStatus==2,
        }
    }

    setSelect(index) {
        return {
            null: !this.tdSelectArr[index],
            tick: this.tdSelectArr[index],
        }
    }

    changeTotalSelect() {
        let fillValue = false;
        if(this.allSelectStatus==0 || this.allSelectStatus==1) {
            this.allSelectStatus = 2;
            this.selectNum = this.tableData.length;
            fillValue = true;
        }else {
            this.allSelectStatus = 0;
            this.selectNum = 0;
        }

        for(let i=0, len=this.tableData.length; i<len; i++) {
            this.tdSelectArr[i] = fillValue;
        }
    }

    changeSelect(index){
        if(this.tdSelectArr[index]) {
            this.selectNum--;
        }else{
            this.selectNum++;
        }

        this.tdSelectArr[index] = !this.tdSelectArr[index];

        if(this.selectNum == 0){
            this.allSelectStatus = 0;
        }else if(this.selectNum == this.tableData.length){
            this.allSelectStatus = 2;
        }else {
            this.allSelectStatus = 1;
        }
    }

    showDataAuthority(isDataAuthorityShow: boolean) {
        this.isShowArr[3] = isDataAuthorityShow;
    }

    showSimpleDialog(isDimission) {
        if(isDimission === true) {
            this.simpleDialogText = '设置用户“许燕子”为离职状态';
        }else {
            this.simpleDialogText = '设置用户“许燕子”为启用状态';
        }
        this.isShowArr[5] = true;
        this.mask.show();
    }

    showOperateDialog(isAdd) {
        if(isAdd === true) {
            this.dialogTitle = "添加新员工";
        }else {
            this.dialogTitle = "用户信息修改";
        }
        this.isShowArr[0] = true;
        this.mask.show();
    }

    showComplexDialog(isDelete) {
        if(isDelete === true) {
            this.complexDialogText = {
                "firstLine": '确认删除用户“许燕子”？',
                "secondLine": '提示：一旦删除将无法恢复'
            }
        }else {
            this.complexDialogText = {
                "firstLine": '密码一旦重置，即可变成初始状态，',
                "secondLine": '确认重置密码？'
            }
        }
        this.isShowArr[2] = true;
        this.mask.show();
    }

    /**
     * 左侧ul隐藏显示
     * @param index
     */
    showUl(index:number){
        this.isShow[index] = !this.isShow[index];
    }
}