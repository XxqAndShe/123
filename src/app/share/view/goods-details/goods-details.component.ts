import {Component,Input,OnInit} from '@angular/core';
@Component({
    selector: 'goods-details',
    templateUrl: './goods-details.component.html',
    styleUrls: [
        './goods-details.component.css'
    ]
})
export class goodsDetailsComponent implements OnInit {
    @Input() goodsShow: any;
    @Input() goodsDetailsCount: any;
    constructor(){}
    ngOnInit(){}
}