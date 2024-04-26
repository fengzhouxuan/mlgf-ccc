import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { GameEntry } from "../Base/GameEntry";
import { GameProcedureDownLoadPackge } from "./GameProcedureDownLoadPackge";

export class GameProcedureInitUserData extends ProcedureBase{
    private _complete: boolean = false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        this.getUserData();
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if (this._complete) {
            this.changeState(fsm, GameProcedureDownLoadPackge);
        }
    }

    public onLeave(fsm: Fsm<ProcedureComponent>, isShutdown: boolean): void {
        this._complete = false; 
    }

    private getUserData() {
        console.log(`getUserData开始`);
        GameEntry.user.initServerData(()=>{
            this._complete = true;
        });
    }
}