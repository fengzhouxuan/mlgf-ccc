import { IReference } from "../ReferencePool/IReference";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";

export class EventNode implements IReference{
    public static CustomUnitName = "MLEvent-EventNode";
    private _sender:object;
    private _args: BaseEventArgs;

    
    public get sender() : object {
        return this._sender
    }
    
    public get args() : BaseEventArgs {
        return this._args;
    }
    
    get customUnitName(): string {
        return EventNode.CustomUnitName;
    }
    
    clear() {
        this._sender =null;
        this._args =null;
    }

    public static create(sender:object,args:BaseEventArgs):EventNode{
        let node = ReferencePool.acquire(this.CustomUnitName,EventNode);   
        node._sender = sender;
        node._args = args;
        return node;
    }

}