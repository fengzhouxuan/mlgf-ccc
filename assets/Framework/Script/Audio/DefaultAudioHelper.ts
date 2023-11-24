import { Node, AudioClip, AudioSource } from "cc";
import { AudioHelper } from "./AudioHelper";

export class DefaultAudioHelper extends AudioHelper {

    private _musicAgent: AudioSource;
    private _effectAgents: AudioSource[] = [];
    private _maxEffectChannel: number;
    private _effectNode: Node;
    init(root: Node, maxAudioChannel: number) {
        this._maxEffectChannel = maxAudioChannel;
        let musicNode = root.getChildByName("Music");
        if (!musicNode) {
            musicNode = new Node("Music");
            musicNode.parent = root;
        }
        this._musicAgent = musicNode.getOrAddComponent(AudioSource);
        this._musicAgent.playOnAwake = false;
        this._musicAgent.loop = true;

        this._effectNode = root.getChildByName("Effect");
        if (!this._effectNode) {
            this._effectNode = new Node("Effect");
            this._effectNode.parent = root;
        }
    }

    playMusic(audioAsset: AudioClip, volume: number) {
        this._musicAgent.clip = audioAsset;
        this._musicAgent.volume = volume;
        this._musicAgent.play();
    }

    stopMusic() {
        this._musicAgent.stop();
    }
    playEffect(audioAsset: AudioClip, volume: number) {
        let agent = this.getCandidateEffectAgent();
        if (agent) {
            agent.clip = audioAsset;
            agent.volume = volume;
            agent.loop = false;
            agent.play();
        }
    }

    getCandidateEffectAgent(): AudioSource {
        let candidateAgent: AudioSource = null;
        for (let i = 0; i < this._effectAgents.length; i++) {
            const effectAgent = this._effectAgents[i];
            if (!effectAgent.playing) {
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
        candidateAgent = this._effectNode.addComponent(AudioSource);
        this._effectAgents.push(candidateAgent);
        return candidateAgent;
    }
}