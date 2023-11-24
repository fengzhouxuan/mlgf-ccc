import { AudioClip, Node } from "cc";

export abstract class AudioHelper {
    abstract init(root:Node,maxAudioChannel: number);

    abstract playMusic(audioAsset: AudioClip, volume: number);
    abstract stopMusic();
    abstract playEffect(audioAsset: AudioClip, volume: number);
}