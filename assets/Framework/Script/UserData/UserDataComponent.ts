import { _decorator } from 'cc';
import MlComponent from '../Base/MlComponent';
import { SettingComponent } from '../SettingComponent/SettingComponent';
import MlEntry from '../Base/MlEntry';
import { AppComponent, AppEnvType, LoginInfo, UserInfo } from '../App/AppComponent';
import { UserDataServerDelegate, UserIdInfo } from './UserDataServerDelegate';
import { MLConfig } from '../../Config/MLConfig';
import { TimeLine, TimeLineItem } from '../Base/TimeLine';
import { StringUtils } from '../Utils/StringUtils';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
const { ccclass } = _decorator;

@ccclass('UserDataComponent')
export class UserDataComponent extends MlComponent {
    private _settingKey = "userSettingKey";
    private _data: UserSettingData = null;
    private _settingComponent: SettingComponent;
    private _appComponent: AppComponent;
    private _dataServerDelegate: UserDataServerDelegate;

    private _saveDirty=false;
    private _inited=false;
    private _autoSaveIntervalAdd=0;
    private _saveDelayIntervalAdd=0;
    protected start(): void {
        this._settingComponent = MlEntry.getComponent(SettingComponent);
        this._appComponent = MlEntry.getComponent(AppComponent);
        this._appComponent.event.on(AppComponent.EventType.OnAuthUserInfo, this.onAuthUserInfo, this);
        this._appComponent.event.on(AppComponent.EventType.OnHide, this.onAppHide, this);
        this.init();
    }

    private onAppHide(){
        if(!this._inited){
            return;
        }
        this.saveNow();
    }

    onUpdate(dt: number): void {
        if(!this._inited){
            return;
        }
        this.updateSaveDirty(dt);
        this.updateAutoSave(dt);
    }

    private updateSaveDirty(dt:number){
        if(this._saveDirty){
            this._saveDelayIntervalAdd+=dt;
            if(this._saveDelayIntervalAdd<MLConfig.UserData_SaveDelay){
                return;
            }
            this.saveNow();
            this._saveDelayIntervalAdd=0;
            this._autoSaveIntervalAdd=0;
            this._saveDirty=false;
        }
    }

    private updateAutoSave(dt:number){
        if(MLConfig.UserData_AutoSaveInterval<=0){
            return;
        }
        this._autoSaveIntervalAdd+=dt;
        if(this._autoSaveIntervalAdd>MLConfig.UserData_AutoSaveInterval){
            this.saveNow();
            this._autoSaveIntervalAdd=0;
            this._saveDirty=false;
        }
    }

    public get data(): UserSettingData {
        return this._data;
    }

    public setServerDelegate(delegate: UserDataServerDelegate) {
        this._dataServerDelegate = delegate;
    }

    public login(success?: (info: LoginInfo) => void, fail?: () => void) {
        this._appComponent.login((info: LoginInfo) => {
            this.internalGetDataServerDelegate().getUserId(MLConfig.AppId, info.code, info.anonymousCode, (userIdInfo: UserIdInfo) => {
                this.setUserId(userIdInfo.openId);
                this.setAnonymousUserId(userIdInfo.anonymousOpenId);
                success && success(info);
            });
        }, () => {
            fail && fail();
        });
    }

    public initServerData(success?:()=>void) {
        if(!MLConfig.UserData_RequestSeverDataWhenDebug && GameEntry.app.getAppEnvType() == AppEnvType.Debug){
            setTimeout(() => {
                success && success();
            }, 0);
            return;
        }
        this.internalGetServerData((data)=>{
            this.mergeData(data);
            success && success();
        });
    }

    public save(){
        this._saveDelayIntervalAdd=0;
        this._saveDirty=true;
    }

    public saveNow(){
        this._data.gameTimestamp = Date.now();
        this._settingComponent.set(this._settingKey, this._data);
        let env= GameEntry.app.getAppEnvType();
        if(env == AppEnvType.Debug){
            if(MLConfig.UserData_SaveSeverDataWhenDebug){
                this.internalSaveDataToServer();    
            }
        }else{
            this.internalSaveDataToServer();
        }
        
    }

    public setKV(key: string, value: any) {
        this._data[key] = value;
    }

    public getKV(key: string): any {
        return this._data[key];
    }

    public getUserId(): string {
        return this._data.userId;
    }

    public setUserId(userId: string) {
        this._data.userId = userId;
    }

    public getAnonymousUserId(): string {
        return this._data.anonymousUserId;
    }

