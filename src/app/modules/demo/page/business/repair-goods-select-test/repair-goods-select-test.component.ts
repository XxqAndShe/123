import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'repair-goods-select-test',
  templateUrl: './repair-goods-select-test.component.html',
  styleUrls: ['./repair-goods-select-test.component.css']
})
export class RepairGoodsSelectTestComponent implements OnInit {

  goodCode: string="VxCWv0-2jMUZGALo";
  queryId: "1zta07"; //运单号
  goodCode1: string[]=["VxCWv0-2jMUZGALo"];
  /**
   * 测试label赋值
   * @type {string}
   */
  constructor() { }

  ngOnInit() {
  }


  doTest1(): any {
    alert(this.goodCode1);
  }
  doTest(): any {
    alert(this.goodCode);
  }
}
