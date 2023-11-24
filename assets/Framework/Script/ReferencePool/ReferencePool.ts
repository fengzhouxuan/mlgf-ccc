import { Constructor } from "../Base/MlEntry";
import { IReference } from "./IReference";
import { ReferenceCollection } from "./ReferenceCollection";

export class ReferencePool{
    private static _referenceCollections: Map<string, ReferenceCollection> = new Map<string, ReferenceCollection>;
    
    public static create(name:string):ReferenceCollection{
        if (this._referenceCollections.has(name)){
            // console.e(`引用池 ${name} 已存在`);
            return this._referenceCollections.get(name);
        }
        let collection = new ReferenceCollection(name);
        this._referenceCollections.set(name,collection);
        return collection;
    }

    public static getReferencePool(name:string): ReferenceCollection{
        if (this._referenceCollections.has(name)) {
            return this._referenceCollections.get(name);
        }
        return null;
    }

    public static acquire<T extends IReference>(name:string,ctor: Constructor<T>): T {
        let collection = this.create(name);
        return collection.acquire(ctor);
    }

    public static release(reference: IReference){
        let collection = this.create(reference.customUnitName);
        collection.release(reference);
    }

    public static clearAll(){
        for (const [key, value] of this._referenceCollections) {
            value.removeAll();
        }
        this._referenceCollections.clear();
    }
}