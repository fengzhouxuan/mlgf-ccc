import { PoolObject } from "./PoolObject";
import { PoolObjectBase } from "./PoolObjectBase";
import { ObjectPoolBase } from "./ObjectPoolBase";
import { ReferenceCollection } from "../ReferencePool/ReferenceCollection";
import { ReferencePool } from "../ReferencePool/ReferencePool";
declare type Constructor<T = unknown> = new (...args: any[]) => T;

export class ObjectPool<T extends PoolObjectBase> extends ObjectPoolBase{
    private _objects:Array<PoolObject<T>>;
    private _autoReleaseInterval:number;
    private _expireTime:number;
    private _capacity:number;

    private _autoReleaseTime: number;
    private _cachedCanReleaseObjects: Array<PoolObject<T>>;
    private _poolObjectReferencePool:ReferenceCollection=null;
    constructor(name:string,autoRelaseInterval:number,expireTime:number,capacity:number){
        super(name);
        this._objects = new Array<PoolObject<T>>();
        this._cachedCanReleaseObjects = new Array<PoolObject<T>>();
        this._poolObjectReferencePool = ReferencePool.create(PoolObject.CustomeUnitName);
        this._autoReleaseInterval = autoRelaseInterval;
        this._expireTime = expireTime;
        this._capacity = capacity;

        this._autoReleaseTime =0;
        this._cachedCanReleaseObjects.length =0;
    }
    
    // public get ObjectType(): string {
    //     return (typeof T).constructor.name;
    // }

    public get count() : number {
        return this._objects.length;
    }
    
    public get autoReleaseInterval() : number {
        return this._autoReleaseInterval;
    }

    public set autoReleaseInterval(v : number) {
        this._autoReleaseInterval = v;
    }
    
    public get capacity() : number {
        return this._capacity;
    }
    
    public set capacity(v : number) {
        if(v<0){
            return;
        }
        if(v==this._capacity){
            return;
        }
        this._capacity = v;
        this.release();
    }

    public register(obj:T,spwan:boolean){
        if(!obj){
            return;
        }
        let poolObject = this._poolObjectReferencePool.acquire(PoolObject<T>).initialize(obj,spwan);
        this._objects.push(poolObject);
        if (this.count>this._capacity){
            this.release();
        }
    }

    public spawn(name:string):T{
        let canSpawn= this.getUseableObject(name);
        if(canSpawn.length>0){
            return canSpawn[0].spawn();
        }
        return null;
    }

    public unSpawnWithObject(obj:object){
        let poolObject= this.getObject(obj);
        if(poolObject==null){
         console.warn(`在对象池${this.name}中找不到 对象${obj.constructor.name}`);
            return;
        }
        poolObject.unSpawn();
    }

    public unSpawn(obj:T){

        this.unSpawnWithObject(obj.target);
    }

    public canSpawn(name:string):boolean{
        return this.getUseableObject(name).length>0;
    } 

    public release(){
        this._cachedCanReleaseObjects.length =0;
        this._cachedCanReleaseObjects = this.getCanReleaseObjects();
        if(this._cachedCanReleaseObjects.length==0){
            return;
        }
        let expireTime = new Date();
        expireTime = new Date(expireTime.getTime()-this._expireTime*1000);

        for (let i = this._cachedCanReleaseObjects.length - 1; i >= 0; i--) {
            let obj = this._cachedCanReleaseObjects[i];
            if (obj.lastUseTime.getTime() < expireTime.getTime()){
                let index = this._objects.indexOf(obj);
                if(index>=0){
                    this._objects.splice(index,1);
                }
                obj.release();
                this._poolObjectReferencePool.release(obj);
            }
        }
    }

    public update(dt:number){
        this._autoReleaseTime+=dt;
        if(this._autoReleaseTime<this._autoReleaseInterval){
            return;
        }
        this._autoReleaseTime =0;
        this.release();
    }
        
    getCanReleaseObjects(): Array<PoolObject<T>>{
        let canRealease = this._objects.filter(e=>{
            return !e.isInUse;
        });
        return canRealease;
    }

    getUseableObject(name: string): Array<PoolObject<T>>{
        if(!name){
            return this.getCanReleaseObjects();
        }
        return this._objects.filter(e => {
            return !e.isInUse && e.name===name;
        });
    }

    getObject(obj:object):PoolObject<T>{
        for (let index = 0; index < this._objects.length; index++) {
            const poolObject = this._objects[index];
            if(poolObject.peek().target == obj){
                return poolObject;
            }
        }
        return null;
    }
}