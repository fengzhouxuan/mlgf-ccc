import { OnAdCloseCallback } from "./AdComponent";

export abstract class AdHelper{
    abstract get platformName():string;
    protected _rewardVideoId:string;
    init(){
        this.onInit();
    }
    setRewardVideoId(id:string){
        this._rewardVideoId = id;
    }

    abstract onInit();

    abstract isVideoReady():boolean;

    abstract playVideo(onClose:OnAdCloseCallback,scene:string);
}