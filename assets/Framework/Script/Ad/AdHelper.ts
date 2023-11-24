import { OnAdCloseCallback } from "./AdComponent";

export abstract class AdHelepr{
    abstract get platformName():string;
    init(){
        this.onInit();
    }

    abstract onInit();

    abstract isVideoReady(autoToast:boolean):boolean;

    abstract playVideo(onClose:OnAdCloseCallback,scene:string);
}