import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cnee-select-test',
  templateUrl: './cnee-select-test.component.html',
  styleUrls: ['./cnee-select-test.component.css']
})
export class CneeSelectTestComponent implements OnInit {

  cneeCode: string;
  cnee: any;

  constructor() { }

  ngOnInit() {
  }


  doTest(): any {
    alert(this.cneeCode);
  }
  doTest2(): any {
    alert(JSON.stringify(this.cnee));
  }
}
