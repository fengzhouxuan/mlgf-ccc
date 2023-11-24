import { _decorator, Component, Node, ParticleSystem2D } from 'cc';
import { UIEntityTrack3d } from '../../GameMain/CustomComponent/UIEntity/UIEntityTrack3d';
import { GameEntry } from '../../GameMain/Script/Base/GameEntry';
import { UIParticleEntityData } from './UIParticleEntityData';
const { ccclass, property } = _decorator;

@ccclass('UIParticleEntity')
export class UIParticleEntity extends UIEntityTrack3d {
    private _particleData: UIParticleEntityData;
    private _keepTime: number;
    private _keepedTime: number = 0;
    private _paticle: ParticleSystem2D;
    onInit(userData: object): void {
        super.onInit(userData);
        this._paticle = this.getComponentInChildren(ParticleSystem2D);
    }
    onShow(userData: object): void {
        super.onShow(userData);
        this._particleData = userData as UIParticleEntityData;
        this._keepTime = this._particleData.keepTime;
        if (this._paticle) {
            this._paticle.resetSystem();
        }
    }

    onHide(userData: object): void {
        super.onHide(userData);
        this._keepedTime = 0;
    }

    onUpdate(dt: number): void {
        this._keepedTime += dt;
        if (this._keepTime > 0 && this._keepedTime >= this._keepTime) {
            GameEntry.entity.hideEntity(this.entityId);
        }
    }
}

