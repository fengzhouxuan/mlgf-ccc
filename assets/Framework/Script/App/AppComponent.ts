import { _decorator, Component, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { UserInfoAuthor } from './UserInfoAuthor/UserInfoAuthor';
import { BYTEDANCE, WECHAT } from 'cc/env';
import { WxUserInfoAuthor } from './UserInfoAuthor/WxUserInfoAuthor';
const { ccclass, property } = _decorator;

@ccclass('AppComponent')
export class AppComponent extends MlComponent {
    private _cachedUserInfo:UserInfo;
    private _userInfoAuthor:UserInfoAuthor;
    
    public get cachedUserInfo() : UserInfo {
        return this._cachedUserInfo;
    }
    
    protected onLoad(): void {
        super.onLoad();
        if(WECHAT){
            this._userInfoAuthor = new WxUserInfoAuthor();
        }else if(BYTEDANCE){

        }else{

        }
        this._userInfoAuthor.init();
    }
    public isNeedUserButton():boolean{
        return this._userInfoAuthor.isNeedUserButton();
    }
    public getUserInfo(option:GetUserInfoOption,success:(userInfo:UserInfo)=>void,fail:()=>void) {
        if(this._cachedUserInfo){
            setTimeout(()=>{
                success && success(this._cachedUserInfo);
            },0);
            return;
        }
        this._userInfoAuthor?.authorUserInfo(option,(userInfo)=>{
            this._cachedUserInfo = userInfo;
            this.shutdownGetUserInfo();
            success && success(userInfo);
        },fail);
    }

    public shutdownGetUserInfo(){
        this._userInfoAuthor?.shutdown();
    }
}

export class GetUserInfoOption{
    left?:number;
    top?:number;
    width?:number;
    height?:number;
    force?:boolean;
}

export class UserInfo{
    nickName?:string;
    avatarUrl?:string;
}

