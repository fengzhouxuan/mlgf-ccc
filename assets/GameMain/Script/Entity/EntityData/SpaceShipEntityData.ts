import { EntityData } from "../../../../Framework/Script/EntityComponent/EntityData";

export class SpaceShipEntityData extends EntityData{
    private _attackSpeed = 0;
    public get attackSpeed() {
        return this._attackSpeed;
    }
    public set attackSpeed(value) {
        this._attackSpeed = value;
    }

    constructor(attackSpeed:number){
        super();
        this._attackSpeed = attackSpeed;
    }
}