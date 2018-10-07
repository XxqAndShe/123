/**
 * Created by hua on 2017-02-27.
 */
import { Component } from "@angular/core";
import {ShowOrHideMaskService} from "../../../../../share/app-service/show-or-hide-mask.service";
@Component({
    templateUrl:'./page-company-manage.component.html',
    styleUrls:['./page-company-manage.component.css']
 })
export class PageComponentAccountComponent{
    constructor(public mask:ShowOrHideMaskService){}
    public restartBoxState:string='hide';
    public addBoxState:string='hide';
    public stopBoxState:string='hide';
    public modifyBoxState:string='hide';
    public searchBoxState:string='hide';
    public historyBoxState:string='hide';
    //显示对话框
    showDialog(who){
        switch (who){
            case 'restart':
                this.restartBoxState='show';
                break;
            case 'add':
                this.addBoxState='show';
                break;
            case 'stop':
                this.stopBoxState='show';
                break;
            case 'modify':
                this.modifyBoxState='show';
                break;
            case 'search':
                this.searchBoxState='show';
                break;
            case 'history':
                this.historyBoxState='show';
                break;
        }
        this.mask.show();
    }
    hideDialog(who){
        switch (who){
            case 'restart':
                this.restartBoxState='hide';
                break;
            case 'add':
                this.addBoxState='hide';
                break;
            case 'stop':
                this.stopBoxState='hide';
                break;
            case 'modify':
                this.modifyBoxState='hide';
                break;
            case 'search':
                this.searchBoxState='hide';
                break;
            case 'history':
                this.historyBoxState='hide';
                break;
        }
        this.mask.hide();
    }
}
