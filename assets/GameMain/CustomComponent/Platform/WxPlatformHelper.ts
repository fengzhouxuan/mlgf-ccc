import { math } from "cc";
import { PlatformHelper } from "./PlatformHelper";
let wx = window["wx"];
type ShareTemplate = { imageUrlId: string, imageUrl: string };
export class WxPlatformHelper extends PlatformHelper {

  private _shareTemplates: ShareTemplate[];
  onInit() {
    this._shareTemplates = [
      {
        imageUrlId: "xxx==",
        imageUrl: "xxx"
      },
      ];
    wx?.showShareMenu();

    // let index = math.randomRangeInt(0,this._shareTemplates.length);
    // let self = this;
    // wx?.onShareAppMessage(()=> {
    //   return {
    //     imageUrlId: self._shareTemplates[index].imageUrlId,
    //     imageUrl: self._shareTemplates[index].imageUrl
    //   }
    // });
    
    this.checkUpdate();
  }
  onAudioInterruptionEnd(callback: Function) {
    wx?.onAudioInterruptionEnd(callback);
  }

  onShow(callback: Function) {
    wx?.onShow((res)=>{
      callback(res);
      if(this._shared && this._shareCallback){
        let now = Date.now();
        if(now - this._shareBeginDate>=2000){
          this._shareCallback(0);
        }else{
          this._shareCallback(-1);
        }
        this._shared=false;
        this._shareCallback=null;
      }
    });
  }
  onHide(callback: Function) {
    wx?.onHide(callback);
  }

  setFrameRate(rate: number) {
    wx?.setPreferredFramesPerSecond(30);
  }

  triggerGC() {
    wx?.triggerGC()
  }

  private checkUpdate() {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

  }

  loadPackge(name: string, success: Function, fail: Function, progress: Function) {
    const loadTask = wx.loadSubpackage({
      name: name, // name 可以填 name 或者 root
      success: function (res) {
        // 分包加载成功后通过 success 回调
        success && success(res);
      }.bind(this),
      fail: function (res) {
        // 分包加载失败通过 fail 回调
        success && fail(res);
      }
    })

    loadTask.onProgressUpdate(res => {
      progress && progress(res.totalBytesWritten/res.totalBytesExpectedToWrite);
    })
  }

  httpRequest(url: string, data: object, method: string, success: Function, fail: Function) {
    // console.log("wx保存"+JSON.stringify(data));
    wx?.request({
      url: url,
      method: method,
      data: data,
      success: function (res) {
        success && success(res);
      },
      fail: function (res) {
        fail && fail(res);
      }
    })
  }

  login(url: string, success: Function, fail: Function) {
    wx.login({
      success(res) {
        if (res.code) {
          // console.log('wx登录成功！' + res.code)
          wx.request({
            url: url,
            method: 'POST',
            data: {
              code: res.code
            },
            success: (loginRes) => {
              // console.log("登录成功：" + JSON.stringify(loginRes));
              // console.log("openId" + loginRes.data.data.openid);
              success && success(loginRes.data.data.openid)
            },
            fail: function (res) {
              // console.log("登录失败：" + res);
              fail && fail(res);
            }
          })
        } else {
          // console.log('wx登录失败！' + res.errMsg)
          fail && fail(res);
        }
      }
    })
  }
  private _shared=false;
  private _shareCallback:Function=null;
  private _shareBeginDate=0;
  shareTmplate(callback:Function){
    let index = math.randomRangeInt(0,this._shareTemplates.length);
    this.share(null,this._shareTemplates[index].imageUrlId,this._shareTemplates[index].imageUrl);
    this._shareCallback = callback;
  }
  share(title?: string, imageUrlId?: string, imageUrl?: string) {
    this._shared=true;
    this._shareBeginDate = Date.now();
    let shareData={};
    if(title){
      shareData["title"]=title;
    }
    if(imageUrlId){
      shareData["imageUrlId"]=imageUrlId;
    }
    if(imageUrl){
      shareData["imageUrl"]=imageUrl;
    }
    wx?.shareAppMessage(shareData);
  }

  vibrateShort(){
    wx?.vibrateShort({type:"medium"});
  }

  vibrateShortMedium(){
    wx?.vibrateShort({type:"heavy"});
  }
}