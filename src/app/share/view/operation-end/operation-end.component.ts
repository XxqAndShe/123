import { Component, EventEmitter, Output, OnInit, Input, NgModule } from '@angular/core';
import { ShowOrHideMaskService } from "../../app-service/show-or-hide-mask.service";
import { DragBoxService } from "../../app-service/drag-box.service";
import { API } from "../../lib/api/api";
import { RequestTokenService } from "../../app-service/request-token.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'operation-end',
    templateUrl: './operation-end.component.html',
    styleUrls: [
        './operation-end.component.css'
    ]
})

export class OperationEndComponent implements OnInit {
    constructor(public mask: ShowOrHideMaskService,
                public drag: DragBoxService,
                public api: API,
                public requestTokenService: RequestTokenService
    ) {
    }

    @Output() hideWin = new EventEmitter();
    @Output() hideSave = new EventEmitter<boolean>();
    hideWindow() {
        this.hideWin.emit(false);
    }

    @Input() content: any;
    reason: string;
    isNewAbornWaybill: boolean;
  ngOnInit() {
    let depositArea = document.getElementById('deposit_apply_title');
    let depositBox = document.getElementById('deposit_apply');
    this.drag.dragEle(depositArea, depositBox);
    this.requestTokenService.createToken();
  }
    save() {
        if(this.reason == undefined || this.reason == ""){
                // this.showSuccess("warn","提示","终止原因不能为空");
          this.hideWin.emit("终止原因不能为空");
                return;
        }
        this.api.call("AftermarketTaskController.cancelWaybill", {
            taskId: this.content.id,
            waybillId: this.content.waybillId,
            reason: this.reason,
            isNewAbornWaybill: this.isNewAbornWaybill ? "1" : "0"
        }).ok(json => {
            this.hideSave.emit();
        }).fail((err) => {
            // this.showSuccess("error","提示",err.error);
          this.hideWin.emit(err.error);
        });
    }

  /**
   * 生成异常
   */
  abnormalChange(){
    //Todo 生成新异常单触发函数
      //console.log(this.isNewAbornWaybill);
  }
}
@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [OperationEndComponent],
    declarations: [OperationEndComponent]
})
export class OperationEndModule {
}
