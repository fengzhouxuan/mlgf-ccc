import { _decorator} from 'cc';
import MlComponent from "../../../Framework/Script/Base/MlComponent";
import { PlatformHelper } from './PlatformHelper';
import { WECHAT } from 'cc/env';
import { WxPlatformHelper } from './WxPlatformHelper';
import { GameEntry } from '../../Script/Base/GameEntry';
const { ccclass } = _decorator;
/**
 * 平台类
 */
@ccclass('PlatformComponent')
export class PlatformComponent extends MlComponent {
    private _helper:PlatformHelper;
    private _intervalAdd=0;
    private _postUserDataFlag = false;
    protected onLoad(): void {
        super.onLoad();
        this.init();
    }
    
    private init(){
        let self = this;
        //不同的平台请在此处替换对应的PlatformHelper
        this._helper=WECHAT ? new WxPlatformHelper() : new PlatformHelper();
        this._helper.onInit();
        this._helper.onShow(()=>{
            self._onShow();
            console.log("----onShow----");
        });
        this._helper.onHide(()=>{
            self._onHide();
            console.log("----onHide----");
        });
    }

    onUpdate(dt: number): void {
        dt= dt/GameEntry.gameSpeed;
        this._intervalAdd+=dt;
        if(this._intervalAdd>=120){
            this._postUserDataFlag=true;
            this._intervalAdd=0;
        }
        this.updatePostUserData();
    }

    private updatePostUserData(){
        if(this._postUserDataFlag){
            this.postUserData();
        }
        this._postUserDataFlag=false;
    }
    
    private _onShow(){

    }

    private _onHide(){
        this.postUserData();
    }
    
    //设置帧率
    setFrameRate(rate:number){
        this._helper.setFrameRate(rate);
    }

    triggerGC(){
        this._helper.triggerGC();
    }
    shareTmplate(callback:Function){
        this._helper.shareTmplate(callback);
    }

    vibrateShort(){
        this._helper.vibrateShort();
    }

    vibrateShortMedium(){
        this._helper.vibrateShortMedium();
    }
    //音频打断结束回调
    onAudioInterruptionEnd(callback:Function){
        this._helper.onAudioInterruptionEnd(callback);
    }

    //加载包
    loadPackge(name:string,success:Function,fail?:Function,progress?:Function){
        this._helper.loadPackge(name,success,fail,progress);
    }

    httpRequest(url:string,data:object,method:string,success:Function,fail:Function){
        this._helper.httpRequest(url,data,method,success,fail);
    }

    login(success: Function, fail: Function){
        this._helper.login("https://api.xxx/game-common/user/login",success,fail);
    }

    requstPostUserData(){
        this._postUserDataFlag=true;
    }

    postUserData(success?: Function, fail?: Function){
        let userId = GameEntry.user.getUserId();
        if(!userId){
            this.login((res) => {
                GameEntry.user.setUserId(res);
                this.internalPostUserData(success,fail);
            },
            (fail) => {

            });
            return;
        }
        this.internalPostUserData(success,fail);
    }

    private internalPostUserData(success?: Function, fail?: Function){
        let userId = GameEntry.user.getUserId();
        if(!userId){
            return;
        }
        let userData = GameEntry.user.getUserData();
        if(!userData){
            fail && fail();
            return;
        }
        let jsonData =JSON.parse(JSON.stringify(userData));
        let data = {
            openid:GameEntry.user.getUserId(),
            data:jsonData
        }
        // console.log("保存"+JSON.stringify(data));
        this._helper.httpRequest("https://xxx/api/game-common/store/save",data,'POST',(res)=>{
            if(res){
                // console.log("保存成功"+JSON.stringify(res));
            }
            success && success();
        },(failRes)=>{
            // console.log("保存失败"+failRes?.toString);
            fail && fail();
        });
    }

    requestUserData(success: Function, fail: Function){
        this._helper.httpRequest("https://xxx/api/game-common/store/get",{openid:GameEntry.user.getUserId()},'POST',(res)=>{
            // console.log("读取服务端数据：");
            // console.log(res);
            if(res){
                // console.log("读取成功:" + JSON.stringify(res));
                // GameEntry.user.setData(res.data.data);
            }
            success && success(res?.data?.data);
        },(failRes)=>{
            // console.log("读取失败"+failRes?.toString());
            fail && fail();
        });
    }
}