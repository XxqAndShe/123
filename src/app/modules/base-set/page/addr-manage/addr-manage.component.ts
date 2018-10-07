import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AreaService} from "../../../../share/app-service/area.service";
import {API} from "../../../../share/lib/api/api";
import {VLateralAreaRequestVo} from "../price-manage/page/lateral-price/vLateralArea/vLateralAreaRequest.vo";
import {ShowOrHideMaskService} from "../../../../share/app-service/show-or-hide-mask.service";
import {ConfirmationService} from 'primeng/primeng';
@Component({
    templateUrl: './addr-manage.component.html',
    styleUrls: [
        './addr-manage.component.css'
    ]
})

export class AddrManageComponent implements OnInit {
    isShow: boolean = false;
    provinces: any[];
    cities: any[] = [];
    area: any[];
    wall: any[];
    isShowDialog: string;
    selectedCityId: string;
    hideArea: boolean = false;
    hideWall: boolean = false;
    hideCity: boolean = false;
    msgs: any;
    temData;//临时存放所删除市的下级区县
    temWall;//临时存放所删除区的下级街道
    hl: any[] = [];
    provinceId: string = '115709xxxxxxxxxx';//暂存省id,默认辽宁
    provinceCode: string = '210000000000';//省份code，用于传给添加市弹窗，默认辽宁
    cityId: string = '115710xxxxxxxxxx';//默认沈阳
    cityCode: string = '210100000000';//默认沈阳
    areaId: string;
    areaCode: string;
    constructor(public areaService: AreaService,
                public api: API,
                public mask: ShowOrHideMaskService,
                public confirmationService: ConfirmationService) {
    }

    vLateralAreaRequestVo: VLateralAreaRequestVo;

    ngOnInit(): any {
        this.vLateralAreaRequestVo = new VLateralAreaRequestVo();
        //加载省份
        this.api.call("AreaController.findArea", {
            "level": 0
        }).ok(data => {
            this.provinces = data.result;
        }).fail(data => {

        });
        this.api.call("AreaController.findArea", {
            "level": 1,
            'parentId': '115709xxxxxxxxxx'
        }).ok(data => {
            this.cities = data.result;
        }).fail(data => {
        }).fail(data => {

        });
        this.hl[0] = true;
    }

    showSuccess(severity: string, summary: string, detail: string) {
        this.msgs = [];
        this.msgs.push({severity: severity, summary: summary, detail: detail});
    }

    //根据省份加载市
    loadCity(i, id, code) {
        this.api.call("AreaController.findArea", {
            "level": 1,
            'parentId': id
        }).ok(data => {
            this.cities = data.result;
        }).fail(data => {

        });
        for (let j = 0; j < this.provinces.length; j++) {
            this.hl[j] = false;
            this.hl[i] = true;
        }
        this.provinceId = id;
        this.provinceCode = code;
    }

    loadArea(city, id) {
        city.isShow = !city.isShow;
        this.api.call("AreaController.findArea", {
            "level": 2,
            'parentId': id
        }).ok(data => {
            city.area = data.result;
        }).fail(data => {

        });
    }

    loadWall(area, id, e?) {
        if(e){
            e.stopPropagation();
        }
        if(!area.isShow){
            this.api.call("AreaController.findArea", {
                "level": 3,
                'parentId': id
            }).ok(data => {
                area.wall = data.result;
            }).fail(data => {

            });
        }
        area.isShow = !area.isShow;
    }

    /**
     * 隐藏街道
     * @param area
     */
    hideWl(area,e){
        area.isShow = !area.isShow;
        e.stopPropagation();
    }

