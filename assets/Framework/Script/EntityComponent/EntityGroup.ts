import MlEntry from "../Base/MlEntry";
import { ObjectPool } from "../ObjectPool/ObjectPool";
import { ObjectPoolComponent } from "../ObjectPool/ObjectPoolComponent";
import { Entity } from "./Entity";
import { EntityGroupHelper } from "./EntityGroupHelper";
import { EntityInstanceObject } from "./EntityInstanceObject";

export class EntityGroup{
    private _name:string;
    private _entityGroupHelper:EntityGroupHelper;
    private _entityInstancePool:ObjectPool<EntityInstanceObject>;
    private _entities:Array<Entity>;
    
    constructor(name: string, instanceAutoReleaseInterval: number, instanceExpireTime: number, instanceCapacity: number, entityGroupHelper: EntityGroupHelper, objectPoolComponent: ObjectPoolComponent){
        this._name = name;
        this._entityGroupHelper = entityGroupHelper;
        this._entityInstancePool = objectPoolComponent.createObjectPool<EntityInstanceObject>(`entityGroupInstancePool-${name}`,instanceAutoReleaseInterval,instanceExpireTime,instanceCapacity);
        this._entities = [];
       }

    public get name() : string {
        return this._name;
    }
    
    public get entityCount() : number {
        return this._entities.length;
    }
    
    public get helper() : EntityGroupHelper {
        return this._entityGroupHelper;
    }
    

    update(dt:number){
        this._entities.forEach(entity => {
            entity.onUpdate(dt);
        });
    }
    
    public hasEntity(entityId:number):boolean{
        for (let index = 0; index < this._entities.length; index++) {
            let entity = this._entities[index];
            if(entity.entityId == entityId){
                return true;
            }
        }
        return false;
    }

    public getEntity(entityId:number):Entity{
        for (let index = 0; index < this._entities.length; index++) {
            let entity = this._entities[index];
            if (entity.entityId == entityId) {
                return entity;
            }
        }
        return null;
    }

    public getAllEntities(): Array<Entity>{
        let result: Array<Entity> =[]; 
        this.getAllEntitiesNoAlloc(result);
        return result;
    }

    public getAllEntitiesNoAlloc(outResult: Array<Entity>){
        outResult.length=0;
        for (let index = 0; index < this._entities.length; index++) {
            let entity = this._entities[index];
            outResult.push(entity);
        }
    }

    public addEntity(entity:Entity){
        this._entities.push(entity);
    }

    public removeEntity(entity:Entity){
        let index = this._entities.indexOf(entity);
        if(index<0){
            console.warn(`实体组 ${this.name} 中不存在实体 [${entity.entityId}] ,资源为${entity.enittyAssetName}`);
            return;
        }
        this._entities.splice(index,1);
    }

    public registerEntityInstanceObject(entityGroupInstance:EntityInstanceObject,spawn:boolean){
        this._entityInstancePool.register(entityGroupInstance,spawn);
    }

    public spawnEntityInstanceObject(name: string): EntityInstanceObject{
        return this._entityInstancePool.spawn(name);
    }

    public unSpawnEntity(entity:Entity){
        this._entityInstancePool.unSpawnWithObject(entity.entityNode);
    }
}