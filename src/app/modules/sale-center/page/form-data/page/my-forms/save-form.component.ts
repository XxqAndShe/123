import {Component, Output, Input, EventEmitter} from '@angular/core';

@Component({
    selector: 'save-form-win',
    templateUrl: './save-form.component.html',
    styleUrls: [
        'save-form.component.css'
    ]
})
export class SaveFormComponent{
    @Output() closeWin2 = new EventEmitter();
    @Output() saveEdit = new EventEmitter();
    @Input() formName;
    close(){
        this.closeWin2.emit();
    }
    save(){
        this.closeWin2.emit();
        this.saveEdit.emit();
    }
}