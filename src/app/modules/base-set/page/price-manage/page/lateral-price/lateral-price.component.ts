import {Component, ViewChild, OnInit} from '@angular/core';
import { AreaService } from '../../../../../../share/app-service/area.service';
import {API} from "../../../../../../share/lib/api/api";
import {VLateralAreaRequestVo} from "./vLateralArea/vLateralAreaRequest.vo";
import {TreeNode} from "primeng/primeng";
import {VLateralPriceResponseVo} from "./vLateralArea/vLateralPriceResponse.vo";
import {ShowOrHideMaskService} from "app/share/app-service/show-or-hide-mask.service";
import {gridData} from 'mock/grid-data';
import {ConfirmationService} from "primeng/components/common/api";


@Component({
    templateUrl: './lateral-price.component.html',
    styleUrls: [
        './lateral-price.component.css'
    ]
})

export class LateralPriceComponent implements OnInit{
    constructor(public areaService:AreaService,public api:API, public confirmationService:ConfirmationService){}
    // nav插件引用设置
    navs = ["安装价格","支线价格"];
    navHrefs = [
        'modules/base-set/price-manage/install-price',
        'modules/base-set/price-manage/lateral-price'
    ];
    curIndex = 1;

    selectedAreas: any;
// 地址组件
//     addrSelectHidden = true;
//     areaText = "";
//     changeAddrText(result: any) {
//         this.areaText = result.areaText;
//         this.addrSelectHidden = result.addrSelectHidden;
//     }

    public popForm: string = 'hide';
    public showFormFlag: boolean = false;
    public isAdd: boolean = false;
    msgs:any;
    //输入框组件
    public temp:string;
    public suggestionResult:string[];//查询建议结果
    area:string;
    town:string;
    lateralIf:boolean= false;
    searchResult(event,type?) {
        if(type='receive'){
            //查询收货人
        }
        if(event.query.startsWith("a")){
            this.suggestionResult = ["aaa","aab","aac"];
        }
        else if(event.query.startsWith("b")){
            this.suggestionResult = ["bbb","bba","bbc"];
        }
    }
    // 初始化列
    columns: any[] = [];
    data:any;
    selections:any;
    selectedRows:any[]=[];


    vLateralAreaRequestVo:VLateralAreaRequestVo;

    vLateralPriceResponseVo:VLateralPriceResponseVo;

    ngOnInit(){

        this.vLateralAreaRequestVo = new VLateralAreaRequestVo();
        this.vLateralPriceResponseVo = new VLateralPriceResponseVo();

        this.initColumns();
    }
    initColumns(): void {
        this.columns.push({
            field: "areaName",
            header: "省市区",
            sortable: false,
            filter: true
        });

        this.columns.push({
            field: "branchFee",
            header: "支线费",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "exceedVolume",
            header: "超方定义(立方米)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "exceedVolumeUnitPrice",
            header: "超方单价(元)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "exceedDistance",
            header: "超远定义(公里)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "exceedDistanceUnitPrice",
            header: "超远单价(元)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "dateCreated",
            header: "创建时间",
            sortable: false,
            filter: true
        });
    }
    load(event){
        this.api.call("CommonController.queryAllAreaTree",{
            data:event.data?event.data:"000000000000"
        }).ok(json=>{
            event.children = json.result;
        });
    }

    loadLaterPrice($event):any{
        //$event.first=0;
        //$event.rows=10;
        this.getData($event);
    }
    // search($event):any{
    //
    //     ////console.log(this.vLateralAreaRequestVo);
    //     // this.load($event);
    //     // ////console.log(this.area);
    //     // this.api.call("AreaApiController.findAreasByParent",{
    //     //     "code":this.area
    //     // }).ok(data=>{
    //     //     ////console.log(data);
    //     // }).fail(data=>{
    //     //     console.error(data);
    //     // });
    // }
    clear():any{
        this.town="";
    }

    rowSelect($event){
        this.selectedRows=$event;
    }

    //确认按钮
    confirm() {
        this.confirmationService.confirm({
            message: '请选择一条数据',
            header: '提示',
            accept: () => {
            }
        });
    }

    getData(data:any){
        ////console.log(data);
        this.api.call("GoodsBranchPriceController.findBranchPrice",data,this.vLateralAreaRequestVo).ok(json=>{
            ////console.log(this.vLateralAreaRequestVo);
            this.data = json.result;
            this.selectedRows=[];
            ////console.log(json.result);
        }).fail(err=>{
            //console.log(err);
        });
    }


    /**
     * 节点选择事件
     */
    nodeSelect($event) {
            //取出选中的政区code
            ////console.log($event.node.data);
            //根据政区code查lateral-price.component.询
            this.vLateralAreaRequestVo.code=$event.node.data;
            //console.log(this.vLateralAreaRequestVo.code);
            this.getData({"first":0,"rows":10});
    }

    /**
     * 节点取消选择事件
     */
    nodeUnselect($event) {

    }

    /**
     * 隐藏弹窗
     */
    hidePopForm(option:any) {
        this.isAdd=option.box;
        this.lateralIf = false;
        //保存成功刷新
        if(option.flag==='save'){
            this.selections=[];
            this.getData({"first":0,"rows":10});
        }
    }

    /**
     * 显示弹窗
     */
    showPopForm(type) {
        this.lateralIf = true;
        if(type==='edit'){
            //单选判断
            if(this.selectedRows.length>1){
                this.showSuccess("warn","只能选择一条任务信息");
                return;
            }
            if(this.selectedRows.length===0){
                this.showSuccess("warn","请选择一条数据");
                return;
            }
            this.vLateralPriceResponseVo=this.selectedRows[0];
        }else{
            this.vLateralPriceResponseVo = new VLateralPriceResponseVo();
        }

        this.isAdd=!this.isAdd;
    }

    isDel: boolean = false;

    /**
     * 删除
     */
    delete($event){
        //单选判断
        if(this.selectedRows.length>1){
            this.showSuccess("warn","只能选择一条任务信息");
            return;
        }
        if(this.selectedRows.length===0){
            this.showSuccess("warn","请选择一条数据");
        }else{
            this.isDel = true;
            this.confirmationService.confirm({
                message: '确定要删除吗?',
                header: '提示',
                accept: () => {
                    this.isDel = false;
                    this.vLateralPriceResponseVo=_.clone(this.selectedRows[0]);
                    this.api.call("GoodsBranchPriceController.branchPriceDelete",this.vLateralPriceResponseVo).ok(json=>{
                        ////console.log(this.vLateralPriceResponseVo);
                        this.selectedRows=[];
                        ////console.log(json.result);
                        // this.confirmationService.confirm({
                        //     message: '确认要删除吗？',
                        //     header: '提示',
                        //     accept: () => {
                        //         this.getData({"first":0,"rows":10});
                        //     }
                        // });
                        this.showSuccess("success","操作成功");
                        this.getData({"first":0,"rows":10});

                    }).fail(err=>{

                    });
                }
            });
        }
    }

    /**
     * 导入功能
     */
    exportData(){

    }
    /*公用提示组件*/
    showSuccess(severity:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:"提示", detail:detail});
    }
}
