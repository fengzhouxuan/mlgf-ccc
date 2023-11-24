import { Component, instantiate } from "cc";
import { Constructor } from "../Base/MlEntry";
import { ClassUtils } from "../Utils/ClassUtils";
import { EntityLogic } from "./EntityLogic";
import { IReference } from "../ReferencePool/IReference";

export class ShowEntityInfo implements IReference{
    private _entityLogicType: Constructor<EntityLogic>;
    private _entityLogicTypeName:string;
    private _userData:object;
    public static CustomUnitName:string= "ShowEntityInfo";
    constructor(){
        this._entityLogicType = null;
        this._entityLogicTypeName = null;
        this._userData = null;
    }
    public get customUnitName(): string {
        return ShowEntityInfo.CustomUnitName;
    }
    public get entityLogicType(): Constructor<EntityLogic> {
        return this._entityLogicType;
    }
    
    public get entityLogicTypeName() : string {
        return this._entityLogicTypeName;
    }

    public get userData() : object {
        return this._userData;
    }

    public initialize(entityLogicType: Constructor<EntityLogic>, userData: object): ShowEntityInfo{
        this._entityLogicType = entityLogicType;
        this._entityLogicTypeName = ClassUtils.GetClassName(entityLogicType);
        this._userData = userData;
        return this;
    }
    
    public static create(entityLogicType: Constructor<EntityLogic>, userData: object): ShowEntityInfo{
        let showEntityInfo = new ShowEntityInfo();
        showEntityInfo._entityLogicType =entityLogicType;
        showEntityInfo._entityLogicTypeName = ClassUtils.GetClassName(entityLogicType);
        showEntityInfo._userData = userData;
        return showEntityInfo;
    }

    clear() {

        this._entityLogicType = null;
        this._entityLogicTypeName = null;
        this._userData = null;
    }
}