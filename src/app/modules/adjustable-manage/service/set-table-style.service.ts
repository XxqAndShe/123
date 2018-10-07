/**
 * Created by hua on 2017-02-16.
 */
import {Injectable} from "@angular/core";
@Injectable()
export class SetTableStyleService{
    setTable(minusPixel:string){
        let style={
            height:'calc( 100% - '+minusPixel+' )'
        };
        return style;
    }
}