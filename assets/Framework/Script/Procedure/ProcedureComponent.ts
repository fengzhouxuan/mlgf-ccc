import { CCString, _decorator } from 'cc';
import MlComponent from '../Base/MlComponent';
import { Fsm } from '../Fsm/Fsm';
import { ProcedureBase } from './ProcedureBase';
import { Constructor } from '../Base/MlEntry';
import { ClassUtils } from '../Utils/ClassUtils';
import { ProcedureHelper } from './ProcedureHelper';
import { ProcedureLaunch } from './ProcedureLaunch';

const { ccclass, property } = _decorator;

@ccclass('ProcedureComponent')
export class ProcedureComponent extends MlComponent {

    @property
    helperName ="";

    private _fsm:Fsm<ProcedureComponent>;

    
    public get currentProcedure() : ProcedureBase {
        return this._fsm.currentState;
    }

    public get currentProcedureTime() : number {
        return this._fsm.currentStateTime;
    }

    protected start(): void {
        this._fsm= new Fsm<ProcedureComponent>();
        let helperClass = ClassUtils.GetClassByName(this.helperName);
        let helperInstance = new helperClass() as ProcedureHelper;
        let procedures = helperInstance.procedures;
        procedures.unshift(ProcedureLaunch);
        ProcedureLaunch.nextProcedure = helperInstance.startProcedure;
        this._fsm.Init("ProcedureComponentFsm",this,procedures);
        this._fsm.start(ProcedureLaunch);
    }
    
    public onUpdate(dt:number){
        this._fsm.update(dt);
    }

    public startProcedure(procedure:Constructor<ProcedureBase>){
        this._fsm.start(procedure);
    }
    public hasProcedure(procedure:Constructor<ProcedureBase>){
        return this._fsm.hasState(procedure);
    }

    public getProcedure(procedure:Constructor<ProcedureBase>){
        return this._fsm.getState(procedure);
    }
    
}


