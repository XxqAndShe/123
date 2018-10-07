import {
    Component, animate, trigger, state, transition, style, EventEmitter, OnInit, ViewChild,
    AfterViewChecked
} from '@angular/core';
import {API} from "../../../../../../share/lib/api/api";
import {ConfirmationService} from 'primeng/primeng';
import {IntelMatchAreaComponent}from"./intel-match-area.component"

@Component({
    templateUrl: './intel-addr-manage.component.html',
    styleUrls: [
        './intel-addr-manage.component.css'
    ],
    animations: [
        trigger('modalState', [
            state('out', style({
                opacity: '0'
            })),
            state('in', style({
                opacity: '1'
            })),
            transition('out => in', animate('500ms ease-in')),
            transition('in => out', animate('500ms ease-out'))
        ])
    ]
})

export class IntelAddrManageComponent implements OnInit,AfterViewChecked{
    // @Input() filesTree9
    constructor(public api:API,
                public confirmationService:ConfirmationService){

    }
    // nav插件引用设置
    navs = ["智能匹配区域管理","智能匹配规则配置","发货人指定师傅管理","提货电话指定师傅管理"];
    navHrefs = [
        'modules/base-set/intel-manage/intel-addr-manage',
        'modules/base-set/intel-manage/intel-rule-manage',
        'modules/base-set/intel-manage/peo-point-master',
        'modules/base-set/intel-manage/addr-point-master'
    ];
    curIndex = 0;

    //保存成功提示框
    temp:any;
    showWin=false;
    showWinAni=false;
    //保存当前选中地址
    selectedAreas:any[] = [];
    msgs:any[] = [];
    orderAppointType:any;
    startIf:boolean = true;//默认开启全国
    ngAfterViewChecked(){

    }
    ngOnInit(): void {
    }

    @ViewChild(IntelMatchAreaComponent)
    public startWholeCountry:IntelMatchAreaComponent;
    showSaveTip(){
        var that=this;
        this.showWin=true;
        setTimeout(function(){
            that.showWinAni =true;
        }, 0);
        //定时器控制2s后提示框自动消失
        setTimeout(function(){
            that.showWinAni=false;
            setTimeout(function(){
                that.showWin=false;
            },500)
        },2000)
    }
    querySelectedCodes(orderAppointType){
        this.api.call("IntelAssignAreaController.queryByOrderType",{orderAppointType:orderAppointType}).ok(json=>{
            this.selectedAreas=json.result.selectAreas;
        }).fail(json=>{
            this.showSuccess("error","提示",json.error);
        });
    }
    hideTip(){
        this.showWinAni=false;
        var that=this;
        setTimeout(function(){
            that.showWin=false;
        },500)

    }
    /**
    * 开启全国*/
    openCountry(value){
        this.startIf = !this.startIf;
      if(this.startIf == false){
          this.startWholeCountry.selectWholeCountry()//开启全国
      }else {
          this.startWholeCountry.returnWholeCountry();//退出全国
      }
    }
    //回显已选择地址
    querySelected(){
        this.api.call("IntelAssignAreaController.queryByOrderType").ok(json=>{
            this.selectedAreas = json.result.selectAreas;
            if (json.result.orderAppointType!=null){
                this.orderAppointType=json.result.orderAppointType;
                if("intel"==(json.result.orderAppointType)){
                    this.changeStyle(2);
                }else if("manual"==(json.result.orderAppointType)){
                    this.changeStyle(1);
                }else{
                    this.changeStyle(0);
                }
            }
        }).fail(json=>{
            this.showSuccess("error","提示",json.error);
        })
    }

    //启用分单效果切换
    invocationText=["启用人工分单","启用推荐师傅","启用智能分单"];
    invocationTextValue=["manual","recommend","intel"];
    isChange=[false,false,false];
    //选择分单
    changeStyle(index){
        for(var i=0;i<this.invocationText.length;i++){
            this.isChange[i]=false;
            if(i==index){
                this.isChange[i]=true;
                this.orderAppointType=this.invocationTextValue[i];
                this.querySelectedCodes(this.orderAppointType);
            }
        }
    }

    onNodeSelect(event){
        this.selectedAreas = event.selectedAreas;
    }

    save(){
        if(!this.orderAppointType){
            this.showSuccess("warn","提示","匹配类型不能为空");
            return;
        }
        this.api.call("intelAssignAreaController.addOrUpdate",{
            selectAreas:this.selectedAreas,
            orderAppointType:this.orderAppointType
        }).ok((json)=>{
            this.showSaveTip();
            this.showSuccess("success","提示","操作成功");
        }).fail((json)=>{
            this.showSuccess("error","提示",json.error)
        });
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

    changeNav(e:any){

    }

    /*公用提示组件*/
    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }
}
