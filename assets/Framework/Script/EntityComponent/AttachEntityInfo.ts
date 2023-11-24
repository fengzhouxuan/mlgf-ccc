import { Node } from "cc";
import { IReference } from "../ReferencePool/IReference";

export class AttachEntityInfo implements IReference{
    private _parentNode:Node;
    private _userData:object;
    public static CustomUnitName: string ="AttachEntityInfo";
    constructor(){
        this._parentNode = null;
        this._userData = null;
    }
    public get customUnitName(): string {
     return AttachEntityInfo.CustomUnitName;   
    }
    public get parentNode() : Node {
        return this._parentNode;
    }
    
    public get userData() : object {
        return this._userData;
    }

    public initialize(parentNode: Node, userData: object): AttachEntityInfo {
        this._parentNode = parentNode;
        this._userData = userData;
        return this;
    }
    
    public static create(parentNode: Node, userData: object):AttachEntityInfo{
        let attachedInfo = new AttachEntityInfo();
        attachedInfo._parentNode = parentNode;
        attachedInfo._userData = userData;
        return attachedInfo;
    }

    clear() {
        this._parentNode = null;
        this._userData =null;
    }
}