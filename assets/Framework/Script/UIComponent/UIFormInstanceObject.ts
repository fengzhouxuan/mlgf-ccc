import { PoolObjectBase } from "../ObjectPool/PoolObjectBase";
import { UIFormHelper } from "./UIFormHelper";

export class UIFormInstanceObject extends PoolObjectBase {
    public static CustomUnitName: string = "UIFormInstanceObject";

    private _uiFormAsset:object=null;
    private _uiFormHelper:UIFormHelper=null;

    constructor(){
        super();
        this._uiFormAsset=null;
        this._uiFormHelper=null;
    }

    public get customUnitName(): string {
        return UIFormInstanceObject.CustomUnitName;
    }

    public initialize(name: string, uiFormAsset: object, uiFormInstance: object, uiFormHelper: UIFormHelper): UIFormInstanceObject{
        this.init(name, uiFormInstance);
        this._uiFormAsset = uiFormAsset;
        this._uiFormHelper= uiFormHelper;
        return this;
    }

    public release() {
        this._uiFormHelper.releaseUIForm(this._uiFormAsset,this.target);
    }

    clear(): void {
        super.clear();
        this._uiFormAsset = null;
        this._uiFormHelper = null;
    }

}