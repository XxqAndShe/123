import {Component, OnInit} from "@angular/core";
import {ExceptionDataRequestVo} from "../../vo/exception-data/exception-data-request.vo";
import {ExceptionDataService} from "../../service/exception-data.service";
import {AbnormalTypeRequestVo} from "../../vo/basic-setting/abnormal-type-request.vo";
import {API} from "../../../../../../share/lib/api/api";
 import {DatepickerService} from "../../../../../../share/app-service/datepicker.service";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {ConfirmationService}from "primeng/primeng"

@Component({
    templateUrl: './exception-data.component.html',
    styleUrls: [
        './exception-data.component.css'
    ]
})

export class ExceptionDataComponent implements OnInit {

    select: boolean = false;

    changeTitle() {
        this.selectionRow = [];
    }

    // nav插件引用设置
    navs = ["基础设置表", "异常基础资料", "提醒设置"];
    curIndex = 1;
    navHrefs = [
        'modules/base-set/basic-manage/basic-setting',
        'modules/base-set/basic-manage/exception-data',
        'modules/base-set/basic-manage/remind-setting'
    ];

    public exceptionDataRequestVo: ExceptionDataRequestVo;
    public updExceptionDataReqVo: ExceptionDataRequestVo;
    public abnormalTypeRequestVo: AbnormalTypeRequestVo;

    public vAbnormalGuideDelete: any = {};
    loading:boolean;

    isAbnormalIf:boolean = false;//修改和新增判断
    selectLineInfo:string[]= [];
	//异常类型查询对象
	vAbnormalTypeFind:any = {};
	abnormalTypeLabel:any = [];
    public abnormalBigType = [];
    public abnormalSmallType = [];
    abnormalStatus:string;
    msgs:any;//公共提示框
    // 异常小类
    cabnormalTypeSId:any;
	//页面page
    gridRequest: any = {};
    constructor(public exceptionDataService: ExceptionDataService,
                public api: API,
                public datepickerService: DatepickerService,
                public mask: ShowOrHideMaskService,
                public confirmationService:ConfirmationService) {
    }

    // 日历插件 START
    zh: any = this.datepickerService.locale();
    inputStyle: any = { // 输入框样式
        // 'width': 90+'px',
        'height': 30 + 'px',
        'textAlign': 'left',
        'cursor': 'default'
    };
    yearRange: string = "2000:2020";
    // 日历插件 END

    // 表格插件 START
    columns: any[] = [];
    data: any;
    selectionRow:string[]=[];//ui-grid表格双向数据绑定
    selections: any[] = [];
    // 表格插件 END

    // 初始化列
    initColumns(): void {
        // this.columns.push({
        //     field: "id",
        //     header: "序号",
        //     sortable: false,
        //     filter: true
        // });
        this.columns.push({
            field: "source",
            header: "来源",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalType",
            header: "异常类型",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalTypeSon",
            header: "异常小类",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "abnormalDuty",
            header: "责任方",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "feeStandard",
            header: "费用标准",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "handleWay",
            header: "处理方式",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "operateType",
            header: "操作类型",
            sortable: false,
            filter: true
        });
         this.columns.push({
            field: "description",
            header: "异常描述",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "createMan",
            header: "创建人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "dateCreated",
            header: "创建时间",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "modifyMan",
            header: "修改人",
            sortable: false,
            filter: true
        });
        this.columns.push({
            field: "lastUpdated",
            header: "修改时间",
            sortable: false,
            filter: true
        });
    }

    /**
     * 查询异常基础资料
     */
    doSearch($event){
        this.loading = true;
        this.exceptionDataRequestVo.abnormalTypeSId = this.cabnormalTypeSId;
        this.exceptionDataRequestVo.source = [this.abnormalStatus];
        //console.log(this.abnormalStatus);
        this.load($event);
    }


    load($event) {
        this.api.call('abnormalGuideController.abnormalGuideFind', $event,this.exceptionDataRequestVo)
            .ok(json => {
                this.data = json.result;
                 this.loading = false;
            })
            .fail(json => {
                this.loading = false;
            });
    }
    /**
     * 导出
     * @param $event
     */
    exportCSV($event){
        this.api.call('abnormalGuideController.abnormalGuideFind', {
            first:0,
            rows:99999999
        }, this.exceptionDataRequestVo)
            .ok(data => {
                $event.done($event.grid,data.result.content);
            })
            .fail(err => {
                $event.done(null,null,true);
            });
    }

    /**
     * 获取异常大类
     */
    getAbnormalBigType(): any {

    	this.abnormalBigType = [];		//清空异常类型s
    	this.gridRequest = {"first":0,"rows":1000};		//分页
    	this.api.call('abnormalTypeController.abnormalTypeFind',this.gridRequest,this.vAbnormalTypeFind)
	   	.ok(data => {
		for(let index of data.result.content){
			this.abnormalBigType.push({name:index.name,id:index.id});
    		}
    	})
    }

