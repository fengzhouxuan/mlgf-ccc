import { _decorator, Button, Component, EventTouch, Node, sp, Sprite } from 'cc';
import { AudioManager } from '../../Audio/AudioManager';
import { GameEntry } from '../../../GameMain/Script/Base/GameEntry';
const { ccclass, property } = _decorator;

@ccclass('MLButton')
export class MLButton extends Button {
    @property
    soundId = 0;
    @property
    enableRepeatClick =false;
    @property
    repeatClickInterval = 0.5;
    @property
    repeatClickDelay = 1.5;
    private _isTouching = false;
    private _repeatDelay=0;
    private _sprite:Sprite;
    protected _onTouchEnded(event?: EventTouch) {
        super._onTouchEnded(event);
        this._isTouching=false;
        this.simuClick();
    }

    protected _onTouchBegan(event?: EventTouch): void {
        super._onTouchBegan(event);
        this._isTouching=true;
        this._repeatDelay = this.repeatClickDelay;
    }

    protected _onTouchCancel(event?: EventTouch): void {
        super._onTouchCancel(event);
        this._isTouching=false;
    }

    protected onLoad(): void {
        this._sprite  = this.getComponent(Sprite);
    }

    onDisable(): void {
        super.onDisable();
        this._isTouching=false;
    }

    update(dt: number): void {
        super.update(dt);
        if(!this.enableRepeatClick){
            return;
        }
        if(this._isTouching){
            this._repeatDelay-=(dt/GameEntry.gameSpeed);
            if(this._repeatDelay<=0){
                this._repeatDelay = this.repeatClickInterval;
                this.simuClick(true);
            }
        }
    }

    setGray(gray:boolean){
        if(this._sprite){
            this._sprite.grayscale = gray;
        }
    }

    private simuClick(emit:boolean=false){
        if(emit){
            this.node.emit(Button.EventType.CLICK, this);
        }
        if(this.soundId<0){
            return;
        }
        if (this.soundId == 0) { 
            AudioManager.playButton(); 
        } else {
            AudioManager.playEffect(this.soundId);
        }
    }
}

