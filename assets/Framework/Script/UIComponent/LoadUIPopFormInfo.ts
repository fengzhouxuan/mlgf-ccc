import { IReference } from "../ReferencePool/IReference";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { UIGroup } from "./UIGroup";

export class LoadUIPopFormInfo implements IReference{
    public static CustomUnitName: string = "LoadUIPopFormInfo";
    get customUnitName(): string {
        return LoadUIPopFormInfo.CustomUnitName;
    }

    private _serialId: number = 0;
    private _pauseCoveredUIForm: boolean;
    private _uiFormBundleName:string;
    private _uiFormAssetName:string;
    private _uiGroupName:string;
    private _uiGroup:UIGroup;
    private _userData: object = null;
    
    constructor(){
        this.clear();
    }
    clear() {
        this._serialId = 0;
        this._uiFormBundleName=null;
        this._pauseCoveredUIForm = false;
        this._uiGroupName=null;
        this._uiGroup=null;
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
        return this._uiGroupName;
    }

    public set uiGroundName(v : string) {
        this._uiGroupName = v;
    }

    
    public get uiGroup() : UIGroup {
        return this._uiGroup;
    }
    
    public set uiGroup(v : UIGroup) {
        this._uiGroup = v;
    }
    
    public get uiFormAssetName() : string {
        return this._uiFormAssetName;
    }
    
    public get userData(): object {
        return this._userData;
    }

    public static create(serialId:number,bundleName:string,assetName:string, uiGroundName:string,uiGroup:UIGroup,pauseCoveredUIForm:boolean,userData:object):LoadUIPopFormInfo{
        let info = ReferencePool.acquire(LoadUIPopFormInfo.CustomUnitName,LoadUIPopFormInfo);
        info._serialId = serialId;
        info._uiFormBundleName = bundleName;
        info._uiGroupName = uiGroundName;
        info._uiGroup = uiGroup;
        info._pauseCoveredUIForm = pauseCoveredUIForm;
        info._uiFormAssetName = assetName;
        info._userData = userData;
        return info;
    }

}