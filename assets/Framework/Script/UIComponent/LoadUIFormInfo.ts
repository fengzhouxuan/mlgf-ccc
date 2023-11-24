import { IReference } from "../ReferencePool/IReference";
import { UIGroup } from "./UIGroup";

export class LoadUIFormInfo implements IReference{
    public static CustomUnitName: string = "LoadUIFormInfo";

    private _serialId: number = 0;
    private _uiGroup: UIGroup = null;
    private _pauseCoveredUIForm: boolean;
    private _uiFormAssetName:string;
    private _userData: object = null;
    
    constructor(){
        this._serialId = 0;
        this._uiGroup = null;
        this._pauseCoveredUIForm = false;
        this._uiFormAssetName=null;
        this._userData = null;
    }
    clear() {
        this._serialId=0;
        this._uiGroup=null;
        this._pauseCoveredUIForm=false;
        this._uiFormAssetName = null;
        this._userData= null;
    }
    get customUnitName(): string {
        return LoadUIFormInfo.CustomUnitName;
    }
    public get serialId(): number {
        return this._serialId;
    }
    public get uiGroup(): UIGroup {
        return this._uiGroup;
    }
    public get pauseCoveredUIForm(): boolean {
        return this._pauseCoveredUIForm;
    }
    
    public get uiFormAssetName() : string {
        return this._uiFormAssetName;
    }
    
    public get userData(): object {
        return this._userData;
    }

    public initialize(serialId:number,assetName:string, uiGroup:UIGroup,pauseCoveredUIForm:boolean,userData:object):LoadUIFormInfo{
        this._serialId = serialId;
        this._uiGroup = uiGroup;
        this._pauseCoveredUIForm = pauseCoveredUIForm;
        this._uiFormAssetName = assetName;
        this._userData = userData;
        return this;
    }
    
}