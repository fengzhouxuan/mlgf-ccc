import { IReference } from "./IReference";
import { Constructor } from "../Base/MlEntry";

export class ReferenceCollection{
    private _refrences: IReference[] = [];
    private _collectionName:string;

    
    public get CollectionName() : string {
        return this._collectionName;
    }
    
    constructor(collectionName: string){
        this._collectionName = collectionName;
        this._refrences =[];
    }

    public acquire<T extends IReference>(ctor: Constructor<T>): T {
        if (this._refrences.length > 0) {
            return this._refrences.shift() as T;
        }
        return new ctor();
    }

    public release(reference: IReference){
        reference.clear();
        if (this._refrences.indexOf(reference)>=0){
            console.error("引用重复回收");
            return;
        }
        this._refrences.push(reference);
    }

    public removeAll(){
        this._refrences.length=0;
    }

}