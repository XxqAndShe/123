/**
 * Created by rjr on 2017/4/6.
 */
import {API} from "../lib/api/api";
import {Injectable} from "@angular/core";
@Injectable()
export class GoodsTreeService{

    constructor(public api:API){}

    /**
     * 后端获取类目节点数组接口
     * @returns {void|any|{ok: ((fn:any)=>any), fail: ((fn:any)=>any)}}
     */
    getGoods():any {
        let api = this.api;
        return api.call("GoodsCatalogController.findCatalogListByParent",{
            "id":"000000000000"
        }).ok(json=>{
            ////console.log(json.result);
            return json.result;
        });
    }

    /**
     * 后端获取类目节点数组接口
     * @returns {void|any|{ok: ((fn:any)=>any), fail: ((fn:any)=>any)}}
     */
    getGoods1(node:string,ok:Function){
        let api = this.api;
        return api.call("GoodsCatalogController.findCatalogListByParent",{
            "id":node
        }).ok(json=>{
            ok(json.result);
        });
    }

    /**
     * 异步加载节点
     * @param node
     * @returns {void|any|{ok: ((fn:any)=>any), fail: ((fn:any)=>any)}}
     */
    /*getLazyAreas(node:any):any {
        let code=node.data;//异步加载节点code
        let api = this.api;
        return api.call("CommonController.getLazyAreas",{
            "code":code
        }).ok(json=>{
            return json.result
        });
    }*/
}