/**
 * Created by hua on 2017-01-11.
 */
import { Component, Input } from '@angular/core';
@Component({
    selector:'system-bottom',
    templateUrl:'./system-bottom.component.html',
    styleUrls:['./system-bottom.component.css'],
})
export class SystemBottomComponent{
	@Input() dataNum: number;
	@Input() curPage: number;
	@Input() pageNum: number;
	@Input() pageDataNum: number;

}
