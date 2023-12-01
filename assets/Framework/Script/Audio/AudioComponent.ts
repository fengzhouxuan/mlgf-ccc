import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { ResourceComponent } from '../ResourceComponent/ResourceComponent';
import MlEntry from '../Base/MlEntry';
import { ReferenceCollection } from '../ReferencePool/ReferenceCollection';
import { ReferencePool } from '../ReferencePool/ReferencePool';
import { LoadAudioInfo } from './LoadAudioInfo';
import { WECHAT } from 'cc/env';
import { AudioHelper } from './AudioHelper';
import { DefaultAdHelper } from '../Ad/DefaultAdHelper';
import { WxAudioHelper } from './WxAudioHelper';
import { DefaultAudioHelper } from './DefaultAudioHelper';
const { ccclass, property } = _decorator;

@ccclass('AudioComponent')
export class AudioComponent extends MlComponent {
    private _musicAgent: AudioSource;
    private _effectAgents: AudioSource[] = [];
    private _maxEffectChannel: number;
    private _effectNode: Node;
    private _resourceComponent: ResourceComponent;

    private _musicPaused = false;
    private _musicVolume = 1;
    private _volumeScale=1;
    private _serId = 0;
    private _loadAudioInfoReference: ReferenceCollection;
    private _helper:AudioHelper;
    public get musicVolume() {
        return this._musicVolume;
    }
    public set musicVolume(value) {
        this._musicVolume = value;
    }
    protected onLoad(): void {
        super.onLoad();
        this._maxEffectChannel = AudioSource.maxAudioChannel - 1;
        this._helper = WECHAT ? new WxAudioHelper() : new DefaultAudioHelper();
        this._helper.init(this.node,this._maxEffectChannel);
        console.log("maxEffectChannel:"+this._maxEffectChannel);
    }

    protected start(): void {
        this._resourceComponent = MlEntry.getComponent(ResourceComponent);
        this._loadAudioInfoReference = ReferencePool.create(LoadAudioInfo.CustomUniName);
    }

    public playMusic(bundleName: string, assetName: string,volume:number=1) {
        this._musicPaused = false;
        let loadAudioInfo = this._loadAudioInfoReference.acquire(LoadAudioInfo).init(-1, assetName,this.musicVolume*this._volumeScale,true);
        this._resourceComponent.LoadResInBundle(bundleName, assetName, AudioClip, null, null, this.loadAssetCompleteCallback.bind(this), loadAudioInfo);
    }

    public stopMusic() {
        this._musicPaused = true;
        this._helper.stopMusic();
    }

    public playEffect(bundleName: string, assetName: string,volume:number=1):number{
        let seralId = ++ this._serId;
        let loadAudioInfo = this._loadAudioInfoReference.acquire(LoadAudioInfo).init(seralId, assetName,volume*this._volumeScale,false);
        this._resourceComponent.LoadResInBundle(bundleName, assetName, AudioClip, null, null, this.loadAssetCompleteCallback.bind(this), loadAudioInfo);
        return seralId;
    }

    private loadAssetCompleteCallback(err: Error | null, audioAsset: AudioClip, userData: object | null) {
        let loadAudioInfo = userData as LoadAudioInfo;
        if (!loadAudioInfo) {
            return;
        }
        if (err) {
            this._loadAudioInfoReference.release(loadAudioInfo);
            return;
        }
        if (loadAudioInfo.isMusic) {
            if (!this._musicPaused) {
                this._helper.playMusic(audioAsset, loadAudioInfo.volume);
            }
            
        }else{
            //TODO 判断是否在加载成功之前已经停止播放
            this._helper.playEffect(audioAsset, loadAudioInfo.volume);
        }
        this._loadAudioInfoReference.release(loadAudioInfo);
    }
}

