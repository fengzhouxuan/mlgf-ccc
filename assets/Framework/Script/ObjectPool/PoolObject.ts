import { error } from "cc";
import { PoolObjectBase } from "./PoolObjectBase";
import { IReference } from "../ReferencePool/IReference";
import { ReferencePool } from "../ReferencePool/ReferencePool";

export class PoolObject<T extends PoolObjectBase> implements IReference{
    private _object:T;
    private _spawnCount:number;

    public static CustomeUnitName: string ="PoolObject";
    constructor(){
        this._spawnCount = 0;
        this._object = null;
    }

    public initialize(obj: T, spawn: boolean): PoolObject<T>{
        this._object = obj;
        this._spawnCount = spawn ? 1:0;
        if(spawn){
            obj.OnSpawn(true);
        }
        return this;
    }

    public get customUnitName(): string {
        return PoolObject.CustomeUnitName;
    }

    clear() {

        this._spawnCount = 0;
        this._object = null;
    }
    
    public get name() : string {
        return this._object.name;
    }

    public get lastUseTime() : Date {
        return this._object.lastUseTime;
    }
    
    public get isInUse() : boolean {
        return this._spawnCount>0;
    }
    
    public get spawnCount() : number {
        return this._spawnCount;
    }

    /**
     * 查看对象
     * @returns 
     */
    public peek():T{
        return this._object;
    }
    /**
     * 
     * @returns 获取对象
     */
    public spawn():T{
        this._spawnCount++;
        this._object.lastUseTime =new Date();
        this._object.OnSpawn(false);
        return this._object;
    }
    /**
     * 回收对象
     */
    public unSpawn(){
        this._object.onUnspawn();
        this._object.lastUseTime =new Date();
        this._spawnCount--;
        if(this._spawnCount<0){
            let msg:string = `${this.name}获取计数小于0`;
            console.error(msg);
        }
    }

    public release(){
        this._object.release();
        ReferencePool.getReferencePool(this._object.customUnitName)?.release(this._object);
    }
    
}