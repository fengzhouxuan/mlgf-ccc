import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/ProcedureBase";
import { GameProcedureDownLoadPackge } from "./GameProcedureDownLoadPackge";
import { SplashLoading } from "../../../FrameworkUtil/Scene/SplashLoading";
import { GameEntry } from "../Base/GameEntry";
import { LoginInfo } from "../../../Framework/Script/App/AppComponent";
import { DefaultUserDataServerDelegate } from "../../../Framework/Script/UserData/UserDataServerDelegate";

//初始化流程
export class GameProcedureInit extends ProcedureBase {
    private loginComplete: boolean = false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        SplashLoading.Active(true, "正在初始化用户数据。。。");
        GameEntry.user.setServerDelegate(new DefaultUserDataServerDelegate());
        this.login();
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if (this.loginComplete) {
            this.changeState(fsm, GameProcedureDownLoadPackge);
        }
    }

    private login() {
        console.log(`login开始`);
        GameEntry.user.login((info:LoginInfo)=>{
            // 登录成功后，获取用户数据
            this.getUserData();
        },()=>{
            // 登录失败，重新登录
            this.loginComplete = true;
        });
    }
    private getUserData() {
        console.log(`getUserData开始`);
        GameEntry.user.initServerData(()=>{
            this.loginComplete = true;
        });
    }
}