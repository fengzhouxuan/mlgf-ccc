import { LoginInfo } from "../../../Framework/Script/App/AppComponent";
import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { GameEntry } from "../Base/GameEntry";
import { GameProcedureInitUserData } from "./GameProcedureInitUserData";

export class GameProcedureLogin extends ProcedureBase{
    private _loginComplete: boolean = false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        this.login();
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if (this._loginComplete) {
            this.changeState(fsm, GameProcedureInitUserData);
        }
    }

    public onLeave(fsm: Fsm<ProcedureComponent>, isShutdown: boolean): void {
        this._loginComplete = false;
    }

    private login() {
        console.log(`login开始`);
        GameEntry.user.login((info:LoginInfo)=>{
            this._loginComplete = true;
        },()=>{
            // 登录失败
            this._loginComplete = true;
        });
    }
}