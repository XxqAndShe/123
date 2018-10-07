import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-good-select-test',
  templateUrl: './good-select-test.component.html',
  styleUrls: ['./good-select-test.component.css']
})
export class GoodSelectTestComponent implements OnInit {

  goodValueId: string;
  goodValue: string;
  /**
   * 测试label赋值
   * @type {string}
   */
  constructor() { }

  ngOnInit() {
  }


  doTest(): any {
    alert(this.goodValue);
  }
  doTest1(): any {
    alert(this.goodValueId);
  }

}
