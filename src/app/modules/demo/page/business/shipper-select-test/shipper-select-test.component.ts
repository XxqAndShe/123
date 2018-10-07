import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipper-select-test',
  templateUrl: './shipper-select-test.component.html',
  styleUrls: ['./shipper-select-test.component.css']
})
export class ShipperSelectTestComponent implements OnInit {
  shipperCode: string;
  shipper: any;
  /**
   * 测试label赋值
   * @type {string}
   */
  constructor() { }

  ngOnInit() {
  }


  doTest(): any {
    alert(this.shipperCode);
  }
  doTest2(): any {
    alert(JSON.stringify(this.shipper));
  }
}
