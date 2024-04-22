import { _decorator} from 'cc';
import { SystemInfoHelper } from './SystemInfoHelper';
import { LoginInfo } from '../AppComponent';
import { TTApiUtils } from '../../Env/TTApiUtils';
const { ccclass } = _decorator;

@ccclass('TTSystemInfoHelper')
export class TTSystemInfoHelper extends SystemInfoHelper{
    public onInit(){

    }
    public onShow(onShow: (res) => void){
        TTApiUtils.onShow(onShow);
    }

    public offShow(onShow: (res) => void){
        TTApiUtils.offShow(onShow);
    }

    public onHide(onHide: (res) => void){
        TTApiUtils.onHide(onHide);
    }

    public offHide(onHide: (res) => void){
        TTApiUtils.offHide(onHide);
    }
    public getScreenSize(): { width: number; height: number; } {
        return TTApiUtils.getScreenSize();
    }   
    public login(success: (info: LoginInfo) => void, fail: () => void) {
        TTApiUtils.login((res)=>{
            success && success({
                code:res.code,
                anonymousCode:res.anonymousCode
            });
        }, fail);
    }
    
    public checkUpdate(title: string, content: string) {
        TTApiUtils.checkUpdate(title,content);
    }

    public onAudioInterruptionEnd(callback: Function) {
        TTApiUtils.onAudioInterruptionEnd(callback);
    }

    public vibrateLong() {
        TTApiUtils.vibrateShort();
    }

    public vibrateShort() {
        TTApiUtils.vibrateShort();
    }

    public setFrameRate(rate: number) {
        TTApiUtils.setFrameRate(rate);
    }

    public showShareMenu(){
        TTApiUtils.showShareMenu();
    }
}

