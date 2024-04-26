import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { GameProcedureMainGame } from "./GameProcedureMainGame";
import { GameEntry } from "../Base/GameEntry";
import { LoadDataTableSuccessEventArgs } from "../../../Framework/Script/DataTableComponent/LoadDataTableSuccessEventArgs";
import { DRLevel } from "../DataTable/DRLevel";
import { AudioManager } from "../../../FrameworkUtil/Audio/AudioManager";
import { DRLevelLoop } from "../DataTable/DRLevelLoop";
import { Constructor } from "../../../Framework/Script/Base/MlEntry";

//预加载资源，比如共享资源
export class GameProcedurePreload extends ProcedureBase {
    private _loadFlag = 0;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        GameEntry.event.on(LoadDataTableSuccessEventArgs.EventId, this.LoadDataSuccess, this);
        this.loadDataTables();
        this.loadConfig();
        AudioManager.downloadRes();
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if (this._loadFlag != 0) {
            return;
        }
        this.changeState(fsm, GameProcedureMainGame);
    }

    public onLeave(fsm: Fsm<ProcedureComponent>, isShutdown: boolean): void {
        this._loadFlag = 0;
        GameEntry.event.off(LoadDataTableSuccessEventArgs.EventId, this.LoadDataSuccess, this);
    }

    private loadDataTables() {
        this.loadDataTable("Level",DRLevel);
    }

    private loadConfig(){
        GameEntry.dataTable.loadConfig("Share","Config/MainConfig");
        this._loadFlag++;
    }

    private loadDataTable<T>(name:string,ctor: Constructor<T>){
        let path = `DataTable/${name}`;
        GameEntry.dataTable.loadDataTable("Share",path,ctor);
        this._loadFlag++;
    }
    
    private LoadDataSuccess(sneder: object, args: LoadDataTableSuccessEventArgs) {
        this._loadFlag--;
    }
}