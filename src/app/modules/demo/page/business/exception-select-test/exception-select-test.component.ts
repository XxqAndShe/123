import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-exception-select-test',
    templateUrl: './exception-select-test.component.html',
    styleUrls: ['./exception-select-test.component.css']
})
export class ExceptionSelectTestComponent implements OnInit {
    typeCode: string = "VwQZVrsR0Y2eHAc-";
    /**
     * 测试label赋值
     * @type {string}
     */
    testLabel: string = '请选择……';

    constructor() {
    }

    ngOnInit() {
    }

    doTest(): any {
        alert(this.typeCode);
    }

    onChange($event){
        //console.log($event)
    }
}
