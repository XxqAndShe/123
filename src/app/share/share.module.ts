import {NgModule} from '@angular/core';

//share module
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {
    ConfirmDialogModule,
    ConfirmationService,
    CheckboxModule,
    StepsModule,
    MenuModule, GrowlModule,SelectButtonModule
} from 'primeng/primeng';

//primeng-ext

import {AutoCompleteModule} from './primeng-ext/autocomplete';
import {FileUploadModule} from './primeng-ext/fileupload';
import {MultiSelectModule} from './primeng-ext/multiselect';

//ui
import {UIGrid} from "./ui/grid/grid";
import {UITree} from "./ui/tree/tree";
import {UIUpload} from "./ui/upload/upload";
import {UISelectBox} from "./ui/select-box/select-box";
import {EchartsDirective} from "./ui/echarts/echarts";


import {PanelNavComponent} from "./ui/panel-nav/panel-nav.component";

//primeng
import {TabViewModule} from "primeng/components/tabview/tabview";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel";
import {ButtonModule} from "primeng/components/button/button";
import {SharedModule} from "primeng/components/common/shared";

import {TreeModule} from "primeng/components/tree/tree";
import {DialogModule} from "primeng/components/dialog/dialog";
import {PickListModule} from "primeng/components/picklist/picklist";
import {EditorModule} from 'primeng/primeng';

import {TaskMsgComponent} from "./view/task-detail/task-msg/task-msg.component";
import {TaskPathMsgComponent} from "./view/task-detail/path-msg/path-msg.component";
import {TaskTrackMsgComponent} from "./view/task-detail/track-msg/track-msg.component";
import {HandleWayOtherComponent} from "./view/share-win/exception-handle-way-win/handle-way-other.component";
import {HandleWayRepairComponent} from "./view/share-win/exception-handle-way-win/handle-way-repair.component";
import {HandleWaySupplyComponent} from "./view/share-win/exception-handle-way-win/handle-way-supply.component";
import {WorkersSelectComponent} from "./business/worker-select/workers-select.component";
import {RepairGoodsComponent} from "./business/repairGoods-select/repairGoods-select.component";
import {AbnormalMoverComponent} from "./business/abnormalMover/abnormalMover-select.component";
import {HandleWayReturnComponent} from "./view/share-win/exception-handle-way-win/handle-way-return.component";
import {HandleWayVetoComponent} from "./view/share-win/exception-handle-way-win/handle-way-veto.component";

//service
import {AbnormalTypeService} from "./app-service/abnormal-type.service";
import {ExceptionDataService} from "../modules/base-set/page/basic-manage/service/exception-data.service";
import {AreaService} from "./app-service/area.service";
import {ExceptionDealService} from "../modules/sale-center/page/exception-handle/service/exception-deal.service";
import {DatepickerService} from "./app-service/datepicker.service";
import {AreaTreeService} from "./app-service/area-tree.service";
import {GoodsTreeService} from "./app-service/goods-tree.service";

//业务组件

import {AreaSelectComponent} from "./business/area-select/area-select.component";
import {MetaSelectComponent} from "./business/meta-select/meta-select.component";
import {DepartmentSelectComponent} from './business/department-select/department-select.component';
import {ExceptionSelectComponent} from "./business/exception-select/exception-select.component";
import {ShipperSelectComponent} from "./business/shipper-select/shipper-select.component";
import {CneeSelectComponent} from "./business/cnee-select/cnee-select.component";
import {WorkerSelectComponent} from "./business/user-worker/worker-select.component";
import {MasterSelectComponent} from './business/master-select/master-select.component';
import {AdjustTaskComponent}from'./assign-master/adjust-assignment/adjust-task.component';
import {RepairSchedulingComponent}from'./assign-master/re-assignment/re-assignment';
import {GoodSelectComponent} from './business/good-select/good-select.component';
import {TransportSelectComponent} from "./business/transport-select/transport-select.component";
import {CityDropDownComponent} from "app/share/business/city-dropdown/city-dropdown.component";


