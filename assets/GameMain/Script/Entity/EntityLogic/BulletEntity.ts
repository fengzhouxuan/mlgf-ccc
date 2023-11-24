import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameEntityLogic } from '../../../../Framework/Script/EntityComponent/GameEntityLogic';
import { BulletEntityData } from '../EntityData/BulletEntityData';
import { ReferencePool } from '../../../../Framework/Script/ReferencePool/ReferencePool';
const { ccclass, property } = _decorator;

@ccclass('BulletEntity')
export class BulletEntity extends GameEntityLogic {
    private _data:BulletEntityData;
    private _moveDirection:Vec3;
    private _moveSpeed:number;
    onShow(userData: object): void {
        super.onShow(userData);
        this._data = userData as BulletEntityData;
        this._moveDirection = this._data.moveDirection;
        this._moveDirection.normalize();
        this._moveSpeed = this._data.moveSpeed;
    }
    private _outPos=new Vec3();
    onUpdate(dt: number): void {
        super.onUpdate(dt);
        this.node.getWorldPosition(this._outPos);
        this._outPos.x += this._moveDirection.x*dt*this._moveSpeed;
        this._outPos.y += this._moveDirection.y*dt*this._moveSpeed;
        this._outPos.z += this._moveDirection.z*dt*this._moveSpeed;
        if(this._outPos.y>=3){
            this.hideSelf();
            return;
        }
        this.node.setWorldPosition(this._outPos);
    }

    onHide(userData: object): void {
        super.onHide(userData);
        ReferencePool.release(this._data);
    }
}

