import { _decorator} from 'cc';
import { OnAdCloseCallback, AdErrorCode } from "./AdComponent";
import { AdHelper } from "./AdHelper";
const { ccclass } = _decorator;

let tt = window["tt"];
@ccclass('TTAdHelper')
export class TTAdHelper extends AdHelper {
    private _video = null;
    private _videoLoaded = false;
    private _currentCloseCallback: OnAdCloseCallback = null;

    get platformName(): string {
        return "tt";
    }

    onInit() {
        this.initVideo();
    }

    initVideo() {
        let adId = this._rewardVideoId;
        this._video = tt.createRewardedVideoAd({ adUnitId: adId });
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
        this._currentCloseCallback = onClose;
        this._videoLoaded=false; 
        this._video.show()
        .then(()=>{
            // console.log("视频广告展示");
        })
        .catch((err)=>{
            // console.log("视频广告展示失败");
            this._video.load().then(() => {
                // console.log("手动加载成功");
                // 加载成功后需要再显示广告
                this._video.show();
            });
        });

    }
}

