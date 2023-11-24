import { Vec3 } from "cc";
import { IReference } from "../ReferencePool/IReference";
import { CccAstarAgent } from "./CccAstarAgent";

export class RequestPathInfo implements IReference{
    public static CustomUnitName = "RequestPathInfo";
    private _agent: CccAstarAgent;
    private _targetPosition: Vec3;
    private _userData:object;
    constructor(){
        this._agent = null;
        this._targetPosition = null;
    }

    public get agent(): CccAstarAgent {
        return this._agent;
    }
    public set agent(value: CccAstarAgent) {
        this._agent = value;
    }    

    public get targetPosition(): Vec3 {
        return this._targetPosition;
    }
    public set targetPosition(value: Vec3) {
        this._targetPosition = value;
    }
    
    public get userData() : object {
        return this._userData;
    }
    
    public set userData(v : object) {
        this._userData = v;
    }
    

    public create(agent: CccAstarAgent, targetPosition: Vec3,userData:object): RequestPathInfo{
        this._agent = agent;
        this._targetPosition = targetPosition;
        this._userData=userData;
        return this;
    }

    clear() {
        this._agent = null;
        this._targetPosition =null;
        this._userData=null;
    }
    get customUnitName(): string {
        return RequestPathInfo.CustomUnitName;
    }

}