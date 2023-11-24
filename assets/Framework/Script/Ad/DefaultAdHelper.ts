import { AdHelepr } from "./AdHelper";

export class DefaultAdHelper extends AdHelepr{
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