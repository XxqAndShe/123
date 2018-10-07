/**
 * Created by 1 on 2017/8/21.
 */
/**
 * 投诉类型组件服务
 */
import { API } from "../lib/api/api";
import { Injectable } from "@angular/core";
@Injectable()
export class ComplaintTypeService {

    complaintDuty: string; // 责任方
    constructor(public api: API) {
    }

    selectBoxHandler(): any {
        let api = this.api;
        return (boxs, select) => {
            // 设置Tab页标题，根据深度来设置不同的标题
            let title: string;
            switch (boxs.length) {
                case 0:
                    title = "责任方";
                    break;
                case 1:
                    title = "投诉大类";
                    break;
                case 2:
                    title = "投诉小类";
                    break;
            }

            // 判断当前是否已选择了一个父项，如果选择了，则根据父乡去取子项信息，否则取根项信息
            if (select) {
                if (boxs.length == 1) {
                    this.complaintDuty = select.value;
                    api.call("ComplaintController.listCatalog", {
                        "complaintDuty": select.value
                    }).ok(json => {
                        let data = [];
                        boxs.push({
                            title: title,
                            data: data
                        });
                        let result: any[] = json.result;
                        for (let type of result) {
                            data.push({
                                label: type.catalogName,
                                value: type.catalogId,
                                level: 1,
                                end: boxs.length == 3
                            });
                        }
                    });
                } else {
                    api.call("ComplaintController.listMaterial", { first: 0, rows: 99999 }, {
                        "bigCatalogId": select.value,
                    }).ok(json => {
                        let data = [];
                        boxs.push({
                            title: title,
                            data: data
                        });
                        let result: any[] = json.result.content;
                        for (let type of result) {
                            data.push({
                                id: type.id,
                                label: type.penaltySmallCatelogName,
                                value: type.penaltySmallCatelogId,
                                desc: type.penaltyDesc,
                                fee: type.penaltyFee,
                                level: 2,
                                end: boxs.length === 3
                            });
                        }
                    });
                }
            } else {
                let data = [{ label: "一智通", level: 0, value: "yiziton" }, { label: "服务商", level: 0, value: "serviceProvider" }, {
                    label: "承运商",
                    level: 0,
                    value: "carrier"
                }];
                boxs.push({
                    title: title,
                    data: data
                });
            }
        };
    }
    // 回显数据
    selectBoxLabelHandler(): any {
        return (selectBox, code) => {
            this.api.call("ComplaintController.getMaterial", {id: code}).ok(json => {
                selectBox.label = json.result.materialValue;
            });
        };
    }
}
