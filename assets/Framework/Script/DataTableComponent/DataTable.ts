import DataRowBase from "./DataRowBase";
import { DataTableBase } from "./DataTableBase";

export class DataTable<T extends DataRowBase> extends DataTableBase{
    protected _rows: Array<T> = [];
    public AddRow(row: T) {
        this._rows.push(row);
    }

    public setRow(rows: Array<T>){
        this._rows=rows;
    }

    public getRowCount():number{
        return this._rows.length;
    }
    public getAllRows():T[]{
        return this._rows;
    }

    public getRowByIndex(id:number):T{
        return this._rows[id];
    }

    public getRow(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined{
        return this._rows.find(predicate);
    }

    public getRows(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[]{
        return this._rows.filter(predicate);
    }
}