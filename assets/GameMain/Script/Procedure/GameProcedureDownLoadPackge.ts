import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/Procedurease";
import { GameEntry } from "../Base/GameEntry";
import { SplashLoading } from "../../../FrameworkUtil/Scene/SplashLoading";
import { GameProcedurePreload } from "./GameProcedurePreload";
/**
 * 下载流程，分包，远程包
 */

export class GameProcedureDownLoadPackge extends ProcedureBase{
    private _completed= false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        //下载公共分包
        let packageName="Share";
        this.download(packageName);
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if(this._completed){
            this.changeState(fsm,GameProcedurePreload);
        }
    }

    public onLeave(fsm: Fsm<ProcedureComponent>, isShutdown: boolean): void {
        this._completed = false;
    }

    private download(name:string){
      let onSuccess = function (res) {
        this._completed = true;
      }
      let onFail = function (res) {
  
      }
      let onProgress = function (res) {
        SplashLoading.SetProgress(res);
      }
      GameEntry.platform.loadPackge(name, onSuccess.bind(this), onFail.bind(this), onProgress.bind(this));
    }
}