import { Vec3 } from "cc";
import { EntityData } from "../../../../Framework/Script/EntityComponent/EntityData";
import { IReference } from "../../../../Framework/Script/ReferencePool/IReference";
import { GameEntry } from "../../Base/GameEntry";
import { ReferencePool } from "../../../../Framework/Script/ReferencePool/ReferencePool";

export class BulletEntityData extends EntityData implements IReference{
    public static CustomUnitName = "BulletEntityData";
    public static Create(moveSpeed:number,moveDirection:Vec3):BulletEntityData{
        let data = ReferencePool.acquire(this.CustomUnitName,BulletEntityData);
        data.moveSpeed = moveSpeed;
        data.moveDirection = moveDirection;
        return data;
    }

    private _moveSpeed = 0;
    private _moveDirection: Vec3;

    public get moveDirection(): Vec3 {
        return this._moveDirection;
    }
    public set moveDirection(value: Vec3) {
        this._moveDirection = value;
    }
    public get moveSpeed() {
        return this._moveSpeed;
    }
    public set moveSpeed(value) {
        this._moveSpeed = value;
    }

    constructor(moveSpeed:number,moveDirection:Vec3){
        super();
        this._moveSpeed = moveSpeed;
        this._moveDirection = moveDirection;
    }

    clear() {
        this._moveSpeed = 0;
        this._moveDirection = null;
    }
    get customUnitName(): string {
        return BulletEntityData.CustomUnitName;
    }
}