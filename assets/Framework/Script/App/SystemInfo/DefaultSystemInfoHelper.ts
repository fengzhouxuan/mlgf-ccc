import { _decorator, game, view} from 'cc';
import { SystemInfoHelper } from './SystemInfoHelper';
import { LoginInfo } from '../AppComponent';
const { ccclass } = _decorator;

@ccclass('DefaultSystemInfoHelper')
export class DefaultSystemInfoHelper extends SystemInfoHelper{
    public onInit(){
        
    }
    public onShow(onShow: (res) => void){}

    public offShow(onShow: (res) => void){}

    public onHide(onHide: (res) => void){}

    public offHide(onHide: (res) => void){}
    public login(success: (info: LoginInfo) => void, fail: () => void) {
        setTimeout(() => {
            success({
                code: '123456',
            });
        }, 1);
    }
    public getScreenSize(): { width: number; height: number; } {
        let size = view.getVisibleSize();
        return {
            width:size.width,
            height: size.height,
        };
    }
    
    public checkUpdate(title:string,content:string){}
    public onAudioInterruptionEnd(callback: Function) {}
    public vibrateLong() {}
    public vibrateShort() {}
    public setFrameRate(rate: number) {
        game.frameRate = rate;
    }
    public showShareMenu(){}
    public triggerGC(){}
}

