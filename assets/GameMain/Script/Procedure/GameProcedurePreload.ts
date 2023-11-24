import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/Procedurease";
import { GameProcedureMainGame } from "./GameProcedureMainGame";
import { GameEntry } from "../Base/GameEntry";
import { LoadDataTableSuccessEventArgs } from "../../../Framework/Script/DataTableComponent/LoadDataTableSuccessEventArgs";
import { DRLevel } from "../DataTable/DRLevel";
import { AudioManager } from "../../../FrameworkUtil/Audio/AudioManager";
import { DRLevelLoop } from "../DataTable/DRLevelLoop";

//预加载资源，比如共享资源
export class GameProcedurePreload extends ProcedureBase {
    private _loadFlag = 0;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        GameEntry.event.on(LoadDataTableSuccessEventArgs.EventId, this.LoadDataSuccess, this);
        this.loadDataTables();
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
        GameEntry.dataTable.loadDataTableWithMergedJsons(
        "Share","Config/GameDatatables"
        ,["Level","LevelLoop"]
        ,[DRLevel,DRLevelLoop]);
        this._loadFlag++;
        GameEntry.dataTable.loadConfig("Share","Config/MainConfig");
        this._loadFlag++;
    }
    
    private LoadDataSuccess(sneder: object, args: LoadDataTableSuccessEventArgs) {
        this._loadFlag--;
    }
}