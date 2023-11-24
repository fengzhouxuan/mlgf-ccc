import { AudioConfigData } from "../../../FrameworkUtil/Audio/AudioManager"

export enum AudioId {
    Click = 100,
}

AudioConfigData[AudioId.Click] = { bundleName: "Audio", assetName: "Click", volume: 0.3 };