    deleteArea(e, area, id) {
        e.stopPropagation();
        this.api.call("AreaController.findArea", {
            "level": 3,
            'parentId': id
        }).ok(data => {
            this.temWall = data.result;
        }).fail(data => {

        });
        setTimeout(() => {
            if (this.temWall.length > 0) {
                this.showSuccess("warn", "提示", "该区已有下级街道，不允许直接删除！");
                return;
            } else {
                this.confirmationService.confirm({
                    message: '是否确认删除？',
                    header: '提示',
                    accept: (e) => {
                        this.api.call("AreaController.deleteArea", {
                            'id': id
                        }).ok(data => {
                            area.hideArea = true;
                            sessionStorage.removeItem('cacheAreaData');
                        }).fail(data => {
                            this.showSuccess("error", "提示", "出错了！");
                        });
                    },
                    reject: (e) => {

                    }
                });
            }
        }, 100);
    }

    deleteWall(e, wall, id) {
        e.stopPropagation();
        this.confirmationService.confirm({
            message: '是否确认删除？',
            header: '提示',
            accept: (e) => {
                this.api.call("AreaController.deleteArea", {
                    'id': id
                }).ok(data => {
                    wall.hideWall = true;
                    sessionStorage.removeItem('cacheAreaData');
                }).fail(data => {
                    this.showSuccess("error", "提示", "出错了！");
                });
            },
            reject: (e) => {

            }
        });
    }

    editArea(event, areaName, id) {
        event.target.setAttribute('contenteditable', false);
        areaName.innerHTML = areaName.innerHTML.replace(/<br>/g, '');
        this.api.call("AreaController.updateArea", {
            'id': id,
            'name': areaName.innerHTML
        }).ok(data => {
            sessionStorage.removeItem('cacheAreaData');
        }).fail(data => {

        });
    }

    editWall(event, wallName, id) {
        event.stopPropagation();
        event.target.setAttribute('contenteditable', false);
        wallName.innerHTML = wallName.innerHTML.replace(/<br>/g, '');
        this.api.call("AreaController.updateArea", {
            'id': id,
            'name': wallName.innerHTML
        }).ok(data => {
            sessionStorage.removeItem('cacheAreaData');
        }).fail(data => {

        });
    }

    deleteCity(e, city, id) {
        e.stopPropagation();
        this.api.call("AreaController.findArea", {
            "level": 2,
            'parentId': id
        }).ok(data => {
            this.temData = data.result;
        }).fail(data => {

        });
        setTimeout(() => {
            if (this.temData.length > 0) {
                this.showSuccess("warn", "提示", "该市已有下级区县，不允许直接删除！");
                return;
            } else {
                this.confirmationService.confirm({
                    message: '是否确认删除？',
                    header: '提示',
                    accept: (e) => {
                        this.api.call("AreaController.deleteArea", {
                            'id': id
                        }).ok(data => {
                            city.hideCity = true;
                            sessionStorage.removeItem('cacheAreaData');
                        }).fail(data => {
                            this.showSuccess("error", "提示", "出错了！");
                        });
                    },
                    reject: (e) => {

                    }
                });
            }
        }, 100);
    }

    makeEditable(event) {
        event.stopPropagation();
        event.target.setAttribute('contenteditable', true);
    }

    showDialog(which) {
        this.isShowDialog = which;
        this.mask.show();
    }

    closeWin(event) {
        this.isShowDialog = '';
        this.mask.hide();
        if (event) {
            this.api.call("AreaController.findArea", {
                "level": 1,
                'parentId': this.provinceId
            }).ok(data => {
                this.cities = data.result;
                sessionStorage.removeItem('cacheAreaData');
            }).fail(data => {

            });
            this.showSuccess("success", "提示", "操作成功！");
        }
    }

    /**
     * 选中市，获取该市id及code，用于传给添加区县弹窗
     * @param e
     * @param id
     * @param code
     */
    selectCity(e, id, code) {
        e.stopPropagation();
        this.cityId = id;
        this.cityCode = code;
        this.selectedCityId = id;
    }
    /**
     * 选中区，获取该区id及code，用于传给添加街道弹窗
     * @param e
     * @param id
     * @param code
     */
    selectArea(e, id, code){
        e.stopPropagation();
        this.areaId = id;
        this.areaCode = code;
    }
    stopPro(e){
        e.stopPropagation();
    }
}