    /**
     * 获取异常小类
     */
    getAbnormalSmallType(): any {
        //this.exceptionDataRequestVo.abnormalTypeSId = '';
        this.abnormalSmallType = [];
        this.gridRequest = {"first":0,"rows":1000};		//分页
        this.vAbnormalTypeFind.parentId = this.exceptionDataRequestVo.abnormalTypeBId;

        this.api.call('abnormalTypeController.abnormalTypeFind',this.gridRequest,this.vAbnormalTypeFind)
           	.ok(data => {
    		for(let index of data.result.content){
    			this.abnormalSmallType.push({name:index.name,hasDel:true,id:index.id});
    		}
    	})
    }
    /**
     * 登记异常
     */
    saveExceptionData(): void {
      	this.exceptionDataRequestVo = new ExceptionDataRequestVo();
        this.showModal();
        this.isAbnormalIf = true;
    }

    /**
     * 添加异常资料弹框
     */
    isModalshow = false;

    showModal() {
        this.isModalshow = true;
        this.mask.show();
    }

    //由子组件传值过来
    isshow(show: boolean) {
        if(show){
          this.showSuccess("success","提示","操作成功");
          this.refresh();//刷新
          this.selectionRow = [];//取消选中
        }
        this.mask.hide();
        this.isModalshow = false;
    }

    /**
     * 刷新
     */
    refresh(){
        this.exceptionDataRequestVo.abnormalTypeSId = null;
        this.exceptionDataRequestVo.abnormalTypeBId = null;
        this.exceptionDataRequestVo.description = null;
        this.doSearch({first:0,rows:10})
    }
    /**
     * 选择列表
     * @param $event
     *          点击事件
     */
    rowSelect($event): void {
        this.selectLineInfo = $event;
        this.selectionRow.length = this.selectLineInfo.length;
        this.updExceptionDataReqVo = $event[0];
        //console.log($event);
        if($event[0]){
            this.updExceptionDataReqVo.id = $event[0].id;
        }
    }

    /**
     * 删除异常基础资料
     */
    deleteExceptionData(): void {
        this.vAbnormalGuideDelete.sourceIds = [];
        this.vAbnormalGuideDelete.abnormalGuideIds = [];
	    for (let index of this.selectLineInfo){
            // this.vAbnormalGuideDelete.sourceIds.push(index["sourceId"]);
            this.vAbnormalGuideDelete.abnormalGuideIds.push(index["id"]);
        }
        this.vAbnormalGuideDelete.sourceIds = this.updExceptionDataReqVo.sourceIds;
        this.alert("是否确认删除","提示",()=>{
            //this.api.call('abnormalGuideController.abnormalGuideDelete', this.updExceptionDataReqVo)
            this.api.call('abnormalGuideController.abnormalGuideDelete', this.vAbnormalGuideDelete)
                .ok(json => {
                    let content = this.data.content;
                    let content2: any[] = [];
                    for (let index of content){
                        if (index.id != this.updExceptionDataReqVo.id) {
                            content2.push(index);
                        }
                    }
                    this.data.content = content2;
                    this.showSuccess("success","提示","删除成功!");
                    this.refresh();//刷新
                    this.selectionRow = [];
                    //console.log(this.selectLineInfo);
                })
                .fail(json => {
                    console.error(json);
                    if (json.code) {
                        alert(json.error);
                    } else {
                        this.showSuccess("error","提示","删除失败, 请联系管理员!");
                    }
                })
        })

    }

    /**
     * 修改异常资料
     */
    updateExceptionData(): void {
        //判断单多选
        if(this.selectionRow.length>1){
            this.showSuccess("warn","提示","只能选择一条任务信息");
            return;
        }
        if (this.isEmptyObject(this.updExceptionDataReqVo)) {
            this.showSuccess("warn","提示","请选择要修改的异常资料/指引!");
            return;
        }
        this.isAbnormalIf = false;
        this.exceptionDataRequestVo = this.updExceptionDataReqVo;
        this.showModal();
    }

    /**
     * 判断对象是否为空
     * @param e
     *          被判断的对象
     * @returns {boolean}
     */
    isEmptyObject(e: Object) {
        let t;
        for (t in e)
            return !1;
        return !0;
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    /**
     * 清空
     */
    clearSearch() {
    	//点击清空时，新new 一个异常请求对象
        this.exceptionDataRequestVo = new ExceptionDataRequestVo();
        this.abnormalTypeLabel="";
         this.abnormalStatus = "All";
    }
    /*公用弹框*/
    alert(msg:string,title?:string,cb?:any,cd?:any){
        this.confirmationService.confirm({
            message: msg,
            header: title||'提示',
            accept: (e) => {
                if(cb){
                    cb(e);
                }
            },
            reject:(e)=>{
                if(cd){
                    cd(e);
                }
            }
        });
    }
    ngOnInit(): void {
        this.exceptionDataRequestVo = new ExceptionDataRequestVo();
        this.updExceptionDataReqVo = new ExceptionDataRequestVo();
        this.abnormalTypeRequestVo = new AbnormalTypeRequestVo();

        this.exceptionDataRequestVo.abnormalTypeBId = "";
        this.exceptionDataRequestVo.abnormalTypeSId = "";
        this.abnormalStatus = "All";
        this.exceptionDataRequestVo.source = [this.abnormalStatus];//表格初次刷新默认全部

        this.getAbnormalBigType();
        this.initColumns();

    }
}
