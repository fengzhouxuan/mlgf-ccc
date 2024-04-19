import { OnAdCloseCallback } from "./AdComponent";

export abstract class AdHelper{
    abstract get platformName():string;
    init(){
        this.onInit();
    }

    abstract onInit();

    abstract isVideoReady():boolean;

    abstract playVideo(onClose:OnAdCloseCallback,scene:string);
}