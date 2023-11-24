import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { ReferencePool } from "../ReferencePool/ReferencePool";

export class RewardVideoClosedEventArgs extends BaseEventArgs{
    public static EventId: string = "RewardVideoClosedEventArgs";
    private _code:number;
    private _scene:string;
    
    public get code() : number {
        return this._code;
    }

    
    public get scene() : string {
        return this._scene;
    }
    
    
    public get eventId(): string {
        return RewardVideoClosedEventArgs.EventId;
    }
    constructor(){
        super();
        this.clear();
    }
    clear() {
        this._code=null;
        this._scene = null;
    }
    get customUnitName(): string {
        return RewardVideoClosedEventArgs.EventId;
    }

    public static create(code:number,scene:string):RewardVideoClosedEventArgs{
        let args = ReferencePool.acquire(RewardVideoClosedEventArgs.EventId,RewardVideoClosedEventArgs);
        args._code = code;
        args._scene =scene;
        return args;
    }

}