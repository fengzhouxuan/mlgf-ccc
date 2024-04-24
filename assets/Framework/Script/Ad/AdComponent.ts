import { _decorator, Component, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { AdHelper } from './AdHelper';
import { BYTEDANCE, WECHAT } from 'cc/env';
import { WxAdHelper } from './WxAdHelper';
import { DefaultAdHelper } from './DefaultAdHelper';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
import { RewardVideoClosedEventArgs } from './RewardVideoClosedEventArgs';
import { MLConfig } from '../../Config/MLConfig';
import { TTAdHelper } from './TTAdHelper';
const { ccclass, property } = _decorator;

export type OnAdCloseCallback = (resCode:number) => void;
export enum AdErrorCode{
    None=0,
    NoComplete=100,
}
@ccclass('AdComponent')
export class AdComponent extends MlComponent {
    private _adHelper:AdHelper;
    protected start(): void {
        if(WECHAT){
            this._adHelper = new WxAdHelper();
        }else if(BYTEDANCE){
            this._adHelper = new TTAdHelper();
        }else{
            this._adHelper = new DefaultAdHelper();
        }
        this._adHelper.setRewardVideoId(MLConfig.Ad_RewardId);
        this._adHelper.init();
    }

    public isVideoReady():boolean{
        let ready = this._adHelper.isVideoReady();
        return ready;
    }

    public playVideo(onClose:OnAdCloseCallback,scene?:string){
        this._adHelper.playVideo((code)=>{
            let args =RewardVideoClosedEventArgs.create(code,scene);
            GameEntry.event.emit(this,args);
            onClose(code);
        },scene);
    }
}