//share component
import {SystemBottomComponent} from './view/nav-bottom/system-bottom.component';
import {NavComponent} from './view/nav-bottom/nav.component';
import {TraceWin} from './view/share-win/trace-win.component';
import {AbnormalRecordComponent} from './view/exception-record/abnormal-record.component';
import {PathMsgComponent} from "./view/view-detail/path-msg/path-msg.component";
import {AbnormalMsgComponent} from "./view/view-detail/abnormal-msg/abnormal-msg.component";
import {AftersaleMsgComponent} from "./view/view-detail/aftersale-msg/aftersale-msg.component";
import {DetailMsgComponent} from "./view/view-detail/detail-msg/detail-msg.component";
import {ExceptionInfoDealComponent} from "./view/share-win/exception-info-deal.component";
import {ReadonlyExceptionInfoComponent} from "./view/share-win/readonly-exception-info/view-exception-info.component";
import {RoHandleWayOtherComponent} from "./view/share-win/readonly-exception-small-win/ro-handle-way-other.component";
import {RoHandleWayRepairComponent} from "./view/share-win/readonly-exception-small-win/ro-handle-way-repair.component";
import {RoHandleWaySupplyComponent} from "./view/share-win/readonly-exception-small-win/ro-handle-way-supply.component";
import {RoHandleWayReturnComponent} from "./view/share-win/readonly-exception-small-win/ro-handle-way-return.component";
import {RoHandleWayVetoComponent} from "./view/share-win/readonly-exception-small-win/ro-handle-way-veto.component";
import {ApiService} from "./app-service/api-service";
import {WaybillDetailModalComponent} from "./view/view-detail/detail-modal.component";
import {OtherTaskDetailComponent} from "./view/task-detail/qt-task-detail/other-detail.component";
import {BhDetailComponent} from "./view/task-detail/bh-task-detail/bh-detail.component";
import {SupplierDetailComponent} from "./view/task-detail/fh-task-detail/supplier-detail.component";
import {RepairDetailComponent} from "./view/task-detail/wx-task-detail/repair-detail.component";
import {AmapComponent}from'./assign-master/gaode-map/gaode-map.component';
import {ViewArbitrationResultWinComponent} from "./view/share-win/view-arbitration-result/view-arbitration-result.component";
import {OperationEndModule} from "./view/operation-end/operation-end.component";
import {ArrivalGoodsComponent}from'./view/task-detail/arrival-goods/arrival-goods.component';
import {ReturnCustomerComponent}from"./view/task-detail/return-customer/return-customer.component"
import {CalendarModule} from "app/share/primeng-ext/calendar/calendar";
import { CommonMsgComponent } from "app/share/ui/grid/common-msg/common-msg.component";
import {goodsDetailsComponent} from "./view/goods-details/goods-details.component";
import {ComplaintSelectComponent} from "./business/complaint-select/complaint-select.component";
import {ComplaintTypeService} from "./app-service/complaint-select.service";
import {CarrierFhDetailComponent} from "./view/task-detail/carrier-fh-task-detail/carrier-fh-detail.component";
import {FileUpLoadComponent} from "./file-upload/file-upload";
import { DataTableModule } from "./primeng-ext/datatable/datatable";


