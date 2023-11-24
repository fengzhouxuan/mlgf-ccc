import { IReference } from "../ReferencePool/IReference";
import { UIForm } from "./UIForm";

export class UIFormInfo implements IReference{
    public static CustomUnitName: string = "UIFormInfo";

    private _uiForm:UIForm=null;
    private _paused:boolean;
    private _covered:boolean;

    constructor(){
        this._uiForm=null;
        this._paused=false;
        this._covered =false;
    }

    public get customUnitName(): string {
        return UIFormInfo.CustomUnitName;
    }

    
    public get uiForm() : UIForm {
        return this._uiForm;
    }

    public get paused() : boolean {
        return this._paused;
    }
    
    public set paused(v : boolean) {
        this._paused = v;
    }
    
    public get covered() : boolean {
        return this._covered;
    }
    
    public set covered(v : boolean) {
        this._covered = v;
    }
    
    public initialize(uiForm:UIForm):UIFormInfo{
        this._uiForm = uiForm;
        this._paused = true;
        this._covered = true;
        return this;
    }

    clear() {
        this._uiForm = null;
        this._paused = false;
        this._covered = false;
    }
}