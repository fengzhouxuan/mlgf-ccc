import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { IReference } from "../ReferencePool/IReference";
import { UIForm } from "./UIForm";

export class OpenUIFormSuccessEventArgs extends BaseEventArgs {
    public static EventId: string = "OpenUIFormSuccessEventArgs";

    private _uiForm:UIForm=null;
    private _userData:object=null;
    private _duration:number=0;
    constructor(){
        super();
        this._uiForm = null;
        this._userData=null;
        this._duration = 0;
    }
    clear() {
        this._uiForm = null;
        this._userData = null;
        this._duration = 0;
    }
    public get eventId(): string {
        return OpenUIFormSuccessEventArgs.EventId;
    }
    get customUnitName(): string {
        return OpenUIFormSuccessEventArgs.EventId;
    }
    
    public get uiForm() : UIForm {
        return this._uiForm
    }
    
    get userData() {
        return this._userData;
    }
    
    public get duration() : number {
        return this._duration;
    }

    public initialize(uiForm: UIForm, duration:number, userData: object): OpenUIFormSuccessEventArgs{
        this._uiForm = uiForm;
        this._userData = userData;
        this._duration = duration;
        return this;
    }
    
}