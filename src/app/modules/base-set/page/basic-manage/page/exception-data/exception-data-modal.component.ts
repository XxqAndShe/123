import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {ShowOrHideMaskService} from "../../../../../../share/app-service/show-or-hide-mask.service";
import {ExceptionDataRequestVo} from "../../vo/exception-data/exception-data-request.vo";
import {ExceptionDataService} from "../../service/exception-data.service";
import {AbnormalTypeRequestVo} from "../../vo/basic-setting/abnormal-type-request.vo";
import {AbnormalDutyRequestVo} from "../../vo/basic-setting/abnormal-duty-request.vo";
import {BasicSettingService} from "../../service/basic-setting.service";
import {API} from "../../../../../../share/lib/api/api";
import {ExceptionDataComponent} from "./exception-data.component";

@Component({
    selector: 'exception-data-modal',
    templateUrl: './exception-data-modal.component.html',
    styleUrls: [
        './exception-data-modal.component.css'
    ]
})

export class ExceptionDataModalComponent implements OnInit {
    @Input() selectInfo:any;
    @Input() isAbnormalIf:boolean;
    @Output() isshow = new EventEmitter();

    modalTitle = '新增异常资料/指引';
    abnormalTypeLabel:string="";
    modal:boolean;
    //异常来源全选
    selectedAll:string[] = [];
    msgs:any;//公共提示；

    // 临时绑定vo
        abNormalId:string;
        abSource:any[]=[];
        abNormalTypeSId:string;
        abNormalDutyId:string;
        abFeeStandard:string;
        dealways:any[]=[];
        dealwaysTrans:string;
        abOperateType:string;
        abDescription:string;
    // 临时绑定vo

    constructor(public mask: ShowOrHideMaskService,
                public api: API,
                public exceptionDataService: ExceptionDataService,
                public basicSettingService: BasicSettingService,
                public exceptionDataComponent: ExceptionDataComponent) {
    }

    ngOnInit(): void {
        if(!this.isAbnormalIf){
            this.modalTitle = '修改异常资料/指引';
            var curRowInfo = this.selectInfo[0];
            this.abNormalId = curRowInfo.id;
            this.abSource = this.initSource(curRowInfo.sources);
            this.dealways = this.initHandleWay(curRowInfo.handleWay);
            this.abNormalTypeSId = curRowInfo.abnormalTypeSId;
            this.abNormalDutyId = curRowInfo.abnormalDutyId;
            this.abFeeStandard = curRowInfo.feeStandard;
            this.abOperateType = curRowInfo.operateType;
            this.abDescription = curRowInfo.description;
        }
    }

    /**
     * 初始化处理方式
     * @param handleWay
     *
     */

    initHandleWay(handleWay: string):string[] {
        var tempArr = [];
        if(handleWay){
            this.dealways = handleWay.split('、');
            if(this.dealways.indexOf('维修')!=-1){
                tempArr.push('repair');
            }
            if(this.dealways.indexOf('补件')!=-1){
                tempArr.push('part');
            }
            if(this.dealways.indexOf('返货')!=-1){
                tempArr.push('return_');
            }
            if(this.dealways.indexOf('其他')!=-1){
                tempArr.push('other');
            }
        }
        return tempArr;
    }


    /* 初始化异常来源 */
    checkAll(){
        if(this.selectedAll[0] == "All"){
            this.abSource = ["tms_dispatch","tms_undertake","tms_service","website","app","cmp","ips","Plat","self"];
        }else {
            this.abSource =[];
        }
    };

    initSource(sourceArr:string[]){
        var tempSource = [];
        if(sourceArr){
            if(sourceArr.indexOf('TMS调度')!=-1){
                tempSource.push('tms_dispatch');
            }
            if(sourceArr.indexOf('TMS承接')!=-1){
                tempSource.push('tms_undertake');
            }
            if(sourceArr.indexOf('TMS客服')!=-1){
                tempSource.push('tms_service');
            }
            if(sourceArr.indexOf('官网')!=-1){
                tempSource.push('website');
            }
            if(sourceArr.indexOf('APP')!=-1){
                tempSource.push('app');
            }
            if(sourceArr.indexOf('CMP')!=-1){
                tempSource.push('cmp');
            }
            if(sourceArr.indexOf('IPS')!=-1){
                tempSource.push('ips');
            }
            if(sourceArr.indexOf('BMS系统')!=-1){
                tempSource.push('Plat');
            }
            if(sourceArr.indexOf('直营系统')!=-1){
                tempSource.push('self');
            }
        }
        return tempSource;
    }

    // 处理方式-数据处理
    abstractHandleway(handleways:string[]){
        var finalStr = '';
        if(handleways.length==1){
            finalStr = handleways[0];
        }else if(handleways.length==2){
                    if(handleways.indexOf('repair')<0){
                        if(handleways.indexOf('part')<0){
                            finalStr = 'return_other';
                        }else if(handleways.indexOf('return_')<0){
                            finalStr = 'part_other';
                        }else if(handleways.indexOf('other')<0){
                            finalStr = 'part_return_';
                        }
                    }else{
                        if(handleways.indexOf('part')<0){
                           if(handleways.indexOf('return_')<0){
                                finalStr = 'repair_other';
                           }else if(handleways.indexOf('other')<0){
                            finalStr = 'repair_return_';
                           }
                        }else {
                            finalStr = 'repair_part';
                        }
                    }
        }else if(handleways.length==3){
            if(handleways.indexOf('repair')<0){finalStr = 'part_return_other';}
            if(handleways.indexOf('part')<0){finalStr = 'repair_return_other';}
            if(handleways.indexOf('return_')<0){finalStr = 'repair_part_other';}
            if(handleways.indexOf('other')<0){finalStr = 'repair_part_return';}
        }else if(handleways.length==4){
            finalStr = 'repair_part_return_other';
        }
        return finalStr;
    }

    // 隐藏弹框
    hideModal(modal) {
        modal.style.display = "none";
        this.mask.hide();
        this.isshow.emit(false);
    }

    /**
     * 添加/修改异常资料、指引
     */
    addAbnormal(){

        if(this.abSource&&this.abSource.length==0){
                this.showSuccess("warn","提示","请选择异常来源");
                return;
        }else if(!this.abNormalTypeSId){
                this.showSuccess("warn","提示","请选择异常类型");
                return;
        }else if(!this.abNormalDutyId){
            this.showSuccess("warn","提示","请选择责任方");
            return;
        }else if(this.dealways&&this.dealways.length==0){
                 this.showSuccess("warn","提示","请选择处理方式");
                 return;
        }else if(!this.abOperateType){
                 this.showSuccess("warn","提示","请输入操作步骤");
                 return;
        }

        var exceptionData:any = {};
        if(!this.isAbnormalIf){
            exceptionData.id = this.abNormalId;
        }
        exceptionData.source = this.abSource;
        exceptionData.abnormalTypeSId = this.abNormalTypeSId;
        exceptionData.abnormalDutyId = this.abNormalDutyId;
        exceptionData.feeStandard = this.abFeeStandard;
        exceptionData.handleWay = this.abstractHandleway(this.dealways);
        exceptionData.operateType = this.abOperateType;
        exceptionData.description = this.abDescription;

        this.api.call('abnormalGuideController.abnormalGuideAddOrUpdate',exceptionData)
            .ok(json => {
                this.isshow.emit(true);//暴露值给父组件
            })
            .fail(json => {
                if (json.code) {
                    this.showSuccess("error","提示",json.error);
                } else {
                    this.showSuccess("error","提示","请联系管理员！");
                }
            })
    }
     /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
}
