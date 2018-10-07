import {Component, forwardRef, OnInit, Input, EventEmitter, Output, OnDestroy} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {TreeNode} from "primeng/components/common/api";
import set = Reflect.set;
import Timer = NodeJS.Timer;

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UITree),
    multi: true
};


@Component({
    selector: 'ui-tree',
    templateUrl:"./tree.html",
    styleUrls:["./tree.css"],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class UITree  implements ControlValueAccessor,OnInit,OnDestroy{


    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;

    public loopUpdateTimer:Timer;

    ngOnInit(): void {
        if(this.cache){
            // 如果开启缓存，则优先从缓存中获取
            this.innerRoot = sessionStorage["ui-tree-"+this.cache];
            if(!this.innerRoot){
                this.innerRoot = {
                    children:[]
                };
                this.load.emit(this.innerRoot);
            }
            else {
                this.innerRoot = JSON.parse(this.innerRoot);
            }
        }
        else {
            this.innerRoot = {
                children:[]
            };
            this.load.emit(this.innerRoot);
        }
        this.loopUpdate();
    }

    ngOnDestroy(): void {
        clearInterval(this.loopUpdateTimer);
    }

    /**
     * 循环监控，每100毫秒监控一次
     */
    loopUpdate(){
        this.loopUpdateTimer = setInterval(()=>{
            // 设置缓存
            let key:string = "ui-tree-"+this.cache;
            if(this.cache && !sessionStorage[key] && this.innerRoot && this.innerRoot.children && this.innerRoot.children.length>0){
                sessionStorage[key] = JSON.stringify(this.innerRoot);
            }
            // 重置内部节点Map，使之和根节点一致
            this.updateInnerNodeMap();
            // 更新当外部selections属性发生变化时内部innerSelections一并发生变化
            this.updateInnerSelections();
        },100);
    }

    public _selections;
    /**
     * 根节点
     */
    public innerRoot:any;
    /**
     * 缓存名，如果设置了，则该树会在sessionStorage中存放所有节点数据
     */
    @Input()
    public cache:string;

    @Input()
    public selectionMode:any = "checkbox";

    @Input()
    width:any;//组件宽度

    @Output()
    public load:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public onNodeChange:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public onNodeSelect:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public onNodeUnselect:EventEmitter<any> = new EventEmitter<any>();
    /**
     * 内部节点监控
     */
    public innerSelections:any;
    /**
     * 内部节点Map
     * @type {{}}
     */
    public innerNodeMap:any = {};

    // 获取属性
    get selections(): any {
        return this._selections;
    };

    // 设置属性，并触发监听器
    set selections(value: any) {
        if (value !== this._selections) {
            this._selections = value;
            this.onChangeCallback(value);
        }
    }

    // 写入值
    writeValue(value: any[]) {
        if (value !== this._selections) {
            this._selections = value;
            this.updateInnerSelections();
        }
    }

    // 注册变化处理事件
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // 注册触摸事件
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    /**
     * 更新内部节点Map
     */
    updateInnerNodeMap(){
        this.innerNodeMap = {};
        let selectionMap = {};
        if(this.selections){
            this.selections = this.selections instanceof Array?this.selections:[this.selections];
            this.selections.forEach((selection)=>{
                selectionMap[selection.data]=selection;
            });
        }
        this._updateInnerNodeMap(this.innerRoot,selectionMap);
    }

    /**
     * 更新各个节点
     * @param _node
     * @private
     */
    _updateInnerNodeMap(_node:any,selectionMap:any){
        if(_node){
            this.innerNodeMap[_node.data] = _node;
            if(_node.children){
                let selected:number = 0;
                _node.children.forEach(child=>{
                    child.parent = _node;
                    child.leaf = true;
                    if(selectionMap[child.data]){
                        selected++;
                    }
                    this._updateInnerNodeMap(child,selectionMap);
                });
                if(selected == 0 || selectionMap[_node.data]){
                    _node.partialSelected = false;
                }
            }
        }
    }

    /**
     * 更新内部选中节点
     */
    updateInnerSelections(){
        if(this.selectionMode!="single"){
            if(!this.selections){
                this.selections = [];
            }
            else if(!(this.selections instanceof Array)){
                this.selections = [this.selections];
            }
            this.innerSelections = [];
            this.selections = this.selections instanceof Array?this.selections:[this.selections];
            let selectionMap = {};
            this.selections.forEach((selection)=>{
                selectionMap[selection.data]=selection;
            });
            this.selections.forEach(selection=>{
                let node = this.innerNodeMap[selection.data];
                if(node){
                    let parent = node.parent;
                    while(parent){
                        if(!selectionMap[parent.data]){
                            parent.partialSelected=true;
                        }
                        parent = parent.parent;
                    }
                    this.innerSelections.push(node);
                }
            });
        }
        else {
            if(this.selections){
                if(this.selections instanceof Array){
                    if(this.selections.length>0){
                        this.innerSelections = this.selections[0];
                    }
                }
                else {
                    this.innerSelections = this.selections;
                }
            }
        }
    }

    nodeExpand(event){
        let node = event.node;
        if(node && node.children && !this.cache){
            this.load.emit(event.node);
        }
    }

    onNodeSelectHandler(event){
        this.monitorSelected(event);
        this.onNodeSelect.emit(event);
        this.onNodeChange.emit(event);
    }

    onNodeUnselectHandler(event){
        this.monitorSelected(event);
        this.onNodeUnselect.emit(event);
        this.onNodeChange.emit(event);
    }

    monitorSelected(event){
        this.selections = [];
        if(this.innerSelections){
            if(this.innerSelections instanceof Array){
                this.innerSelections.forEach((innerSelection)=>{
                    if(innerSelection){
                        this.selections.push({
                            data:innerSelection.data,
                            label:innerSelection.label
                        });
                    }
                });
            }
            else if(this.innerSelections){
                this.selections.push({
                    data:this.innerSelections.data,
                    label:this.innerSelections.label
                });
            }
        }
    }
}
