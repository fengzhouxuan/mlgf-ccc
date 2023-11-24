import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { EntityGroup } from "./EntityGroup";
import { IReference } from "../ReferencePool/IReference";

export class HideEntityCompleteEventArgs extends BaseEventArgs {
    public static EventId: string = "HideEntityCompleteEventArgs";

    private _entityId:number;
    private _entityAssetName:string;
    private _entityGroup:EntityGroup=null;
    private _userData:object=null;

    constructor(){
        super();
        this._entityId = 0;
        this._entityAssetName = null;
        this._entityGroup = null;
        this._userData = null;
    }
    get customUnitName(): string {
        return HideEntityCompleteEventArgs.EventId;
    }

    public get eventId(): string {
        return HideEntityCompleteEventArgs.EventId;
    }
    
    public get entityId() : number {
        return this._entityId;
    }
    
    public get entityAssetName() : string {
        return this._entityAssetName;
    }
    
    public get entityGroup() : EntityGroup {
        return this._entityGroup;
    }
    
    public get userData() : object {
        return this._userData;
    }

    public initialize(entityId: number, entityAssetName: string, entityGroup: EntityGroup, userData: object): HideEntityCompleteEventArgs{
        this._entityId = entityId;
        this._entityAssetName = entityAssetName;
        this._entityGroup = entityGroup;
        this._userData = userData;
        return this;
    }
    
    public static create(entityId: number, entityAssetName: string, entityGroup: EntityGroup, userData: object): HideEntityCompleteEventArgs{
        let args = new HideEntityCompleteEventArgs();
        args._entityId = entityId;
        args._entityAssetName = entityAssetName;
        args._entityGroup = entityGroup;
        args._userData = userData;
        return args;
    }

    clear() {
     this._entityId=0;
     this._entityGroup=null;
     this._entityAssetName= null;
     this._userData=null;
    }
}