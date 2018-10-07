import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workers-select-test',
  templateUrl: './workers-select-test.component.html',
  styleUrls: ['./workers-select-test.component.css']
})
export class WorkersSelectTestComponent implements OnInit {

  workerCode: string;
  /**
   * 测试label赋值
   * @type {string}
   */
  constructor() { }

  ngOnInit() {
  }


  doTest(): any {
    alert(this.workerCode);
  }

}
