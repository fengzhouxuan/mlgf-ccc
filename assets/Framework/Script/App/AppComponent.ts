import { _decorator, Component, EventTarget, Node } from 'cc';
import MlComponent from '../Base/MlComponent';
import { UserInfoAuthor } from './UserInfoAuthor/UserInfoAuthor';
import { BYTEDANCE, WECHAT } from 'cc/env';
import { WxUserInfoAuthor } from './UserInfoAuthor/WxUserInfoAuthor';
import { SystemInfoHelper } from './SystemInfo/SystemInfoHelper';
import { WxSysInfoHelper } from './SystemInfo/WxSystemInfoHelper';
import { TTUserInfoAuthor } from './UserInfoAuthor/TTUserInfoAuthor';
import { TTSystemInfoHelper } from './SystemInfo/TTSystemInfoHelper';
import { DefaultUserInfoAuthor } from './UserInfoAuthor/DefaultUserInfoAuthor';
import { DefaultSystemInfoHelper } from './SystemInfo/DefaultSystemInfoHelper';
const { ccclass, property } = _decorator;

export enum AppEventType{
    OnShow="AppEventType.OnShow",
    OnHide = "AppEventType.OnHide",
    OnAudioInterruptionEnd = "AppEventType.OnAudioInterruptionEnd",
    OnLogin = "AppEventType.OnLogin",
    OnAuthUserInfo = "AppEventType.OnAuthUserInfo",
}
@ccclass('AppComponent')
export class AppComponent extends MlComponent {
    private _event = new EventTarget();
    public static get EventType(){
        return AppEventType;
    }
    get event(){
        return this._event;
    }
    private _cachedUserInfo:UserInfo;
    private _userInfoAuthor:UserInfoAuthor;
    private _sysHelper:SystemInfoHelper;
    public get cachedUserInfo() : UserInfo {
        return this._cachedUserInfo;
    }
    
    protected onLoad(): void {
        super.onLoad();
        if(WECHAT){
            this._userInfoAuthor = new WxUserInfoAuthor();
            this._sysHelper = new WxSysInfoHelper();
        }else if(BYTEDANCE){
            this._userInfoAuthor = new TTUserInfoAuthor();
            this._sysHelper = new TTSystemInfoHelper();
        }else{
            this._userInfoAuthor = new DefaultUserInfoAuthor();
            this._sysHelper= new DefaultSystemInfoHelper();
        }
        this._userInfoAuthor?.init();
        this._sysHelper?.init();

        this.checkUpdate("更新提示","新版本已经准备好，是否重启应用？");
        this._sysHelper?.showShareMenu();
        this._sysHelper?.onShow(res=>{
            this.internalOnshow(res);
        });

        this._sysHelper?.onHide(res=>{
            this.internalOnHide(res);
        });
        this._sysHelper?.onAudioInterruptionEnd(()=>{
            this.internalOnAudioInterruptionEnd();
        });
    }

    private internalOnshow(res){
        this._event.emit(AppEventType.OnShow,res);
    }

    private internalOnHide(res){
        this._event.emit(AppEventType.OnHide,res);
    }

    private internalOnAudioInterruptionEnd() {
        this._event.emit(AppEventType.OnAudioInterruptionEnd);
    }
    //#region  用户信息授权
    public isNeedNativeButtonToGetUsrInfo():boolean{
        return this._userInfoAuthor?.isNeedUserButton();
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
            this._event.emit(AppEventType.OnAuthUserInfo,userInfo);
            success && success(userInfo);
        },fail);
    }

    public shutdownGetUserInfo(){
        this._userInfoAuthor?.shutdown();
    }
    //#endregion

    public getAppScreenSize():{width:number,height:number}{
        return this._sysHelper?.getScreenSize();
    }

    public getAppEnvType():AppEnvType{
        return this._sysHelper?.getEnvType();
    }

    public login(success:(info:LoginInfo)=>void,fail:()=>void){
        this._sysHelper?.login((info:LoginInfo)=>{
            this._event.emit(AppEventType.OnLogin,info);
            success && success(info);
        },fail);
    }

    public checkUpdate(title:string,content:string){
        this._sysHelper?.checkUpdate(title,content);
    }

    public vibrateLong() {
        this._sysHelper?.vibrateLong();
    }
    public vibrateShort() {
        this._sysHelper?.vibrateShort();
    }
    public setFrameRate(rate: number) {
        this._sysHelper?.setFrameRate(rate);
    }

    public triggerGC(){
        this._sysHelper?.triggerGC();
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

export class LoginInfo{
    code?:string;           //登录凭证
    anonymousCode?:string;  //匿名码，用于匿名用户登录
}

export enum AppEnvType{
    Debug = 1,
    Release = 2
}

