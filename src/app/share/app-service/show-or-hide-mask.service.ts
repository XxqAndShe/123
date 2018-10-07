/**
 * Created by hua on 2017-02-10.
 */
import {Injectable} from '@angular/core';
@Injectable()
export class ShowOrHideMaskService {
    show() {
        let mask = document.getElementById('mask');
        mask.style.display = 'block';
    }

    hide() {
        let mask = document.getElementById('mask');
        mask.style.display = 'none';
    }

}