    public setAnonymousUserId(anonymousUserId: string) {
        this._data.anonymousUserId = anonymousUserId;
    }

    public getNickname(): string {
        return this._data.nickname;
    }

    public setNickname(nickname: string) {
        this._data.nickname = nickname;
    }

    public getAvatarUrl(): string {
        return this._data.avatarUrl;
    }

    public setAvatarUrl(avatarUrl: string) {
        this._data.avatarUrl = avatarUrl;
    }

    public getMusicMute(): boolean {
        return this._data.musicMute ?? false;
    }

    public setMusicMute(mute: boolean) {
        this._data.musicMute = mute;
    }

    public getSoundMute(): boolean {
        return this._data.soundMute ?? false;
    }

    public setSoundMute(mute: boolean) {
        this._data.soundMute = mute;
    }

    public getVibrateMute(): boolean {
        return this._data.vibrateMute ?? false;
    }

    public setVibrateMute(mute: boolean) {
        this._data.vibrateMute = mute;
    }

    private init() {
        this.initData();
        this._inited=true;
    }

    private initData() {
        this._data = new UserSettingData();
        let jsonData = this.getLocalSettingData();
        this.mergeData(jsonData);
    }

    private mergeData(data: object) {
        this._data = { ...this._data, ...data };
    }

    private getLocalSettingData(): object {
        return this._settingComponent.getJson(this._settingKey, {});
    }

    private onAuthUserInfo(userInfo: UserInfo) {
        this.setNickname(userInfo.nickName);
        this.setAvatarUrl(userInfo.avatarUrl);
    }

    private internalGetDataServerDelegate(): UserDataServerDelegate {
        if (this._dataServerDelegate) {
            return this._dataServerDelegate;
        } else {
            console.log("请设置数据服务器代理");
            return null;
        }
    }

    private internalGetServerData(success:(data:object)=>void) {
        let userIdData =null;
        let anonymousUserIdData =null;
        TimeLine.line(this)
            .add(0.5, TimeLine.REPEAT_FOREVER, (item: TimeLineItem) => {
                //end
                if(userIdData && anonymousUserIdData){
                    //合并数据
                    let userGameStamp = userIdData["gameTimestamp"] ?? 0;
                    let anonymousUserGameStamp = anonymousUserIdData["gameTimestamp"] ?? 0;
                    if(userGameStamp > anonymousUserGameStamp){
                        success && success(userIdData);
                    }else{
                        success && success(anonymousUserIdData);
                    }
                    item.stop();
                }
            }
            ,(item:TimeLineItem)=>{
                //start
                this.internalGetServerDataByUserId((data) => {
                    userIdData = data ?? {};
                },()=>{
                    userIdData={};
                });
                this.internalGetServerDataByAnonymousUserId((data)=>{
                    anonymousUserIdData=data ?? {};
                },()=>{
                    anonymousUserIdData={};
                });
            }).start();
    }

    private internalGetServerDataByUserId(success:(data:object)=>void,fail?:()=>void){
        if(StringUtils.IsNullOrEmpty(this._data.userId)){
            fail && fail();
            return;
        }
        this.internalGetDataServerDelegate().loadUserData(MLConfig.AppId, this._data.userId, this._settingKey,(userData)=>{
            if (userData){
                success && success(userData);
            }else {
                fail && fail();
            }
        });
    }

    private internalGetServerDataByAnonymousUserId(success:(data:object)=>void,fail?:()=>void){
        if(StringUtils.IsNullOrEmpty(this._data.anonymousUserId)){
            fail && fail();
            return;
        }
        this.internalGetDataServerDelegate().loadUserData(MLConfig.AppId, this._data.anonymousUserId, this._settingKey,(userData)=>{
            if (userData){
                success && success(userData);
            }else {
                fail && fail();
            }
        });
    }

    private internalSaveDataToServer(success?:()=>void,fail?:()=>void){
        let userId="";
        if(!StringUtils.IsNullOrEmpty(this._data.userId)){
            userId = this._data.userId;
        }else if(!StringUtils.IsNullOrEmpty(this._data.anonymousUserId)){
            userId = this._data.anonymousUserId;
        }else{
            fail && fail();
            return;
        }
        this.internalGetDataServerDelegate().saveUserData(MLConfig.AppId, userId, this._settingKey, this._data, (data) => {
            success && success();
        });
    }
}

export class UserSettingData {
    gameTimestamp = 0;
    userId: string = null;
    anonymousUserId: string = null;
    nickname: string = null;
    avatarUrl: string = null;

    vibrateMute = false;
    soundMute = false;
    musicMute = false;

}


