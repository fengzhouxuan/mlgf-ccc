let wx = window["wx"];
export enum WxAuthKey {
  userInfo = 'scope.userInfo',
  userFuzzyLocation = 'scope.userFuzzyLocation',
  werun = 'scope.werun',
  writePhotosAlbum = 'scope.writePhotosAlbum',
  WxFriendInteraction = 'scope.WxFriendInteraction',
  gameClubData = 'scope.gameClubData',
}

export class WXApiUtils{
    public static request(url:string,method:string,data:any,success?:(res)=>void,fail?:(res)=>void){
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
      wx.getSetting({
          success: (res) => {
              success && success(res);
          }
          ,fail: () => {
              fail && fail();
          }
      })
  }

  public static getUserInfo(success: (res) => void, fail?: () => void): void {
    wx.getUserInfo({
        success: function (res) {
            success && success(res);
        },
        fail: function (res) {
          fail && fail();
        }
      });
  }

  public static createUserInfoButton(left:number,top:number,width:number,height:number, success: (res) => void, fail?: () => void): any {
    let button = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
        left: left,
        top: top,
        width: width,
        height: height,
        lineHeight: 40,
        backgroundColor: '#oo0000',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    });
    button.onTap((res) => {
      // 用户同意授权后回调，通过回调可获取用户头像昵称信息
      console.log(res)
    })
    return button;
  }
}