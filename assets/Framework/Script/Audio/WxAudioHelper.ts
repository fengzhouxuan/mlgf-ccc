import { Node, AudioClip } from "cc";
import { AudioHelper } from "./AudioHelper";

let wx = window["wx"];

export class WxAudioHelper extends AudioHelper{
    private _musicAgent: any;
    private _effectAgents: any[] = [];
    private _maxEffectChannel: number;
    init(root:Node,maxAudioChannel: number) {
        this._maxEffectChannel = maxAudioChannel;
        this._musicAgent = wx.createInnerAudioContext();
        this._musicAgent.loop=true;
    }
    playMusic(audioAsset: AudioClip, volume: number) {
        this._musicAgent.src = audioAsset.nativeUrl;
        this._musicAgent.volume = volume;
        this._musicAgent.play();
    }
    stopMusic() {
        this._musicAgent.stop();
    }
    playEffect(audioAsset: AudioClip, volume: number) {
        let agent = this.getCandidateEffectAgent();
        if (agent) {
            agent.src = audioAsset.nativeUrl;
            agent.volume = volume;
            agent.loop = false;
            agent.play();
        }
    }

    getCandidateEffectAgent(): any {
        let candidateAgent: any = null;
        for (let i = 0; i < this._effectAgents.length; i++) {
            const effectAgent = this._effectAgents[i];
            if (effectAgent.paused) {
                candidateAgent = effectAgent;
                break;
            }
        }
        if (candidateAgent) {
            return candidateAgent;
        }
        let outOfSize = this._effectAgents.length >= this._maxEffectChannel;
        if (outOfSize) {
            return null;
        }
        candidateAgent = wx.createInnerAudioContext({
            useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
          });
        this._effectAgents.push(candidateAgent);
        return candidateAgent;
    }
}