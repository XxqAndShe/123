import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-department-select-test',
    templateUrl: './department-select-test.component.html',
    styleUrls: ['./department-select-test.component.css']
})
export class DepartmentSelectTestComponent implements OnInit {

    departmentCode: string = "";

    constructor() {
    }

    ngOnInit() {

    }

    doTest() {
        alert('值为：' + this.departmentCode);
    }

}
