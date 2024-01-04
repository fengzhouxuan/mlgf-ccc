import { IReference } from "../ReferencePool/IReference";
import { ReferencePool } from "../ReferencePool/ReferencePool";

export class LoadUIPopFormInfo implements IReference{
    public static CustomUnitName: string = "LoadUIPopFormInfo";
    get customUnitName(): string {
        return LoadUIPopFormInfo.CustomUnitName;
    }

    private _serialId: number = 0;
    private _pauseCoveredUIForm: boolean;
    private _uiFormBundleName:string;
    private _uiFormAssetName:string;
    private _uiGroundName:string;
    private _userData: object = null;
    
    constructor(){
        this._serialId = 0;
        this._uiFormBundleName=null;
        this._pauseCoveredUIForm = false;
        this._uiGroundName=null;
        this._uiFormAssetName=null;
        this._userData = null;
    }
    clear() {
        this._serialId = 0;
        this._uiFormBundleName=null;
        this._pauseCoveredUIForm = false;
        this._uiGroundName=null;
        this._uiFormAssetName=null;
        this._userData = null;
    }

    public get serialId(): number {
        return this._serialId;
    }

    public get pauseCoveredUIForm(): boolean {
        return this._pauseCoveredUIForm;
    }
    
    public get uiFormBundleName() : string {
        return this._uiFormBundleName;
    }

    public set uiFormBundleName(v : string) {
        this._uiFormBundleName = v;
    }
    
    public get uiGroundName() : string {
        return this._uiGroundName;
    }

    public set uiGroundName(v : string) {
        this._uiGroundName = v;
    }
    
    public get uiFormAssetName() : string {
        return this._uiFormAssetName;
    }
    
    public get userData(): object {
        return this._userData;
    }

    public static create(serialId:number,bundleName:string,assetName:string, uiGroundName:string,pauseCoveredUIForm:boolean,userData:object):LoadUIPopFormInfo{
        let info = ReferencePool.acquire(LoadUIPopFormInfo.CustomUnitName,LoadUIPopFormInfo);
        info._serialId = serialId;
        info._uiFormBundleName = bundleName;
        info._uiGroundName = uiGroundName;
        info._pauseCoveredUIForm = pauseCoveredUIForm;
        info._uiFormAssetName = assetName;
        info._userData = userData;
        return info;
    }

}