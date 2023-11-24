
import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { Entity } from "./Entity";
import { EntityLogic } from "./EntityLogic";
import { ShowEntityInfo } from "./ShowEntityInfo";
import { IReference } from "../ReferencePool/IReference";
import { Constructor } from "../Base/MlEntry";

export class ShowEntitySuccessEventArgs extends BaseEventArgs {
    public static EventId: string = "ShowEntitySuccessEventArgs";

    private _entityLogicType:Constructor<EntityLogic>=null;
    private _entityLogicTypeName:string=null;
    private _entity:Entity=null;
    private _duration:number;
    private _userData:object;

    constructor(){
        super();
        this._entity = null;
        this._entityLogicType = null;
        this._entityLogicTypeName = "";
        this._userData = null;
        this._duration = 0;
    }

    public get customUnitName(): string {
        return ShowEntitySuccessEventArgs.EventId;
    }

    public get eventId(): string {
        return ShowEntitySuccessEventArgs.EventId;
    }

    public get entityLogicType(): Constructor<EntityLogic> {
        return this._entityLogicType;
    }
    
    public get entityLogicTypeName() : string {
        return this._entityLogicTypeName;
    }
    
    
    public get entity() : Entity {
        return this._entity;
    }
    
    public get duration() : number {
        return this._duration;
    }
    
    public get userData() : object {
        return this._userData;
    }
    public initialize(entity: Entity, duration: number, userData: object): ShowEntitySuccessEventArgs {
        let showEntityInfo = userData as ShowEntityInfo;
        this._entityLogicType = showEntityInfo.entityLogicType;
        this._entityLogicTypeName = showEntityInfo.entityLogicTypeName;
        this._entity = entity;
        this._duration = duration;
        this._userData = showEntityInfo.userData;
        return this;
    }
    public static create(entity: Entity,duration:number,userData: object): ShowEntitySuccessEventArgs{
        let args = new ShowEntitySuccessEventArgs();
        let showEntityInfo = userData as ShowEntityInfo;
        args._entityLogicType = showEntityInfo.entityLogicType;
        args._entityLogicTypeName = showEntityInfo.entityLogicTypeName;
        args._entity = entity;
        args._duration = duration;
        args._userData = showEntityInfo.userData;
        return args;
    }

    public clear() {

        this._entity=null;
        this._entityLogicType =null;
        this._entityLogicTypeName ="";
        this._userData=null;
        this._duration=0;
    }
}