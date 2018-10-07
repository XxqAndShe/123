import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'deposit-oppose-win',
    templateUrl: './deposit-oppose-win.component.html',
    styleUrls: [
        './deposit-oppose-win.component.css'
    ]
})
export class DepositOpposeComponent {
    @Output() closeWin = new EventEmitter();
    @Output() closeModal = new EventEmitter();
    @Output() doAudit = new EventEmitter();

    placeTxt: string = '请输入不通过原因（最多200字）';
    opposeReason: string;

    close() {
        this.closeWin.emit();
    }

    save() {
        if (this.opposeReason === undefined || this.opposeReason === "") {
            this.placeTxt = '必须输入不通过原因';
            return;
        } else {
            //调用审批
            this.doAudit.emit(this.opposeReason);
            this.closeWin.emit(this.opposeReason);
            this.closeModal.emit(this.opposeReason);
        }
    }
}