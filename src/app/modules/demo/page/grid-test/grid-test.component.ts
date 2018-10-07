import {Component, OnInit} from "@angular/core";
import {API} from "../../../../share/lib/api/api";
import {ApiService} from "../../../../share/app-service/api-service";
import {overlayPanelShow, overlayPanelHide} from "app/share/utils/gridUtil";
@Component({
    templateUrl: "./grid-test.component.html",
    styleUrls: ["./grid-test.component.css"]
})
export class GridTestComponent implements OnInit {

    constructor(public apiService:ApiService) {

    }



    columns: any[] = [];

    data: any={};
    selectedCars2: any=[];

    selections: any = [];

    vArea: any = {};

    //overflow win
    op2Data: any;
    overTableColumns: any[]=[];
    overTableData: any;
    cellOverEvent: any;
    enableExport: boolean=false;
    showEditColumn: boolean=false;

    ngOnInit(): void {
        this.initColumn();
        this.initOverTableColumns();
    }
    initColumn(){
        this.columns.push({
            field: "lock",
            header: "是否锁定",
            sortable: true,
            filter: true,
            width: '30px', //当列的宽度设置
            textAlign: 'center', //text-align样式 center | left | right
            lock: true //控制显示锁定图标属性
        });

        this.columns.push({
            field: "id",
            header: "ID",
            sortable: true,
            filter: true
        });
        this.columns.push({
            field: "picture",
            header: "缩略图",
            width: '30px',
            sortable: true,
            filter: true,
            thumbnail: true // 控制缩略图字段
        });

        this.columns.push({
            field: "code",
            header: "代号",
            sortable: true,
            filter: true,
            width: "100px",
            textLength: 3, //该字段鼠标移动会有悬浮显示隐藏文字,不写该字段默认20
            defaultTipsHidden: true // 当有自定义表格的时候要手动开启这个属性,如果defaultTipsHidden=true则默认悬浮框则无效
        });
        this.columns.push({
            field: "name",
            header: "名称",
            sortable: true,
            hidden: false,
            filter: true,
            isWarn: true // 判断字段是否为0，一般仅用在金额为0时，变成红色，配合下面rowSelect方法可以使金额为0的行不可选中
        });
        this.columns.push({
            field: "hidden",
            header: "隐藏的列",
            sortable: true,
            hidden: true,
            filter: true
        });
        this.columns.push({
            field: "fullName",
            header: "全称",
            // link:true,//该字段有点击交互
            sortable: true,
            textLength: 11 //该字段鼠标移动会有悬浮显示隐藏文字
        });
        this.columns.push({
            field: "userJzts[0].accountName",
            header: "子VO列",
            sortable: true
        });
    }
    cellLeave(op,op2,op3){

    }
    load(page): any {
        // //console.log("load event is %o", page);
        // this.apiService.core().call("CommonController.findArea", page, this.vArea).ok(json => {
        //     this.data = json.result;
        //     //console.log(this.data, '-----------');
        // }).fail((err)=>{
        //     this.data=this.testData();
        // });

        this.data = this.testData();

    }
    doSearch(): any {
        ////console.log("doSearch");
        this.load({
            first: 0,
            rows: 10
        });
    }

    rowSelect($event): any {
        //console.log($event);
        this.selections = $event;
        for(let i of $event){
            if(i.name == '0'){
                this.selections.pop();
            }
        }
    }
    cancelSelect($event):void{
        this.selections=[];
    }
    /**
     * 表格字段鼠标进入表格cell事件触发回调方法
     * @param $event
     * @param restObj 浮动窗口对象，根据窗口数量传参自己定义，因为此处举例三个弹窗
     */
    cellMouseEnter($event,...restObj:any[]): any {
        this.cellOverEvent = JSON.stringify($event);
        overlayPanelShow($event,restObj,['id',"code","name"]);
       /* let op=restObj[0];
        let op2=restObj[1];
        let op3=restObj[2];
        this.cellOverEvent = JSON.stringify($event);
        ////console.log($event);
        //如果是id字段则显示浮动窗口op
        if ($event.field == "id") {
            op.show($event.originalEvent);
        }
        //如果是code字段则显示浮动窗口op2
        else if ($event.field == "code") {
            op2.show($event.originalEvent);
        }//如果是id字段则显示浮动窗口op3
        else if ($event.field == "name") {
            op3.show($event.originalEvent);
        }*/
    }

    /**
     * 鼠标从自定义悬浮框上移走触发
     * @param restObj
     */
    cellMouseLeave($event,...restObj:any[]){

        overlayPanelHide($event,restObj,['id',"code","name"]);
       /* let op=restObj[0];
        let op2=restObj[1];
        let op3=restObj[2];
        if ($event.field == "id") {
            op.hide();
        }
        //如果是code字段则显示浮动窗口op2
        else if ($event.field == "code") {
            op2.hide();
        }//如果是id字段则显示浮动窗口op3
        else if ($event.field == "name") {
            op3.hide();
        }*/
    }

