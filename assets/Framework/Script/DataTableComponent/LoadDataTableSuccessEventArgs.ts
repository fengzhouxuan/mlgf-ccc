import { BaseEventArgs } from "../EventComponent/BaseEventArgs";
import { IReference } from "../ReferencePool/IReference";

export class LoadDataTableSuccessEventArgs extends BaseEventArgs {
    public static EventId: string = "LoadDataTableSuccessEventArgs";
    private _dataTableAssetName:string;
    private _dataTableAssetNames: string[];
    constructor() {
        super();
        this._dataTableAssetName =null;
    }
    get customUnitName(): string {
        return LoadDataTableSuccessEventArgs.EventId;
    }
    public get eventId(): string {
        return LoadDataTableSuccessEventArgs.EventId;
    }

    
    public get dataTableAssetName() : string {
        return this._dataTableAssetName;
    }

    public initialize(dataTableAssetName: string, userData?: object): LoadDataTableSuccessEventArgs {
        this._dataTableAssetName = dataTableAssetName;
        return this;
    }
    
    clear() {
        this._dataTableAssetName = null;
    }

}