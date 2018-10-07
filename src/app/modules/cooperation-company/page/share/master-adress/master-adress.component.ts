/**
 * Created by wq on 2017/4/7.
 */
import {Component, EventEmitter, Output, OnInit, Input,} from '@angular/core';
import {API} from "../../../../../share/lib/api/api";
import { RequestTokenService } from "../../../../../share/app-service/request-token.service";

@Component({
    selector: 'master-adress',
    templateUrl: './master-adress.component.html',
    styleUrls: [
        './master-adress.component.css',
        './../../master-manage/master-manage-common.component.css'
    ],
})

export class MasterAdressComponent implements OnInit {
    selectNodes:any[] = [];
    msgs:any;
    constructor(public api:API,
                public RequestTokenService:RequestTokenService){};

    selectedCodes: any[];
    @Input() selectedAreas;//读取选中区域
    @Input() adressStorage;//本地存储名
    @Output() closeAdress = new EventEmitter<boolean>();
    @Input() adressObj;
    width:any = "98%";
    ngOnInit(): void {
        this.RequestTokenService.createToken();
      /*默认显示上一次选中区域*/
        let that = this;
        let adress = this.adressObj;
        if(this.adressObj != undefined){
            for(let i = 0;i<adress.length;i++){
                this.selectNodes.push({
                        data:adress[i].data,
                        label:adress[i].label,
                });

            }
        }


    }
    //关闭弹窗
    close() {
        ////console.log("close");
        this.closeAdress.emit(false);
    }
    add:string;
    NodeSelector($event) {
        ////console.log($event);
        let selection = $event.selectedAreas;
        this.selectedCodes = [];
        for (let i = 0; i < selection.length; i++) {
            this.selectedCodes.push(
                selection[i].data
            )
        }
        ////console.log(selection);
    }
    NodeUnselect($event){
        ////console.log($event);
    }
    load(event){
        this.api.call("CommonController.queryAllAreaTree",{
            data:event.data?event.data:"000000000000"
        }).ok(json=>{
            event.children = json.result;
        });
    }
    /*公用提示组件*/
    showSuccess(severity:string,summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
    }
    /*保存*/
    preservation(){
        if(this.selectNodes.length == 0){
            this.showSuccess("warn","提示","服务区域不能为空");
            return;
        }
        let Nodes = [];
           if(this.selectNodes.length!=0){
               let len = this.selectNodes.length;
                 for(let i = 0;i<len;i++){
                     Nodes.push({
                         data:this.selectNodes[i].data,
                         lable:this.selectNodes[i].label,
                     })
                 }
           }
           /*本地存储选中区域*/
           ////console.log(Nodes);
            let content = JSON.stringify(Nodes);
            sessionStorage .setItem(this.adressStorage,content);
        this.showSuccess("success","提示","保存成功！");
        this.closeAdress.emit(false);
    }
}
