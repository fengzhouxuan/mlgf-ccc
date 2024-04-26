import { _decorator } from 'cc';
import { AppEnvType, LoginInfo } from '../AppComponent';
const { ccclass } = _decorator;

@ccclass('SystemInfoHelper')
export abstract class SystemInfoHelper {
    public init() {
        this.onInit();
    }
    public abstract onInit();

    public abstract onShow(onShow: (res) => void);

    public abstract offShow(onShow: (res) => void);

    public abstract onHide(onHide: (res) => void);

    public abstract offHide(onHide: (res) => void);
    /**
     * 返回视图窗口可见区域尺寸。
     */
    public abstract getScreenSize(): { width: number, height: number };

    public abstract login(success: (info: LoginInfo) => void, fail: () => void);

    public abstract checkUpdate(title: string, content: string);

    public abstract onAudioInterruptionEnd(callback: Function);

    public abstract vibrateShort();
    public abstract vibrateLong();
    public abstract setFrameRate(rate: number);
    public abstract showShareMenu();
    public abstract triggerGC();
    public abstract getEnvType():AppEnvType;
}

