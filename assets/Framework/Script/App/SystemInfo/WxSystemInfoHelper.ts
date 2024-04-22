import { _decorator, math} from 'cc';
import { SystemInfoHelper } from './SystemInfoHelper';
import { WXApiUtils, WxVibrateType } from '../../Env/Wx/WXApiUtils';
import { LoginInfo } from '../AppComponent';
const { ccclass } = _decorator;

@ccclass('WxSysInfoHelper')
export class WxSysInfoHelper extends SystemInfoHelper{
    public onInit(){
        
    }
    public onShow(onShow: (res) => void){
        WXApiUtils.onShow(onShow);
    }

    public offShow(onShow: (res) => void){
        WXApiUtils.offShow(onShow);
    }

    public onHide(onHide: (res) => void){
        WXApiUtils.onHide(onHide);
    }

    public offHide(onHide: (res) => void){
        WXApiUtils.offHide(onHide);
    }
    public login(success: (info: LoginInfo) => void, fail: () => void) {
        WXApiUtils.login((res)=>{
            success({code:res});
        }, fail);
    }
    public getScreenSize(): { width: number, height: number } {
        return WXApiUtils.getScreenSize();
    }
    
    public checkUpdate(title:string,content:string){
        WXApiUtils.checkUpdate(title,content);
    }

    public onAudioInterruptionEnd(callback: Function) {
        WXApiUtils.onAudioInterruptionEnd(callback);
    }

    public vibrateShort(){
        WXApiUtils.vibrateShort(WxVibrateType.Medium);
    }
    public vibrateLong(){
        WXApiUtils.vibrateShort(WxVibrateType.Heavy);
    }

    public setFrameRate(rate: number) {
        WXApiUtils.setFrameRate(rate);
    }

    public showShareMenu(){
        WXApiUtils.showShareMenu();
    }
}

