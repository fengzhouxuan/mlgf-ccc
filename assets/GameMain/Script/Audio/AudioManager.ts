import { GameEntry } from "../Base/GameEntry";

export interface AudioConfig {
    /** bundle包名 */
    bundleName: string;
    /** 预制资源相对路径 */
    assetName: string;
    volume: number
}

export enum AudioId {
    BGM = 1,
    Button = 2,
    Click = 3,
    Merge=4
}
export var UIConfigData: { [key: number]: AudioConfig } = {
    [AudioId.BGM]: { bundleName: "Audio", assetName: "BGM", volume: 1 },
    [AudioId.Button]: { bundleName: "Audio", assetName: "Buttons", volume: 0.2 },
    [AudioId.Click]: { bundleName: "Audio", assetName: "Click", volume: 0.3 },
    [AudioId.Merge]: { bundleName: "Audio", assetName: "Merge", volume: 1 },
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

    public static playMusic(id?: AudioId) {
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
        let data = UIConfigData[musicId];
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

    public static playEffect(id: AudioId) {
        if (GameEntry.user.getSoundMute()) {
            return;
        }
        if (!this._downloadCompleted) {
            return;
        }
        let data = UIConfigData[id];
        if (!data) {
            console.log("audio id 不存在" + id);
            return;
        }
        GameEntry.audio.playEffect(data.bundleName, data.assetName, data.volume);
    }

    public static playButton() {
        this.playEffect(AudioId.Button);
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