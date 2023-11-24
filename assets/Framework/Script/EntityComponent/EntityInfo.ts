import { IReference } from "../ReferencePool/IReference";
import { Entity } from "./Entity";

export enum EntityStatus{
    Unknown,
    WillInit,
    Inited,
    WillShow,
    Showed,
    WillHide,
    Hidden,
    WillRecycle,
    Recycled
}
export class EntityInfo implements IReference{
    private _entity:Entity;
    private _entityStatus:EntityStatus;
    private _parentEntity:Entity;
    private _childEntities:Array<Entity>;
    public static CustomUniName:string = "EntityInfo";
    constructor(){
        this._entity = null;
        this._parentEntity = null;
        this._entityStatus = EntityStatus.Unknown;
        this._childEntities = [];
    }

    public get customUnitName(): string {
        return EntityInfo.CustomUniName;   
    }
    
    public get entity() : Entity {
        return this._entity;
    }
    
    public get entityStatus() : EntityStatus {
        return this._entityStatus;
    }
    
    public set entityStatus(v : EntityStatus) {
        this._entityStatus = v;
    }
    
    public get parentEntity() : Entity {
        return this._parentEntity;
    }
    
    public set parentEntity(v : Entity) {
        this._parentEntity = v;
    }
    
    public get childEntities() : Array<Entity> {
        return this._childEntities;
    }
    
    public get childCount() : number {
        return this._childEntities.length;
    }
    
    public initialize(entity: Entity){
        this._entity = entity;
        this._entityStatus = EntityStatus.WillInit;
    }

    public static create(entity:Entity):EntityInfo{
        let entityInfo =new EntityInfo();
        entityInfo._entity = entity;
        entityInfo._entityStatus = EntityStatus.WillInit;
        return entityInfo;
    }

    public getChildEntity():Entity{
        return this._childEntities.length>0 ? this._childEntities[0]:null;
    }

    public getChildEntities(results:Array<Entity>){
        if(results==null){
            console.error(`接收的对象不能为空`);
            return;
        }
        results.length =0;
        for (let index = 0; index < this._childEntities.length; index++) {
            const child = this._childEntities[index];
            results.push(child);
        }
    }

    public addChildEntity(child:Entity){
        if(this._childEntities.indexOf(child)>=0){
            console.error(`子实体已存在`);
            return;
        }
        this._childEntities.push(child);
    }

    public removeChildEntity(child:Entity){
        let index = this._childEntities.indexOf(child);
        if (index <0) {
            console.error(`子实体不存在`);
            return;
        }
        this._childEntities.splice(index,1);
    }

    public clear() {
        this._entity = null;
        this._entityStatus = EntityStatus.Unknown;
        this._parentEntity = null;
        this._childEntities.length=0;
    }

}