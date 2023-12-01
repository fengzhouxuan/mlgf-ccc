import { IReference } from "../ReferencePool/IReference";

export class LoadAudioInfo implements IReference{
    public static CustomUniName = "LoadAudioInfo";
    private _isMusic:boolean;
    private _assetName:string;
    private _serId:number;
    private _volume:number;

    get serId():number{
        return this._serId;
    }

    public get assetName() : string {
        return this._assetName;
    }
    
    public get isMusic() : boolean {
        return this._isMusic;
    }
    
    public get volume() : number {
        return this._volume;
    }
    
    get customUnitName(): string {
        return LoadAudioInfo.CustomUniName;
    }
    
    constructor(){
        this.clear();
    }

    public init(serialId:number,assetName:string,volume:number,isMusic:boolean):LoadAudioInfo{
        this._serId = serialId;
        this._assetName = assetName;
        this._isMusic = isMusic;
        this._volume = volume;
        return this;
    }

    clear() {
        this._isMusic = false;
        this._assetName=null
        this._serId = 0;
    }





}