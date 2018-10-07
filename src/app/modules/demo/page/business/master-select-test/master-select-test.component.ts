import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-select-test',
  templateUrl: './master-select-test.component.html',
  styleUrls: ['./master-select-test.component.css']
})
export class MasterSelectTestComponent implements OnInit {
  masterMobile:string="";
  masterName1:string="";
  masterName:string="";
  master:any;
  constructor() { }

  ngOnInit() {
  }


  doMobileTest(){
    alert(this.masterMobile);
  }

  doTest(){
    alert(this.masterName)
  }
  domasterTest(){
    alert(JSON.stringify(this.master))
  }
  domasterTest1(){
    alert(JSON.stringify(this.masterName1))
  }
}
