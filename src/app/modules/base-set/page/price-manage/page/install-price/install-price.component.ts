import {Component, OnInit, ViewChild} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import { VGoodsCatalogRequestVo } from './vGoodsCatalog/vGoodsCatalogRequest.vo';

@Component({
    templateUrl: './install-price.component.html',
    styleUrls: [
        './install-price.component.css'
    ]
})

export class InstallPriceComponent implements OnInit{

    constructor(public api:API){}

    // nav插件引用设置
    navs = ["安装价格","支线采购价","支线标准采购价"];
    navHrefs = [
        'modules/base-set/price-manage/install-price',
        'modules/base-set/price-manage/lateral-buy-price',
        'modules/base-set/price-manage/lateral-standard-price'
    ];
    curIndex = 0;
    selectedCar :any;
    //类别数组
    categories :any[]=[];
    selectedCategories :any;


    //输入框组件
    public temp:string;
    public suggestionResult:string[];//查询建议结果
    area:string;
    data:any;
    public datas=[];
    selections:any;
    dataId:string;

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

    vGoodsCatalogRequestVo : VGoodsCatalogRequestVo;

    ngOnInit(){
        this.vGoodsCatalogRequestVo = new VGoodsCatalogRequestVo();

        this.dataId = "";

       this.initColumns();
       /*this.categories=this.goodsCatalogService.getCatalogs();*/
    }
    initColumns(): void {
        this.columns.push({
            field: "goodsName",
            header: "品名",
            sortable: false,
            filter: true
        });
        // this.columns.push({
        //     field: "catalog.productName",
        //     header: "类别",
        //     sortable: false,
        //     filter: true
        // });
        this.columns.push({
            field: "catalogName",
            header: "类目",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "installFee",
            header: "标准价(元)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "minimumFee",
            header: "最低一票(元)",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "unit",
            header: "单位",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "spec",
            header: "规格",
            sortable: false,
            filter: true
        });
    }
    load(event){
        this.api.call("GoodsCatalogController.queryGoodsCatalogTree",{
            data:event.data?event.data:this.dataId
        }).ok(json=>{
            //console.log(json.result);
            event.children = json.result;
        });
    }

    loadInstallPrice($event):any{
        //$event.first=0;
        //$event.rows=10;
        this.getData($event);
    }

/*    loadforDropdown():any{
        this.api.call("GoodsCatalogController.findCatalogListByParent",{"id":"1"}).ok(json=>{
            ////console.log(json.result);
            this.datas.push({label:"请选择",value:null});
            for(let index of json.result){
                this.datas.push({label:index.name,value:index.id});
            }
        }).fail(data=>////console.log(data))
    }*/
/*    search($event):any{
        $event.first=0;
        $event.rows=10;
        ////console.log(this.vGoodsCatalogRequestVo);
        this.load($event);
        // ////console.log(this.area);
        // this.api.call("AreaApiController.findAreasByParent",{
        //     "code":this.area
        // }).ok(data=>{
        //     ////console.log(data);
        // }).fail(data=>{
        //     console.error(data);
        // });
    }*/

/*    clear($event):any{
        this.area = "";
        this.search($event)
    }*/

    change1($event){
        ////console.log($event);
    }

    getData(data:any){
        ////console.log(data);
        this.api.call("InstallPriceController.findInstallPriceGrid",data,this.vGoodsCatalogRequestVo).ok(json=>{
            ////console.log(this.vGoodsCatalogRequestVo);
            this.data = json.result;
            ////console.log(json.result);
        }).fail(err=>{

        });
    }

    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('InstallPriceController.findInstallPriceGrid', {
            first:0,
            rows:99999999
        }, this.vGoodsCatalogRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    /**
     * 节点选择事件
     */
    nodeSelect($event) {
        //取出选中的商品列表节点code
        /*let nodeArr=_.map(this.selectedCategories,'data');
        ////console.log(nodeArr)
        //根据分类code查询
        this.search(nodeArr)*/
        //取出选中的政区code
        ////console.log($event.node.data);
        //根据政区code查询
        this.vGoodsCatalogRequestVo.id=$event.node.data;
        this.getData({"first":0,"rows":10});
    }

    /**
     * 节点取消选择事件
     */
    nodeUnselect($event) {

    }

}
