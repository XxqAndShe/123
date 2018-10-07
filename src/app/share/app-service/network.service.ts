import {API} from "../lib/api/api";
import {Injectable} from "@angular/core";
@Injectable()
export class AreaService{

    constructor(public api:API){}

    selectBoxHandler():any {
        let api = this.api;
        return (boxs,select)=>{
            // 设置Tab页标题，根据深度来设置不同的标题
            let title:string;
            switch (boxs.length){
                case 0:title="公司";break;
                case 1:title="部门";break;
                default:title="下级部门";
            }
            // 判断当前是否已选择了一个父项，如果选择了，则根据父乡去取子项信息，否则取根项信息
            if(select){
                api.call("CommonController.findAreasByParent",{
                    "code":select.value
                }).ok(json=>{
                    let data = [];
                    boxs.push({
                        title:title,
                        data:data
                    });
                    let result:any[] = json.result;
                    for(let area of result){
                        if(area.code==="000000000000"){
                            continue;
                        }
                        data.push({
                            label:area.name,
                            value:area.code,
                            end:boxs.length==3
                        });
                    }
                });
            }
            else {
                api.call("CommonController.findAreasByParent",{
                    "code":"000000000000"
                }).ok(json=>{
                    let data = [];
                    boxs.push({
                        title:title,
                        data:data
                    });
                    let result:any[] = json.result;
                    for(let area of result){
                        if(area.code==="000000000000"){
                            continue;
                        }
                        data.push({
                            label:area.name,
                            value:area.code
                        });
                    }
                });
            }
        };
    }
}