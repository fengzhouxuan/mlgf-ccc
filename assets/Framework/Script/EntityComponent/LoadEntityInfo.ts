import { IReference } from "../ReferencePool/IReference";
import { EntityGroup } from "./EntityGroup";

export class LoadEntityInfo implements IReference{
    private _serialId:number;
    private _entityId:number;
    private _entityAssetName:string;
    private _entityGroup:EntityGroup=null;
    private _userData:object=null;
    public static CustomUnitName: string = "LoadEntityInfo";
    constructor(){
        this._serialId = 0;
        this._entityId = 0;
        this._entityAssetName = null;
        this._entityGroup = null;
        this._userData = null;
    }

    public get customUnitName(): string {
        return LoadEntityInfo.CustomUnitName;
    }
    
    public get serialId() : number {
        return this._serialId;
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

    public initialize(serialId: number, entityId: number, entityAssetName: string, entityGroup: EntityGroup, userData: object):LoadEntityInfo{
        this._serialId = serialId;
        this._entityId = entityId;
        this._entityAssetName = entityAssetName;
        this._entityGroup = entityGroup;
        this._userData = userData;
        return this;
    }
    
    public static create(serialId: number, entityId: number, entityAssetName: string, entityGroup: EntityGroup, userData: object):LoadEntityInfo{
        let loadEntityInfo = new LoadEntityInfo();
        loadEntityInfo._serialId = serialId;
        loadEntityInfo._entityId = entityId;
        loadEntityInfo._entityAssetName = entityAssetName;
        loadEntityInfo._entityGroup = entityGroup;
        loadEntityInfo._userData =  userData;
        return loadEntityInfo;
    }
    clear() {

        this._serialId = 0;
        this._entityId = 0;
        this._entityAssetName = null;
        this._entityGroup = null;
        this._userData = null;
    }
}