import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { GameEntry } from "../Base/GameEntry";
import { GameMain } from "../Game/GameMain";
import { SplashLoading } from "../../../FrameworkUtil/Scene/SplashLoading";

//进入游戏
export class GameProcedureMainGame extends ProcedureBase{
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        SplashLoading.Destroy();
        GameEntry.game = GameMain.Launch();
        // AudioManager.playMusic(AudioId.BGM);
    }

    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        GameMain.Instance.update(dt);
    }
}
