import { PoolObjectBase } from "../ObjectPool/PoolObjectBase";
import { EntityHelper } from "./EntityHelper";

export class EntityInstanceObject extends PoolObjectBase{

    private _entityAsset:object=null;
    private _entityHelper:EntityHelper=null;

    public static CustomUnitName: string ="EntityInstanceObject";

    constructor(){
        super();
        this._entityAsset = null;
        this._entityHelper = null;
    }
    public get customUnitName(): string {
        return EntityInstanceObject.CustomUnitName;
    }

    public initialize(name: string, entityAsset: object, entityInstance: object, entityHelper: EntityHelper): EntityInstanceObject{
        this.init(name, entityInstance);
        this._entityAsset = entityAsset;
        this._entityHelper = entityHelper;
        return this;
    }

    clear(): void {
        super.clear();
        this._entityAsset = null;
        this._entityHelper = null;
    }

    public release() {
        this._entityHelper.releaseEntity(this._entityAsset,this.target);

    }

    public OnSpawn(isNewInstance:boolean): void {

    }

    public onUnspawn(): void {

    }

}