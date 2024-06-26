import { AdErrorCode, OnAdCloseCallback } from "./AdComponent";
import { AdHelper } from "./AdHelper";

let wx = window["wx"];

import { _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass('WxAdHelper')
export class WxAdHelper extends AdHelper {
    private _video = null;
    private _videoLoaded = false;
    private _currentCloseCallback: OnAdCloseCallback = null;
    get platformName(): string {
        return "wx";
    }

    onInit() {
        this.initVideo();
    }

    initVideo() {
        let adId = this._rewardVideoId;
        this._video = wx.createRewardedVideoAd({ adUnitId: adId });
        this._video.onLoad(() => {
            this._videoLoaded = true;
            console.log('激励视频 广告加载成功' + this._videoLoaded);
        });

        this._video.onError((err) => {
            console.log('激励视频失败' + err.errMsg);
            this._videoLoaded=false;
        });
        this._video.onClose(res => {
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                this._currentCloseCallback(AdErrorCode.None);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                this._currentCloseCallback(AdErrorCode.NoComplete);
            }
            console.log('激励视频关闭' + res?.isEnded);
        });
    }

    isVideoReady(): boolean {
        if (!this._videoLoaded) {
            this._video.load();
        }
        return this._videoLoaded;
    }
    playVideo(onClose: OnAdCloseCallback, scene: string) {
        if(!this._videoLoaded){
            return;
        }
        this._currentCloseCallback = onClose;
        this._videoLoaded=false; 
        this._video.show();

    }

}