import { _decorator, Component, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { AdHelper } from './AdHelper';
import { WECHAT } from 'cc/env';
import { WxAdHelper } from './WxAdHelper';
import { DefaultAdHelper } from './DefaultAdHelper';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
import { RewardVideoClosedEventArgs } from './RewardVideoClosedEventArgs';
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
        }else{
            this._adHelper = new DefaultAdHelper();
        }
        this._adHelper.init();
    }

    public isVideoReady(autoToast:boolean=false):boolean{
        let ready = this._adHelper.isVideoReady(autoToast);
        return ready;
    }

    public playVideo(onClose:OnAdCloseCallback,scene?:string){
        if(!this.isVideoReady()){
            return;
        }
        this._adHelper.playVideo((code)=>{
            onClose(code);
            let args =RewardVideoClosedEventArgs.create(code,scene);
            GameEntry.event.emit(this,args);
        },scene);
    }
}

