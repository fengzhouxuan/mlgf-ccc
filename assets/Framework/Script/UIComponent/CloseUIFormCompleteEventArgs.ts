import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { IReference } from "../ReferencePool/IReference";
import { UIGroup } from "./UIGroup";

export class CloseUIFormCompleteEventArgs extends BaseEventArgs {
    public static EventId: string = "CloseUIFormCompleteEventArgs";
    private _serialId: number;
    private _uiFormAssetName: string;
    private _uiGroup: UIGroup;
    private _userData: object;

    constructor() {
        super();
        this._serialId = 0;
        this._uiFormAssetName = null;
        this._uiGroup = null;
        this._userData = null;
    }
    clear() {
        this._serialId = 0;
        this._uiFormAssetName = null;
        this._uiGroup = null;
        this._userData = null;
    }
    public get eventId(): string {
        return CloseUIFormCompleteEventArgs.EventId;
    }
    get customUnitName(): string {
        return CloseUIFormCompleteEventArgs.EventId;
    }

    public get serialId(): number {
        return this._serialId;
    }
    public get uiFormAssetName(): string {
        return this._uiFormAssetName;
    }
    public get uiGroup(): UIGroup {
        return this._uiGroup;
    }
    public get userData(): object {
        return this._userData;
    }

    public initialize(serialId: number, uiFormAssetName: string, uiGroup: UIGroup, userData: object):CloseUIFormCompleteEventArgs {
        this._serialId = serialId;
        this._uiFormAssetName = uiFormAssetName;
        this._uiGroup = uiGroup;
        this._userData = userData;
        return this;
    }
}