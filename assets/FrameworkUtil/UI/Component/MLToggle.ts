import { _decorator, Component, Node, Sprite, Toggle } from 'cc';
import { AudioManager } from '../../Audio/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MLToggle')
export class MLToggle extends Toggle {
    @property
    soundId = 0;
    @property({type:Sprite})
    toggleBg:Sprite;
    @property
    hideToggleBgWhenCheck=false;
    protected _internalToggle () {
        super._internalToggle();
        if(this.soundId<0){
            return;
        }
        if (this.soundId == 0) { 
            AudioManager.playButton(); 
        } else {
            AudioManager.playEffect(this.soundId);
        }
    }

    public playEffect () {
        if (this._checkMark) {
            this._checkMark.node.active = this._isChecked;
        }
        if(this.toggleBg && this.hideToggleBgWhenCheck){
            this.toggleBg.enabled = !this._isChecked;
        }
    }
}


