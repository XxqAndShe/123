import {Injectable} from "@angular/core";
import {AbnormalDutyVo} from "../vo/basic-setting/abnormal-duty.vo";
import {RepairTypeResponseVo} from "../vo/basic-setting/repair-type-response.vo";
import {PartTypeResponseVo} from "../vo/basic-setting/part-type-response.vo";
import {API} from "../../../../../share/lib/api/api";
import {LogisticsSupplierResponseVo} from "../vo/basic-setting/logistics-supplier-response.vo";
import {DamageReasonResponseVo} from "../vo/basic-setting/damage-reason-response.vo";
import {AbnormalTypeRequestVo} from "../vo/basic-setting/abnormal-type-request.vo";
import {AbnormalDutyAddVo} from "../vo/basic-setting/abnormal-duty-add.vo";
import {RepairTypeAddVo} from "../vo/basic-setting/repair-type-add.vo";
import {RiskReasonAddVo} from "../vo/basic-setting/risk-reason-add.vo";
/**
 * 基础设置service
 * Created by hao on 2017/2/22.
 */

@Injectable()
export class BasicSettingService {

    public damageReasonResponseVo: DamageReasonResponseVo;
    public abnormalDutyVo: AbnormalDutyVo;
    public repairTypeResponseVo: RepairTypeResponseVo;
    public partTypeResponseVo: PartTypeResponseVo;
    public logisticsSupplierResponseVo: LogisticsSupplierResponseVo;

    constructor(public api: API) {
    }

    /**
     * 删除
     *
     * @param id
     *
     * @param path
     *          接口地址
     * @param fn
     *          回调函数
     */
    deleteBasicSetting(id: string, path: string, fn: Function) {
        this.api.call(path, {
            "id": id
        })
            .ok(data => {
                // TODO(待完善!)
                alert("删除成功!");
                fn({'data': data, 'status': 200});
            })
            .fail(data => {
                // TODO(待完善!)
                alert(data.error);
                fn({'data': data, 'status': -1});
            })
    }

    /**
     * 添加
     * @param fn
     *          // 回调函数
     * @param name
     *          // 名称
     * @param path
     *          // controller和方法的地址
     * @param ifArbitrate
     *          // 是否仲裁
     * @param parentId
     *          // 异常类型父id
     */
    addOrUpdateBasicSetting(fn: Function, path: string, name: string, ifArbitrate = '', parentId = '') {
        this.api.call(path, {
            "name": name,
            "ifArbitrate": ifArbitrate,
            'parentId': parentId
        })
            .ok(data => {
                ////console.log('添加或修改成功返回数据: %o', data);
                alert("添加成功!");
                fn(data = {status: 200, id: data.result.id});
            })
            .fail(data => {
                console.error(data);
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("添加失败, 请联系管理员!");
                }
                fn(data = {status: -1});
            })
    }
    
    abnormalDutyAdd(fn: Function, path: string, abnormalDutyAddVo: AbnormalDutyAddVo) {
        this.api.call(path, abnormalDutyAddVo)
            .ok(data => {
                ////console.log('添加或修改成功返回数据: %o', data);
                alert("添加成功!");
                fn(data = {status: 200, id: data.result.id});
            })
            .fail(data => {
                console.error(data);
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("添加失败, 请联系管理员!");
                }
                fn(data = {status: -1});
            })
    }
    
    /**
     * 添加出险原因
     */
     riskReasonAdd(fn: Function, path: string, riskReasonAddVo:RiskReasonAddVo){
     	this.api.call(path, riskReasonAddVo)
     	.ok(data => {
     		////console.log('添加或修改成功返回数据：%o', data);
     		alert("添加成功！");
     		fn(data = {status:200, id: data.result.id})
     	})
     	.fail(data => {
     		console.error(data);
     		if(data.code){
     			alert(data.error);
     		} else {
     			alert("添加失败，请联系管理员！");
     		}
     		fn(data = {status:-1});
     	})
     }
     
     /**
      * 获取出险原因
      */
      riskReasonFind(fn: Function, path: string, riskReasonAddVo:RiskReasonAddVo){
      	this.api.call(path, )
      }

    repairTypeAdd(fn: Function, path: string, repairTypeAddVo: RepairTypeAddVo) {
        this.api.call(path, repairTypeAddVo)
            .ok(data => {
                ////console.log('添加或修改成功返回数据: %o', data);
                alert("添加成功!");
                fn(data = {status: 200, id: data.result.id});
            })
            .fail(data => {
                console.error(data);
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("添加失败, 请联系管理员!");
                }
                fn(data = {status: -1});
            })
    }

    /**
     * 获取
     */
    getBasicSetting(fn: Function, requestVo: any, path: string, type: string) {
        this.api.call(path, requestVo)
            .ok(data => {
                switch (type) {
                    // 出险原因
                    case 'damageReason':
                        this.damageReasonResponseVo = Object.assign(new DamageReasonResponseVo(), data.result);
                        fn(this.damageReasonResponseVo);
                        break;
                    // 责任方
                    case 'abnormalDuty':
                        this.abnormalDutyVo = Object.assign(new AbnormalDutyVo(), data.result);
                        fn(this.abnormalDutyVo);
                        break;
                    // 维修任务类型
                    case 'repair':
                        this.repairTypeResponseVo = Object.assign(new RepairTypeResponseVo(), data.result);
                        fn(this.repairTypeResponseVo);
                        break;
                    // 补件任务类型
                    case 'partType':
                        this.partTypeResponseVo = Object.assign(new PartTypeResponseVo(), data.result);
                        fn(this.partTypeResponseVo);
                        break;
                    // 物流供应商
                    case 'logisticsSupplier':
                        this.logisticsSupplierResponseVo = Object.assign(new LogisticsSupplierResponseVo(), data.result);
                        fn(this.logisticsSupplierResponseVo);
                        break;
                }
            })
            .fail(data => {
                // TODO(待完善)
                ////console.log(data);
            });
    }

    /**
     * 修改异常小类仲裁状态
     * @param requestVo
     *          请求vo
     * @param fn
     *          回调函数
     */
    updateArbitrate(requestVo: AbnormalTypeRequestVo, fn: Function) {
        this.api.call('baseConfigApiController.addOrUpdateAbnormalType', requestVo)
            .ok(data => {
                fn({
                    'status': 200,
                    'data': data
                });
                alert('修改成功!');
            })
            .fail(data => {
                console.error(data);
                if (data.code) {
                    alert(data.error);
                } else {
                    alert("修改失败, 请联系管理员!");
                }
                fn(data = {status: -1})
            })
    }

}
