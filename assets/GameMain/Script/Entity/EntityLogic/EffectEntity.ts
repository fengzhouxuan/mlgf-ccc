import { _decorator, Component, Node, ParticleSystem } from 'cc';
import { GameEntityLogic } from '../../../../Framework/Script/EntityComponent/GameEntityLogic';
import { EffectEntityData } from '../EntityData/EffectEntityData';
const { ccclass, property } = _decorator;

@ccclass('EffectEntity')
export class EffectEntity extends GameEntityLogic {
    private _data:EffectEntityData;
    private _particle:ParticleSystem;
    private _keepTime:number;
    private _elapsedTime=0;
    onInit(userData: object): void {
        super.onInit(userData);
        this._particle = this.getComponent(ParticleSystem);
    }

    onShow(userData: object): void {
        super.onShow(userData);
        this._data = userData as EffectEntityData;
        this._keepTime = this._data.keepTime;
        if(this._particle){
            this._particle.play();
        }
    }
    
    onHide(userData: object): void {
        super.onHide(userData);
        this._elapsedTime=0;
        this._particle?.stop();
    }

    onUpdate(dt: number): void {
        super.onUpdate(dt);
        if(this._keepTime<=0){
            return;
        }
        this._elapsedTime+=dt;
        if(this._elapsedTime>=this._keepTime){
            this.hideSelf();
        }
    }
}

