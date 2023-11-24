import { Fsm } from "../Fsm/Fsm";
import { FsmState } from "../Fsm/FsmState";
import { ProcedureComponent } from "./ProcedureComponent";

export class ProcedureBase extends FsmState<ProcedureComponent>{
    public OnInit(fsm: Fsm<ProcedureComponent>): void {
        super.OnInit(fsm);    
    }
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        super.onEnter(fsm);
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        super.onUpdate(fsm,dt);
    }
    public onLeave(fsm: Fsm<ProcedureComponent>, isShutdown: boolean): void {
        super.onLeave(fsm,isShutdown);
    }
    public onDestroy(fsm: Fsm<ProcedureComponent>): void {
        super.onDestroy(fsm);
    }

}