    /**
     * 锁定按钮点击事件
     */
    cellLockClick(event:any){
        alert('你点击了锁定按钮，请查看chrome输出信息')
        //console.log(event)
    }

    /**
     * 表格字段点击事件
     * 建议在对应的column字段下添加link:true属性，使得字段值加上下划线，明显区别哪些字段可点击
     */
    cellClick($event):void{
        //控制只有fullName字段点击才触发
        if ($event.field == "fullName") {
            alert('你点击了fullName字段')
        }
    }

    testData() {
        return {
            content: [{
                "userJzts": [{
                    "accountName": "accountName"
                }],
                "picture": ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495706432&di=55282e63736e5c564610c2a2799406af&imgtype=jpg&er=1&src=http%3A%2F%2Fimg1.gtimg.com%2Fastro%2Fpics%2Fhv1%2F114%2F65%2F1859%2F120898164.jpg'],
                "fullName": 'fullName46464352123213',
                "name": 'test',
                "id": 12,
                "code": '1346464352123213'

            },{
                "userJzts": [{
                    "accountName": "测试数据"
                }],
                "picture": ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495706432&di=55282e63736e5c564610c2a2799406af&imgtype=jpg&er=1&src=http%3A%2F%2Fimg1.gtimg.com%2Fastro%2Fpics%2Fhv1%2F114%2F65%2F1859%2F120898164.jpg'],
                "fullName": '测试  数据fullName',
                "name": '测试数据',
                "id": 199,
                "code": '1231234'

            },{
                "userJzts": [{
                    "accountName": "测试数据"
                }],
                "picture": ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495111717741&di=8203dba1d997f770b568492bd83b2156&imgtype=0&src=http%3A%2F%2Fwww.wallcoo.com%2Fanimal%2FDogs_Summer_and_Winter%2Fwallpapers%2F1920x1200%2FDogsB10_Lucy.jpg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495111717741&di=8203dba1d997f770b568492bd83b2156&imgtype=0&src=http%3A%2F%2Fwww.wallcoo.com%2Fanimal%2FDogs_Summer_and_Winter%2Fwallpapers%2F1920x1200%2FDogsB10_Lucy.jpg'],
                "fullName": '测试数据fullName',
                "name": '测试数据',
                "id": '11',
                "code": '1231234TDSFFASDTKYUK67'

            },{
                "userJzts": [{
                    "accountName": "测试数据"
                }],
                "fullName": '测试数据fullName法师打发第三方干撒的阿斯顿发送到发送到发顺丰打算防',
                "name": '测试数据',
                "id": '11',
                "code": '他说的'

            },{
                "userJzts": [{
                    "accountName": "测试数据"
                }],
                "picture": ['http://pic2.ooopic.com/11/98/31/31bOOOPIC12_1024.jpg'],
                "fullName": '测试数据fullName',
                "name": 0,
                "id": '11',
                "code": 'zxdgergfui;ojtyrt'

            },{
                "userJzts": [{
                    "accountName": "测试数据"
                }],
                "fullName": '测试数据fullName是大非隔离开关和vdsfvdfsvdfsvsdfvdfs爱的发大水发热管听日呢教育科技大非隔离开关和vdsfvdfsvdfsvsdfvdfs爱的发大水发热管听日呢教育科技大非隔离开关和vdsfvdfsvdfsvsdfvdfs爱的发大水发热管听日呢教育科技',
                "name": '测试数据',
                "id": '11',
                "code": 'dasfv大'

            }],
            first: true,
            last: true,
            number: 0,
            numberOfElements: 4,
            size: 20,
            totalElements: 4,
            totalPages: 1
        }
    }

    /**
     * 浮动弹出表格
     */
    initOverTableColumns(){
        let columns=[
            {
                field: "id",
                header: "ID",
                sortable: true
            },
            {
                field: "product",
                header: "产品",
                sortable: true
            },
            {
                field: "installCount",
                header: "安装数量",
                sortable: true
            },
            {
                field: "packageCount",
                header: "打包数量",
                sortable: true
            },{
                field: "weight",
                header: "总重量",
                sortable: true
            }
        ]
        this.overTableColumns=columns;
    }

    overTableload($event){
        //测试数据
        this.overTableData={
            content: [{
                "id": 1,
                "product": '沙发',
                "installCount": '12',
                "packageCount": '12',
                "weight": '23kg'

            },{
                "id": 2,
                "product": '玻璃门',
                "installCount": '3',
                "packageCount": '3',
                "weight": '50kg'

            }],
            first: true,
            last: true,
            number: 0,
            numberOfElements: 4,
            size: 20,
            totalElements: 4,
            totalPages: 1
        }


        this.op2Data=[
            {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
            {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
            {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
            {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
            {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
            {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
            {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
            {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
            {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
            {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
        ];
    }
    onRowSelectChange($event?:any){
        //console.log($event)
    }
    testSelect(){
        //console.log(this.selectedCars2);
    }
}