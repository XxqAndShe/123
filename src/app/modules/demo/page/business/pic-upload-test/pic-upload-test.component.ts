import { Component, OnInit } from '@angular/core';
import { API } from "../../../../../share/lib/api/api";

@Component({
    selector: 'app-pic-upload-test',
    templateUrl: './pic-upload-test.component.html',
    styleUrls: ['./pic-upload-test.component.css']
})
export class PicUploadTestComponent implements OnInit {

    testData: any[] = [{
        "id": "Vv2SR-HRJyod0OnD",
        "name": "8676711.png",
        "path": "Vv2SR-HRJyod0OnD.png",
        "url": "https://yztfile.gz.bcebos.com/Vv2SR-HRJyod0OnD.png"
    }, {
        "id": "Vv2SS0nRJyod0OnE",
        "name": "lhb10202226.gif",
        "path": "Vv2SS0nRJyod0OnE.gif",
        "url": "https://yztfile.gz.bcebos.com/Vv2SS0nRJyod0OnE.gif"
    }, {
        "id": "Vv2SZYHRJyod0OnF",
        "name": "aot.png",
        "path": "Vv2SZYHRJyod0OnF.png",
        "url": "https://yztfile.gz.bcebos.com/Vv2SZYHRJyod0OnF.png"
    }, {
        "id": "Vv2SgvjRJyod0OnG",
        "name": "aot cover.png",
        "path": "Vv2SgvjRJyod0OnG.png",
        "url": "https://yztfile.gz.bcebos.com/Vv2SgvjRJyod0OnG.png"
    }];

    testfiles: any[] = [];
    test: any[] = [];

    files: any[] = [];
    fileList: any[] = [];
    fileList3: any[] = [];
    fileChangeList: any;
    fileChangeList3: any;
    multiple: boolean = false;
    constructor(public api: API) {
    }

    ngOnInit() {

        //测试图片回显数据
        this.testfiles = this.testData;
        //获取id绑定ngModel（id数组）
        this.files = _.map(this.testData, 'id');
        //console.log(this.files)
    }
    btnClick() {
        alert(JSON.stringify(this.files));
    }
    btnClick2() {
        alert(JSON.stringify(this.fileList));
    }
    btnClick3() {
        alert(JSON.stringify(this.fileList3));
    }
    fileChange($event) {
        this.fileChangeList = JSON.stringify($event);
    }
}
