import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameEntityLogic } from '../../../../Framework/Script/EntityComponent/GameEntityLogic';
import { BulletEntityData } from '../EntityData/BulletEntityData';
import { EntityManager } from '../EntityManager';
import { SpaceShipEntityData } from '../EntityData/SpaceShipEntityData';
import { EntityExtension } from '../EntityExtension';
const { ccclass, property } = _decorator;

@ccclass('SpaceShipEntity')
export class SpaceShipEntity extends GameEntityLogic {
    private _data:SpaceShipEntityData;
    private _firePoint:Node;
    private _attackSpeed =0;
    private _attackIntervalAdd=0;
    onInit(userData: object): void {
        super.onInit(userData);
        this._firePoint = this.node.getChildByName("FirePoint");
    }

    onShow(userData: object): void {
        super.onShow(userData);
        this._data = userData as SpaceShipEntityData;
        this._attackSpeed = this._data.attackSpeed;
    }
    onHide(userData: object): void {
        super.onHide(userData);
        this._attackIntervalAdd=0;
    }

    onUpdate(dt: number): void {
        super.onUpdate(dt);
        this._updateFire(dt);
    }

    private _updateFire(dt:number){
        this._attackIntervalAdd+=dt;
        if(this._attackIntervalAdd>=(1/this._attackSpeed)){
            this._showBullet();
            this._attackIntervalAdd=0;
        }
    }

    private _showBullet(){
        let data = BulletEntityData.Create(4,new Vec3(0,1,0));
        data.position = this._firePoint.worldPosition;
        // EntityManager.ShowBullet(data);
        EntityExtension.ShowBullet1(data);
    }
}

