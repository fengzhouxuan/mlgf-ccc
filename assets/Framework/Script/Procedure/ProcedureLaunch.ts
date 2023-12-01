import { ResolutionPolicy, director, screen, view } from "cc";
import { Constructor } from "../Base/MlEntry";
import { Fsm } from "../Fsm/Fsm";
import { ProcedureComponent } from "./ProcedureComponent";
import { ProcedureBase } from "./ProcedureBase";

export  class ProcedureLaunch extends ProcedureBase{
    public static nextProcedure:Constructor<ProcedureBase>=null;

    public onEnter(fsm: Fsm<ProcedureComponent>): void {

    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        this.changeState(fsm,ProcedureLaunch.nextProcedure);
    }
}