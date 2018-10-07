import {Component, EventEmitter, Output, Input} from '@angular/core';
@Component({
    selector: 'credit-manage-modal',
    templateUrl: './credit-manage-modal.component.html',
    styleUrls: [
        './credit-manage-modal.component.css'
    ]
})

export class CreditManageModalComponent {
    @Input() selectionRow;
    //信用详情
    @Input() master;
    @Output() closeModal = new EventEmitter<boolean>();
    showCreditStandard: boolean = false;//是否显示信用标准弹窗
    close() {
        this.closeModal.emit(false);
    }

    /**
     * 信用标准弹窗
     */
    creditStan() {
        this.showCreditStandard = true;
    }

    closePop() {
        this.showCreditStandard = false;
    }
}
