import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'add-table-win',
    templateUrl: './add-table-win.component.html',
    styleUrls: [
        './add-table-win.component.css'
    ]
})
export class AddTableWinComponent{
    @Output() closeWin = new EventEmitter();
    close(){
        this.closeWin.emit();
    }
    save(){
        this.closeWin.emit();
        this.router.navigate([this.navHrefs[1]]);
        ////console.log(this.newForm)
    }
    navHrefs = [
        '/sale-center/form-data/export-data',
        '/sale-center/form-data/my-forms'
    ];
    constructor(public router: Router){}

    newForm: string;
}