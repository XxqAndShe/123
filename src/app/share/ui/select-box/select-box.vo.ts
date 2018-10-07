export class SelectBoxVo{
    _data:any[];
    _title:string;
    _select:any;

    set data(data:any){
        this._data = data;
    }

    get data(){
        return this._data;
    }

    set title(title:string){
        this._title = title;
    }

    get title(){
        return this._title;
    }

    set select(select:any){
        this._select = select;
    }

    get select(){
        return this._select;
    }
}