import { GameEntry } from "../../GameMain/Script/Base/GameEntry";

export interface AudioConfig {
    /** bundle包名 */
    bundleName: string;
    /** 预制资源相对路径 */
    assetName: string;
    volume: number
}

enum BuiltInAudioId{
    Button=1
}

export var AudioConfigData: { [key: number]: AudioConfig } = {
    [BuiltInAudioId.Button]: { bundleName: "Audio", assetName: "Buttons", volume: 0.2 },
}
export class AudioManager {
    private static _downloadCompleted = false;
    private static _musicId = null;
    public static downloadRes() {

        let onFail = function (res) {

        }
        let onProgress = function (res) {

        }
        GameEntry.platform.loadPackge("Audio", function (res) {
            this.onDownloadComplete();
        }.bind(this),
            onFail.bind(this),
            onProgress.bind(this));
    }

    private static onDownloadComplete() {
        this._downloadCompleted = true;
        if (this._musicId != null) {
            this.playMusic(this._musicId);
        }
    }

    public static playMusic(id?: number) {
        if (id) {
            this._musicId = id;
        }
        if (GameEntry.user.getMusicMute()) {
            return;
        }
        if (!this._downloadCompleted) {
            return;
        }
        let musicId = id == null ? this._musicId : id;
        if (musicId == null) {
            return;
        }
        let data = AudioConfigData[musicId];
        if (!data) {
            console.log("audio id 不存在" + musicId);
            return;
        }
        GameEntry.audio.playMusic(data.bundleName, data.assetName, data.volume);
    }

    public static stopMusic() {
        GameEntry.audio.stopMusic();
    }

    public static resumeMusic() {
        if (GameEntry.user.getMusicMute()) {
            return;
        }
        if (this._musicId != null) {
            this.playMusic(this._musicId);
        }
    }

    public static playEffect(id: number) {
        if (GameEntry.user.getSoundMute()) {
            return;
        }
        if (!this._downloadCompleted) {
            return;
        }
        let data = AudioConfigData[id];
        if (!data) {
            console.log("audio id 不存在" + id);
            return;
        }
        GameEntry.audio.playEffect(data.bundleName, data.assetName, data.volume);
    }

    public static playButton() {
        this.playEffect(BuiltInAudioId.Button);
    }

    public static vibrateShort(medium=false) {
        if (GameEntry.user.getVibrateMute()) {
            return;
        }
        if(medium){
            GameEntry.platform.vibrateShortMedium();
        }else{
            GameEntry.platform.vibrateShort();
        }
    }

}