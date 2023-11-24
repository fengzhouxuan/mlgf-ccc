import { Fsm } from "../../../Framework/Script/Fsm/Fsm";
import { ProcedureComponent } from "../../../Framework/Script/Procedure/ProcedureComponent";
import { ProcedureBase } from "../../../Framework/Script/Procedure/Procedurease";
import { GameProcedureDownLoadPackge } from "./GameProcedureDownLoadPackge";
import { SplashLoading } from "../Scene/SplashLoading";
import { GameEntry } from "../Base/GameEntry";

//初始化流程
export class GameProcedureInit extends ProcedureBase {
    private loginComplete: boolean = false;
    public onEnter(fsm: Fsm<ProcedureComponent>): void {
        SplashLoading.Active(true, "正在初始化用户数据。。。");
        this.login();
    }
    public onUpdate(fsm: Fsm<ProcedureComponent>, dt: number): void {
        if (this.loginComplete) {
            this.changeState(fsm, GameProcedureDownLoadPackge);
        }
    }
    private _loginRetryCount=0;
    private login() {
        let self = this;
        if(this._loginRetryCount>5){
            this.loginComplete = true;
            return;
        }
        console.log(`login开始 - ${this._loginRetryCount}`);
        this._loginRetryCount++;
        if (GameEntry.user.getUserId()) {
            self.getUserData();
        } else {
            GameEntry.platform.login(
                (res) => {
                    GameEntry.user.setUserId(res);
                    self.getUserData();
                },
                (fail) => {
                    console.log(`login失败 - ${this._loginRetryCount}`);
                    self.login();
                });
        }
    }
    private _getDataRetryCount=0;
    private getUserData() {
        if(this._getDataRetryCount>5){
            this.loginComplete = true;
            return;
        }
        console.log(`getUserData开始 - ${this._getDataRetryCount}`);
        this._getDataRetryCount++;
        let self = this;
        GameEntry.platform.requestUserData((remote) => {
            let localData = GameEntry.user.getLocalSettingData();
            // console.log("服务端数据:");
            // console.log(remote);
            // console.log("本地数据:");
            // console.log(localData);
            if(self.checkWithGameTimestamp(remote,localData)){
                GameEntry.user.setData(remote);
            }else if(self.checkWithLevel(remote,localData)){
                GameEntry.user.setData(remote);
            }
            self.loginComplete = true;
        }, () => {
            console.log(`getUserData失败 - ${this._getDataRetryCount}`);
            self.getUserData();
        });
    }

    private checkWithGameTimestamp(remote:any,local:any):boolean{
        if(!remote){
            return false;
        }
        let remoteTimestamp = remote["gameTimestamp"];
        if(!remoteTimestamp){
            return false;
        }
        if(!local){
            return true;
        }
        let localTimestamp = local["gameTimestamp"];
        if(localTimestamp && localTimestamp<=0){
            return true;
        }
        return remoteTimestamp >=localTimestamp;
    }

    private checkWithLevel(remote:any,local:any):boolean{
        if(!remote){
            return false;
        }
        let remoteLevel = remote["levelId"];
        if(!remoteLevel){
            return false;
        }
        if(!local){
            return true;
        }
        let localLevel = local["levelId"];
        if(!localLevel){
            return true;
        }
        return remoteLevel >=localLevel;
    }
}