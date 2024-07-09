let wx = window["wx"];
export enum WxAuthKey {
  userInfo = 'scope.userInfo',
  userFuzzyLocation = 'scope.userFuzzyLocation',
  werun = 'scope.werun',
  writePhotosAlbum = 'scope.writePhotosAlbum',
  WxFriendInteraction = 'scope.WxFriendInteraction',
  gameClubData = 'scope.gameClubData',
}

export enum WxVibrateType {
  Heavy = 'heavy',
  Medium = 'medium',
  Light = 'light',
}

export class WXApiUtils {

  public static onShow(onShow:(res)=>void){
    wx?.onShow(onShow);
  }

  public static offShow(onShow:(res)=>void){
    wx?.offShow(onShow);
  }

  public static onHide(onHide:(res)=>void){
    wx?.onHide(onHide);
  }

  public static offHide(onHide:(res)=>void){
    wx?.offHide(onHide);
  }
  public static onAudioInterruptionEnd(callback: Function) {
    wx?.onAudioInterruptionEnd(callback);
  }

  public static vibrateShort(type: WxVibrateType){
    wx?.vibrateShort({ type: type });
  }

  public static showShareMenu(){
    wx?.showShareMenu();
  }

  public static triggerGC(){
    wx?.triggerGC();
  }
  public static setFrameRate(rate: number) {
    wx?.setPreferredFramesPerSecond(rate);
  }

  public static getScreenSize():{width:number,height:number} {
      let screenInfo = this.getWindowInfo();
      if(screenInfo) {
        return {width: screenInfo.screenWidth, height: screenInfo.screenHeight};
      }
      let systemInfo = this.getSystemInfo();
      return {width: systemInfo.screenWidth, height: systemInfo.screenHeight};
  }
  public static getWindowInfo() {
    if(wx?.getWindowInfo) {
      return wx?.getWindowInfo();
    }
    return null;
  }
  public static getSystemInfo() {
    return wx?.getSystemInfo();
  }

  /**
   * "develop":开发版 "trial":体验版 "release":正式版
   * @returns 当前环境 
   */
  public static getEnv():string {
    return this.getAccountInfoSync()?.miniProgram?.envVersion;
  }

  public static request(url: string, method: string, data: any, success?: (res) => void, fail?: (res) => void) {
    wx?.request({
      url: url,
      method: method,
      data: data,
      success: function (res) {
        success && success(res.data);
      },
      fail: function (res) {
        fail && fail(res);
      }
    });
  }

  /**
   * 获取用户授权状态
   *
   * @param success 成功的回调函数，传入参数为用户授权状态对象
   * @param fail 失败的回调函数，无参数
   * @returns 无返回值
   */
  public static getSetting(success: (res) => void, fail?: () => void): void {
    wx?.getSetting({
      success: (res) => {
        success && success(res.authSetting);
      }
      , fail: () => {
        fail && fail();
      }
    });
  }

  public static getUserInfo(success: (res) => void, fail?: () => void): void {
    wx?.getUserInfo({
      success: function (res) {
        success && success(res);
      },
      fail: function (res) {
        fail && fail();
      }
    });
  }

  public static createUserInfoButton(left: number, top: number, width: number, height: number, success: (res) => void, fail?: () => void): any {
    let button = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
        left: left,
        top: top,
        width: width,
        height: height,
        lineHeight: 40,
        backgroundColor: '#000000',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    });
    button.onTap((res) => {
      // 用户同意授权后回调，通过回调可获取用户头像昵称信息
      if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
        // 同意
        success && success(res);
      } else {
        // 拒绝
        fail && fail();
      }
    })
    return button;
  }

  static login(success:(res)=>void,fail?:()=>void){
    wx?.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          success && success(res.code);
      }
    },
    fail(){
      fail && fail();
    }
    });
  }

  static checkUpdate(title:string,content:string){
    let updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: title,
        content: content,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    });    
  }

  private static getAccountInfoSync(){
      return wx?.getAccountInfoSync();
  }
}