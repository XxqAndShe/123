/**
 * Created by hxb on 2017/5/17.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class TransferESCService {
    /*转义字符转换*/
    transferESC (value: string) {
        return value.replace(/&(lt|gt|quot);/g, (s)=>{
            switch(s){
                case '&lt;':
                    return '<';
                case '&gt;':
                    return '>';
                case '&quot;':
                    return '"'
            }
        });
    }
}
