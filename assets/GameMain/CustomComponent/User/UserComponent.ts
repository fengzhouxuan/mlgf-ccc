import { _decorator, Component, Node } from 'cc';
import MlComponent from '../../../Framework/Script/Base/MlComponent';
import { SettingComponent } from '../../../Framework/Script/SettingComponent/SettingComponent';
import MlEntry from '../../../Framework/Script/Base/MlEntry';
import { UserDataMerger } from './UserDataMerger';
const { ccclass, property } = _decorator;

@ccclass('UserComponent')
export class UserComponent extends MlComponent {
    private _settingKey = "userSettingKey";
    private _data: UserSettingData = null;
    private _settingComponent: SettingComponent;

    private _shouldSave=false;
    protected start(): void {
        this._settingComponent = MlEntry.getComponent(SettingComponent);
        this.init();
    }

    onUpdate(dt: number): void {
        super.onUpdate(dt);
        if(this._shouldSave){
            this._data.gameTimestamp = Date.now();
            this._settingComponent.set(this._settingKey, this._data);
            this._shouldSave=false;
        }
    }

    public init() {
        this.initData();
    }

    public getUserId(): string {
        return this._data.userId;
    }

    public setUserId(id: string) {
        this._data.userId = id;
    }

    public getUserData(): UserSettingData {
        return this._data;
    }

    public setData(data: object) {
        if (data) {
            this._data = UserDataMerger.deepMerge(this._data, data, UserArrayConstructors);
        }
    }

    public save() {
        this._shouldSave=true;
    }
    private initData() {
        this._data = new UserSettingData();
        let jsonData = this.getLocalSettingData();
        this._data = UserDataMerger.deepMerge(this._data, jsonData, UserArrayConstructors);
    }
    getLocalSettingData(): object {
        return this._settingComponent.getJson(this._settingKey, null);
    }
    
    getDiamond(): number {
        return this._data.diamond;
    }

    setDiamond(v: number) {
        this._data.diamond = v;
    }

    public getMusicMute(): boolean {
        return this._data.settingData.musicMute;
    }

    public setMusicMute(mute: boolean) {
        this._data.settingData.musicMute = mute;
    }

    public getSoundMute(): boolean {
        return this._data.settingData.soundMute;
    }

    public setSoundMute(mute: boolean) {
        this._data.settingData.soundMute = mute;
    }

    public getVibrateMute(): boolean {
        return this._data.settingData.vibrateMute;
    }

    public setVibrateMute(mute: boolean) {
        this._data.settingData.vibrateMute = mute;
    }
}

export class UserSettingData {
    public gameTimestamp=0;
    public levelId:number=0;
    public logicLevelId:number=0;
    public userId: string = null;
    public levels: Array<LevelSettingData> = [];
    public settingData: SettingData = new SettingData();
    public diamond:number=0;
}

export class LevelSettingData {
    public launched = 0;
    public id: number = 0;
}

export class SettingData {
    vibrateMute = false;
    soundMute = false;
    musicMute = false;
}

export class PropSettingData{
    public undoAmount=0;
    public continueAmount=0;
    public shuffleAmount=0;
}

export var UserArrayConstructors: { [key: string]: any } = {
    ["levels"]: LevelSettingData,
}
