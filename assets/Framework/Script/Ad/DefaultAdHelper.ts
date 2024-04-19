import { AdHelper } from "./AdHelper";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass('DefaultAdHelper')
export class DefaultAdHelper extends AdHelper{
    get platformName(): string {
        return "default";
    }
    onInit() {

    }
    isVideoReady(): boolean {
        return true;
    }
    playVideo(onClose: (resCode: number) => void, scene: string) {
        onClose(0);
    }

}