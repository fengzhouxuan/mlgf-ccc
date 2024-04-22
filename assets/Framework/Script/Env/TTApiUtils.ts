let tt = window["tt"];
export enum TTAuthKey {
  userInfo = 'scope.userInfo',
  userLocation = 'scope.userLocation',
  record = 'scope.record',        //录音
  writePhotosAlbum = 'scope.album', //保存相册
  camera = 'scope.camera',        //摄像头
  screenRecord = 'scope.screenRecord',  //录屏
  calendar= 'scope.calendar',     //添加日历
}
export class TTApiUtils {

  public static onShow(onShow:(res)=>void){
    tt?.onShow(onShow);
  }

  public static offShow(onShow:(res)=>void){
    tt?.offShow(onShow);
  }

  public static onHide(onHide:(res)=>void){
    tt?.onHide(onHide);
  }

  public static offHide(onHide:(res)=>void){
    tt?.offHide(onHide);
  }

  public static onAudioInterruptionEnd(callback: Function) {
    tt?.onAudioInterruptionEnd(callback);
  }

  public static vibrateShort(){
    tt?.vibrateShort();
  }

  public static vibrateLong(){
    tt?.vibrateLong();
  }

  public static setFrameRate(rate: number) {
    tt?.setPreferredFramesPerSecond(rate);
  }

  public static showShareMenu(){
    tt?.showShareMenu();
  }

  public static getScreenSize(): { width: number, height: number } {
    let systemInfo = this.getSystemInfo();
    return { width: systemInfo.screenWidth, height: systemInfo.screenHeight };
  }

  public static getSystemInfo() {
    return tt?.getSystemInfoSync();
  }
  static request(url: string, data: object, method: string, success: Function, fail: Function) {
    tt?.request({
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

  static getSetting(success: (res) => void, fail?: () => void):void{
    tt?.getSetting({
      success: (res) => {
        success && success(res.authSetting);
      }
      , fail: () => {
        fail && fail();
      }
    })
  }

  static login(success: (res) => void, fail?: () => void):void{
    tt?.login({
      force:true,
      success: (res) => {
        success && success(res);
      }
      , fail: () => {
        fail && fail();
      }
    });
  }

  static getUserInfo(success: (res) => void, fail?: () => void):void{
    tt?.getUserInfo({
      success: (res) => {
        success && success(res);
      }
      , fail: () => {
        fail && fail();
      }
    });
  }

  static checkUpdate(title:string,content:string) {
    const updateManager = tt.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(function () {
      tt.showModal({
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
}


