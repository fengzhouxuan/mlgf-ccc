import { _decorator, Component, error, Node, Pool } from 'cc';
import MlComponent from '../Base/MlComponent';
import { ObjectPoolBase } from './ObjectPoolBase';
import { ObjectPool } from './ObjectPool';
import { PoolObjectBase } from './PoolObjectBase';
const { ccclass, property } = _decorator;

@ccclass('ObjectPoolComponent')
export class ObjectPoolComponent extends MlComponent {
    _defaultCapacity :number = Number.MAX_SAFE_INTEGER;
    _defaultExpireTime = 10*60.0;
    _objectPools:Map<string,ObjectPoolBase> = new Map<string,ObjectPoolBase>();

    public get count() : number { 
        return this._objectPools.size;
    }

    onUpdate(dt: number): void {
        this._objectPools.forEach(pool => {
            pool.update(dt);
        });
    }

    public hasObjectPool(name:string){
        return this._objectPools.has(name);
    }

    public getObjectPool(name: string): ObjectPoolBase{
        if(this.hasObjectPool(name)){
            return null;
        }
        return this._objectPools.get(name);
    }

    public createObjectPool<T extends PoolObjectBase>(name:string,autoRelaseInterval:number,expireTime:number,capacity:number):ObjectPool<T>{
        if(!name){
           console.error("创建对象池的名称不能为空");
           return;
        }
        if(this.hasObjectPool(name)){
            console.error(`对象池${name}已存在`);
            return;
        }
        let pool = new ObjectPool<T>(name,autoRelaseInterval,expireTime,capacity);
        this._objectPools.set(name,pool);
        return pool;
    }
    
}

