import { IReference } from "../ReferencePool/IReference";

export abstract class PoolObjectBase implements IReference{
    
    private _name:string;
    private _target:object=null;
    private _lastUseTime:Date=null;

    constructor(){
        this._name=null;
        this._target=null;
        this._lastUseTime = null;
    }

    clear() {
        this._name = null;
        this._target = null;
        this._lastUseTime = null;
    }

    public abstract get customUnitName(): string;

    public get name() : string {
        return this._name;
    }

    public get target() : object {
        return this._target;
    }
    
    public get lastUseTime() : Date {
        return this._lastUseTime;
    }

    public set lastUseTime(v : Date) {
        this._lastUseTime = v;
    }
    
    public init(name:string,target:object){
        this._name = name;
        this._target = target;
    }

    public abstract release();    
    public OnSpawn(isNewInstance:boolean){}
    public onUnspawn(){}
}

