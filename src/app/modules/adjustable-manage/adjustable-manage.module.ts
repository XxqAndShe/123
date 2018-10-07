/**
 * Created by hua on 2017-01-23.
 */
//module
import {NgModule} from '@angular/core';
import {AdjustableManageRoutingModule} from './adjustable-manage-routing.module';
//模块主要组件
import {AdjustableManageComponent} from './adjustable-manage.component';
//component adjust task
import {PageAdjustTaskComponent} from './page/adjust-task/page-adjust-task.component'
//component wait tracking
import {PageWaitTrackingComponet} from './page/wait-tracking/page-wait-tracking.component';
import {WaitTrackHeaderComponent} from './page/wait-tracking/watit-track-header.component';
//component timer abnormal
import {PageTimeAbnormalComponent} from './page/time-abnormal/page-time-abnormal.component';
import {TimeAbnormalHeaderComponent} from './page/time-abnormal/time-abnormal-header.component';
/*弹窗组件*/
import {OrderWinComponent} from './share/order-win/order-win.component';
import {signComponent} from './share/sign/sign.component';
import {cancelSignComponent} from'./share/cancel-sign/cancel-sign.component';
import {endOfLineComponent} from'./share/end-of-line/end-of-line.component';
import {changeInformationComponent} from'./share/change-information/change-information.component';
import {cancelAllocationComponent} from'./share/cancel-allocation/cancel-allocation.component';
import {AdjustableManageTerminationOrder} from './share/termination-order/termination-order.component';
import {AbnormalHandleWin} from './share/abnormal-handle/abnormal-handle.component';
import {traceInformationDetailsComponent} from "./share/trace-information-details/trace-information-details.component";
import {appointmentTimeDetailsComponent} from "./share/appointment-time-details/appointment-time-details.component";
/*操作成功提示框*/
import {MaintenanceCompleteComponent} from './share/maintenance-complete/maintenance-complete.component';
import {PickGoodsFinishComponent} from './share/pick-goods-finish/pick-goods-finish.component';

//module share component
import {OrderDetailComponent} from './share/order-detail.component';
//component mix search
import {PageMixSearchComponent} from './page/mix-search/page-mix-search.component';
import {MixSearchHeaderComponent} from './page/mix-search/mix-search-header.component';
import {ShareModule} from '../../share/share.module';
//模块服务
import {SetTableStyleService} from './service/set-table-style.service';
import {AdjustableModuleVoService} from './service/adjustable-module-vo.service';
import {MixSearchHeaderService} from "./service/mix-search-header.service";
import {AdjustTaskService} from "./service/adjust-task.service";
import {WaitTrackHeaderService} from "./service/watit-track-header.service";
import {TaskDetailModalComponent} from "./share/task-detail/task-detail-modal.component";
import {GrowlModule} from "primeng/components/growl/growl";
import {FileUploadModule} from "primeng/components/fileupload/fileupload";


@NgModule({
    imports: [
        AdjustableManageRoutingModule,
        ShareModule,
        GrowlModule,
        FileUploadModule
    ],
    declarations: [
        AdjustableManageComponent,
        PageAdjustTaskComponent,

        PageWaitTrackingComponet,
        WaitTrackHeaderComponent,

        PageTimeAbnormalComponent,
        TimeAbnormalHeaderComponent,

        PageMixSearchComponent,
        MixSearchHeaderComponent,

        OrderDetailComponent,
        OrderWinComponent,

        AdjustableManageTerminationOrder,
        AbnormalHandleWin,

        signComponent,
        cancelSignComponent,
        endOfLineComponent,
        changeInformationComponent,
        cancelAllocationComponent,

        MaintenanceCompleteComponent,
        PickGoodsFinishComponent,
        TaskDetailModalComponent,
        traceInformationDetailsComponent,
        appointmentTimeDetailsComponent
    ],
    providers: [
        SetTableStyleService,
        AdjustableModuleVoService,
        MixSearchHeaderService,//调度任务-综合查询service
        AdjustTaskService,//调度任务
        WaitTrackHeaderService//获取我跟踪的任务列表
    ],
})
export class AdjustableManageModule {
}