@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        FormsModule,
        // primeng组件开始
        SharedModule,
        DataTableModule,
        TreeModule,
        CalendarModule,
        AutoCompleteModule,
        TabViewModule,
        DropdownModule,
        OverlayPanelModule,
        ButtonModule,
        MultiSelectModule,
        DialogModule,
        PickListModule,
        EditorModule,
        FileUploadModule,
        ConfirmDialogModule,
        CheckboxModule,
        StepsModule,
        MenuModule,
        GrowlModule,
        SelectButtonModule,
        OperationEndModule
        // primeng组件结束
    ],
    declarations: [
        NavComponent,
        SystemBottomComponent,
        TraceWin,
        AbnormalRecordComponent,
        // ui组件库开始
        UISelectBox,
        UIGrid,
        UITree,
        UIUpload,
        PanelNavComponent,
        EchartsDirective,
        CommonMsgComponent,
        // ui组件库结束
        // 业务组件库开始
        AreaSelectComponent,
        MetaSelectComponent,
        DepartmentSelectComponent,
        WorkerSelectComponent,
        ExceptionSelectComponent,
        ShipperSelectComponent,
        TransportSelectComponent,
        CneeSelectComponent,
        WorkersSelectComponent,
        RepairGoodsComponent,
        AbnormalMoverComponent,
        MasterSelectComponent,
        AdjustTaskComponent,
        RepairSchedulingComponent,
        AmapComponent,
        GoodSelectComponent,
        CityDropDownComponent,
        goodsDetailsComponent,
        ComplaintSelectComponent,
        FileUpLoadComponent,
        // 业务组件库结束

        //查看详情共用组件开始
        WaybillDetailModalComponent,
        PathMsgComponent,
        AbnormalMsgComponent,
        AftersaleMsgComponent,
        DetailMsgComponent,
        //查看详情共用组件结束

        //点任务单号弹出框的三个子组件开始
        TaskMsgComponent,
        TaskPathMsgComponent,
        TaskTrackMsgComponent,
        RepairDetailComponent,
        SupplierDetailComponent,
        BhDetailComponent,
        OtherTaskDetailComponent,
        ArrivalGoodsComponent,
        ReturnCustomerComponent,
        CarrierFhDetailComponent,
        //点任务单号弹出框的三个子组件结束

        //处理异常信息弹框
        ExceptionInfoDealComponent,
        HandleWayOtherComponent,
        HandleWayRepairComponent,
        HandleWaySupplyComponent,
        HandleWayReturnComponent,
        HandleWayVetoComponent,

        //查看异常信息弹框
        ReadonlyExceptionInfoComponent,
        RoHandleWayOtherComponent,
        RoHandleWayRepairComponent,
        RoHandleWaySupplyComponent,
        RoHandleWayReturnComponent,
        RoHandleWayVetoComponent,
        //查看仲裁结果弹框
        ViewArbitrationResultWinComponent

    ],
    exports: [
        CommonModule,
        FormsModule,
        // primeng组件开始
        SharedModule,
        DataTableModule,
        WorkerSelectComponent,
        TreeModule,
        CalendarModule,
        AutoCompleteModule,
        TabViewModule,
        DropdownModule,
        OverlayPanelModule,
        ButtonModule,
        MultiSelectModule,
        DialogModule,
        PickListModule,
        EditorModule,
        FileUploadModule,
        ConfirmDialogModule,
        CheckboxModule,
        StepsModule,
        MenuModule,
        GrowlModule,
        SelectButtonModule,
        // primeng组件结束
        NavComponent,
        OperationEndModule,
        SystemBottomComponent,
        TraceWin,
        AbnormalRecordComponent,
        // ui组件库开始
        UISelectBox,
        UIGrid,
        UITree,
        UIUpload,
        PanelNavComponent,
        EchartsDirective,
        CommonMsgComponent,
        // ui组件库结束
        //业务组件开始
        AreaSelectComponent,
        MetaSelectComponent,
        DepartmentSelectComponent,
        ExceptionSelectComponent,
        ShipperSelectComponent,
        TransportSelectComponent,
        CneeSelectComponent,
        WorkersSelectComponent,
        RepairGoodsComponent,
        AbnormalMoverComponent,
        MasterSelectComponent,
        AdjustTaskComponent,
        RepairSchedulingComponent,
        AmapComponent,
        GoodSelectComponent,
        CityDropDownComponent,
        goodsDetailsComponent,
        ComplaintSelectComponent,
        FileUpLoadComponent,
        // 业务组件结束

        //查看详情共用组件开始
        WaybillDetailModalComponent,
        PathMsgComponent,
        AbnormalMsgComponent,
        AftersaleMsgComponent,
        DetailMsgComponent,
        //查看详情共用组件结束

        //点任务单号弹出框的三个子组件开始
        TaskMsgComponent,
        TaskPathMsgComponent,
        TaskTrackMsgComponent,
        RepairDetailComponent,
        SupplierDetailComponent,
        BhDetailComponent,
        OtherTaskDetailComponent,
        ArrivalGoodsComponent,
        ReturnCustomerComponent,
        CarrierFhDetailComponent,
        //点任务单号弹出框的三个子组件结束

        //处理异常信息弹框
        ExceptionInfoDealComponent,

        //查看异常信息弹框
        ReadonlyExceptionInfoComponent,
    ],
    providers: [
        ApiService,
        AreaService,
        ExceptionDataService,
        DatepickerService,
        ExceptionDealService,
        ConfirmationService,
        AreaTreeService,
        GoodsTreeService,
        AbnormalTypeService,
        DatePipe,
        ComplaintTypeService
    ],
})
export class ShareModule {
}
