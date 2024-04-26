import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { SplashLoading } from "../../../FrameworkUtil/Scene/SplashLoading";
import { GameEntry } from "../Base/GameEntry";
import { DefaultUserDataServerDelegate } from "../../../Framework/Script/UserData/UserDataServerDelegate";
import { GameProcedureLogin } from "./GameProcedureLogin";

//初始化流程
export class GameProcedureInit extends ProcedureBase {
    private loginComplete: boolean = false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        SplashLoading.Active(true, "正在初始化用户数据。。。");
        GameEntry.user.setServerDelegate(new DefaultUserDataServerDelegate());
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        this.changeState(fsm, GameProcedureLogin);
    }
}