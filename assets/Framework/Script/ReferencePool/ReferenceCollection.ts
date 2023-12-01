import { IReference } from "./IReference";
import { Constructor } from "../Base/MlEntry";

export class ReferenceCollection{
    private _references: IReference[] = [];
    private _collectionName:string;

    
    public get CollectionName() : string {
        return this._collectionName;
    }
    
    constructor(collectionName: string){
        this._collectionName = collectionName;
        this._references =[];
    }

    public acquire<T extends IReference>(ctor: Constructor<T>): T {
        if (this._references.length > 0) {
            return this._references.shift() as T;
        }
        return new ctor();
    }

    public release(reference: IReference){
        reference.clear();
        if (this._references.indexOf(reference)>=0){
            console.error("引用重复回收");
            return;
        }
        this._references.push(reference);
    }

    public removeAll(){
        this._references.length=0;
    }

}