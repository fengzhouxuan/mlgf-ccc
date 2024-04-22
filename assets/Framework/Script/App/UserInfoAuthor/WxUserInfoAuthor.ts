import { WXApiUtils, WxAuthKey } from "../../Env/Wx/WXApiUtils";
import { GetUserInfoOption, UserInfo } from "../AppComponent";
import { UserInfoAuthor } from "./UserInfoAuthor";

export class WxUserInfoAuthor extends UserInfoAuthor{

    protected onInit() {
        
    }

    public isNeedUserButton():boolean{
        return true;
    }
    public authorUserInfo(option: GetUserInfoOption, success: (userInfo: UserInfo) => void, fail: () => void) {
        this.auth(option.left, option.top, option.width, option.height
            ,(res)=>{
                success && success({
                    nickName:res.userInfo.nickName,
                    avatarUrl:res.userInfo.avatarUrl
                })
            }
            ,()=>{
                fail && fail();
            }
    );
    }

    public shutdown() {
        this.destroy();
    }

    private destroy(){
        this._cachedButton && this._cachedButton.destroy();
        this._cachedButton= null;
    }

    private _cachedButton:any;
    private auth(left:number,top:number,width:number,height:number,success: (res) => void, fail?: () => void): void {
        WXApiUtils.getSetting(
            (res) => {
                //成功
                if(res[WxAuthKey.userInfo]){
                    //用户已经授权
                    WXApiUtils.getUserInfo(
                        (res) => {
                            //成功
                            success && success(res);
                        },
                        () => {
                            //失败
                            fail && fail();
                        }
                    );
                }else{
                    //用户未授权
                    this._cachedButton = WXApiUtils.createUserInfoButton(left,top,width,height,(res)=>{
                        //成功
                        success && success(res);
                    },()=>{
                        //失败
                        fail && fail();
                    });
                }

            },
            () => {
                //失败
                fail && fail();
            }
        );
    }
}